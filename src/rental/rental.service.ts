import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RentalEntity } from './rental.entity';
import { BookEntity } from '../book/book.entity';
import { UserEntity } from '../user/user.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { CreateRentalsResponseDto } from './dto/create-rental-response.dto';
import { RentalDto } from './dto/rental.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RentalService {
    constructor(
        @InjectRepository(RentalEntity)
        private readonly rentalRepository: Repository<RentalEntity>,

        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createRental(
        newRental: CreateRentalDto,
    ): Promise<CreateRentalsResponseDto> {
        const user = await this.userRepository.findOneBy({
            id: newRental.userId,
        });
        if (!user) {
            throw new NotFoundException(
                'User with the provided ID was not found.',
            );
        }

        const book = await this.bookRepository.findOneBy({
            id: newRental.bookId,
        });
        if (!book) {
            throw new NotFoundException(
                'Book with the provided ID was not found.',
            );
        }

        if (book.availableCopies <= 0) {
            throw new BadRequestException('No available copies of this book.');
        }

        book.availableCopies -= 1;
        await this.bookRepository.save(book);

        const rentalPeriodInDays = 14;
        const dueDate = new Date(
            Date.now() + rentalPeriodInDays * 24 * 60 * 60 * 1000,
        );

        const rental = this.rentalRepository.create({
            userId: user.id,
            bookId: book.id,
            rentalDate: new Date(),
            dueDate,
        });

        const savedRental = await this.rentalRepository.save(rental);

        return {
            id: savedRental.id,
            rentalDate: savedRental.rentalDate,
            dueDate: savedRental.dueDate,
            rentalStatus: 'borrowed',
        };
    }

    async findRental(filters: { bookId?: string }): Promise<RentalDto> {
        const where: FindOptionsWhere<RentalEntity> = {};

        if (filters.bookId) {
            where.bookId = filters.bookId;
        }

        const rental = await this.rentalRepository.findOne({
            where,
            relations: ['book'],
            select: {
                id: true,
                rentalDate: true,
                dueDate: true,
                rentalStatus: true,
                returnedAt: true,
                book: {
                    id: true,
                    title: true,
                    author: true,
                },
            },
        });

        if (!rental) {
            throw new NotFoundException(
                'No rental found for the specified book.',
            );
        }

        return plainToInstance(RentalDto, rental, {
            excludeExtraneousValues: true,
        });
    }

    async findRentals(filters: {
        userId?: string;
        bookId?: string;
    }): Promise<RentalResponseDto[]> {
        const where: FindOptionsWhere<RentalEntity> = {};

        if (filters.userId) {
            where.userId = filters.userId;
        }

        if (filters.bookId) {
            where.bookId = filters.bookId;
        }

        const rentals = await this.rentalRepository.find({
            where,
            relations: ['user', 'book'],
            select: {
                id: true,
                rentalDate: true,
                returnedAt: true,
                dueDate: true,
                rentalStatus: true,
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    libraryCardNumber: true,
                },
                book: {
                    id: true,
                    title: true,
                    author: true,
                },
            },
        });

        return rentals;
    }

    async getAllRentals(): Promise<RentalResponseDto[]> {
        return this.findRentals({});
    }

    async returnBook(rentalId: string): Promise<{ message: string }> {
        const rental = await this.rentalRepository.findOne({
            where: { id: rentalId },
            relations: ['book'],
        });

        if (!rental) {
            throw new NotFoundException(
                'No rental found with the provided ID.',
            );
        }

        if (rental.rentalStatus !== 'borrowed') {
            throw new BadRequestException('The book is not currently rented.');
        }

        rental.rentalStatus = 'returned';
        rental.returnedAt = new Date();

        rental.book.availableCopies += 1;
        await this.bookRepository.save(rental.book);

        await this.rentalRepository.save(rental);

        return { message: 'The book has been successfully returned.' };
    }
}
