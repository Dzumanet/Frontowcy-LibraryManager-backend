import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookCategoryEnum, BookEntity } from './book.entity';
import { RegisterBookDto } from './dto/register-book.dto';
import { RegisterBookResponseDto } from './dto/register-book-response.dto';
import { DeleteBookResponseDto } from './dto/delete-book-response.dto';
import { BookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { isUUID } from 'class-validator';
import { GetBooksFilterDto } from './dto/get-books-filter.dto';
import { Repository } from 'typeorm';
import { BooksListResponseDto } from './dto/books-list-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { LoanStatusEnum } from '../loan/loan.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly booksRepository: Repository<BookEntity>,
    ) {}

    async registerBook(
        newBook: RegisterBookDto,
    ): Promise<RegisterBookResponseDto> {
        const existingBook = await this.booksRepository.findOne({
            where: { title: newBook.title, author: newBook.author },
        });

        if (existingBook) {
            return {
                message: 'This book already exists.',
                exists: true,
                bookCreated: false,
            };
        }

        const book = this.booksRepository.create({
            title: newBook.title,
            author: newBook.author,
            description: newBook.description,
            year: newBook.year,
            totalCopies: newBook.totalCopies,
            availableCopies: newBook.totalCopies,
            category: newBook.category,
            bookPictureUrl: newBook.bookPictureUrl,
        });

        try {
            await this.booksRepository.save(book);

            return {
                message: 'The book has been registered.',
                id: book.id,
                exists: false,
                bookCreated: true,
            };
        } catch (error) {
            throw new HttpException(
                {
                    message: 'Failed to register the book.',
                    errors: [error.message],
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllBooks(
        filterDto: GetBooksFilterDto,
    ): Promise<BooksListResponseDto> {
        const {
            page = 1,
            pageSize = 10,
            author,
            title,
            category,
            sortBy,
            sortOrder,
        } = filterDto;
        const offset = (page - 1) * pageSize;

        const totalQuery = this.booksRepository
            .createQueryBuilder('book')
            .select('COUNT(DISTINCT book.id)', 'count');

        if (author) {
            totalQuery.andWhere('book.author LIKE :author', {
                author: `%${author}%`,
            });
        }
        if (title) {
            totalQuery.andWhere('book.title LIKE :title', {
                title: `%${title}%`,
            });
        }
        if (category) {
            totalQuery.andWhere('book.category = :category', { category });
        }

        const total = await totalQuery.getRawOne();

        const query = this.booksRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect(
                'book.loans',
                'loan',
                'loan.loanStatus = :status',
                { status: LoanStatusEnum.BORROWED },
            )
            .select([
                'book.id',
                'book.title',
                'book.author',
                'book.description',
                'book.year',
                'book.totalCopies',
                'book.availableCopies',
                'book.category',
                'book.bookPictureUrl',
                'book.createdAt',
                'loan.userId',
            ])
            .groupBy('book.id')
            .limit(pageSize)
            .offset(offset);

        if (author) {
            query.andWhere('book.author LIKE :author', {
                author: `%${author}%`,
            });
        }
        if (title) {
            query.andWhere('book.title LIKE :title', { title: `%${title}%` });
        }
        if (category) {
            if (
                !Object.values(BookCategoryEnum).includes(
                    category as BookCategoryEnum,
                )
            ) {
                throw new Error(`Invalid category: ${category}`);
            }
            query.andWhere('book.category = :category', { category });
        }

        if (sortBy && ['title', 'author'].includes(sortBy)) {
            const order =
                sortOrder && ['ASC', 'DESC'].includes(sortOrder)
                    ? sortOrder
                    : 'ASC';
            query.orderBy(`book.${sortBy}`, order);
        } else {
            query.orderBy('book.createdAt', 'DESC');
        }

        const books = await query.getMany();

        const mappedBooks = books.map((book) => {
            const userIds = book.loans?.map((loan) => loan.userId) || [];
            return plainToInstance(BookDto, {
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                year: book.year,
                totalCopies: book.totalCopies,
                availableCopies: book.availableCopies,
                category: book.category,
                createdAt: book.createdAt
                    ? new Date(book.createdAt).toISOString()
                    : null,
                bookPictureUrl: book.bookPictureUrl,
                isBorrowed: userIds.length > 0,
                userIds,
            });
        });

        const totalPages = Math.ceil(total.count / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            data: mappedBooks,
            meta: {
                total: total.count,
                page,
                pageSize,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        };
    }

    async getBookById(id: string): Promise<BookDto> {
        if (!isUUID(id)) {
            throw new HttpException(
                'Invalid book ID format',
                HttpStatus.BAD_REQUEST,
            );
        }

        const book = await this.booksRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect(
                'book.loans',
                'loan',
                'loan.loanStatus = :status',
                {
                    status: LoanStatusEnum.BORROWED,
                },
            )
            .where('book.id = :id', { id })
            .select([
                'book.id',
                'book.title',
                'book.author',
                'book.description',
                'book.year',
                'book.totalCopies',
                'book.availableCopies',
                'book.category',
                'book.bookPictureUrl',
                'loan.userId',
            ])
            .getOne();

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        const userIds = book.loans?.map((loan) => loan.userId) || [];

        return {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            year: book.year,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
            category: book.category,
            bookPictureUrl: book.bookPictureUrl,
            isBorrowed: userIds.length > 0,
            userIds,
        };
    }

    async deleteBook(id: string): Promise<DeleteBookResponseDto> {
        if (!isUUID(id)) {
            throw new HttpException(
                'Invalid book ID format',
                HttpStatus.BAD_REQUEST,
            );
        }

        const result = await BookEntity.delete(id);
        if (result.affected === 0) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            message: 'Book successfully deleted.',
        };
    }

    async updateBook(
        id: string,
        updateData: UpdateBookDto,
    ): Promise<BookEntity> {
        if (!isUUID(id)) {
            throw new HttpException(
                'Invalid book ID format',
                HttpStatus.BAD_REQUEST,
            );
        }

        const book = await BookEntity.findOne({ where: { id } });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(book, updateData);
        try {
            await book.save();
            return book;
        } catch (error) {
            throw new HttpException(
                {
                    message: 'Failed to update the book.',
                    errors: [error.message],
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
