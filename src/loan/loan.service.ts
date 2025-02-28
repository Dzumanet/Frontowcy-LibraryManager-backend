import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanEntity, LoanStatusEnum } from './loan.entity';
import { BookEntity } from '../book/book.entity';
import { UserEntity } from '../user/user.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanResponseDto } from './dto/loan-response.dto';
import { CreateLoansResponseDto } from './dto/create-loan-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetLoansFilterDto } from './dto/get-loan-filter.dto';
import { LoanListResponseDto } from './dto/loan-list-response.dto';
import { AdminLoanStatisticsDto } from './dto/admin-loan-statistics.dto';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(LoanEntity)
        private readonly loanRepository: Repository<LoanEntity>,
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createLoan(newLoan: CreateLoanDto): Promise<CreateLoansResponseDto> {
        const user = await this.userRepository.findOneBy({
            id: newLoan.userId,
        });
        if (!user) throw new NotFoundException('User not found.');

        const book = await this.bookRepository.findOneBy({
            id: newLoan.bookId,
        });
        if (!book) throw new NotFoundException('Book not found.');

        if (book.availableCopies <= 0) {
            throw new BadRequestException('No available copies.');
        }

        book.availableCopies -= 1;
        await this.bookRepository.save(book);

        const loan = this.loanRepository.create({
            userId: user.id,
            bookId: book.id,
            loanDate: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            loanStatus: LoanStatusEnum.BORROWED,
        });

        return await this.loanRepository.save(loan);
    }

    async returnBook(loanId: string): Promise<{ message: string }> {
        const loan = await this.loanRepository.findOne({
            where: { id: loanId },
            relations: ['book'],
        });

        if (!loan) {
            throw new NotFoundException('No loan found with the provided ID.');
        }

        if (
            loan.loanStatus !== LoanStatusEnum.BORROWED &&
            loan.loanStatus !== LoanStatusEnum.OVERDUE
        ) {
            throw new BadRequestException('The book is not currently rented.');
        }

        loan.returnedAt = new Date();

        if (loan.returnedAt.getTime() > new Date(loan.dueDate).getTime()) {
            loan.loanStatus = LoanStatusEnum.RETURNED_LATE;
        } else {
            loan.loanStatus = LoanStatusEnum.RETURNED;
        }

        loan.book.availableCopies += 1;
        await this.bookRepository.save(loan.book);
        await this.loanRepository.save(loan);

        return { message: 'The book has been successfully returned.' };
    }

    async adminReturnLoan(
        loanId: string,
        adminId: string,
    ): Promise<{ message: string }> {
        const loan = await this.loanRepository.findOne({
            where: { id: loanId },
            relations: ['book'],
        });

        if (!loan) {
            throw new NotFoundException('No loan found with the provided ID.');
        }

        if (
            loan.loanStatus === LoanStatusEnum.RETURNED ||
            loan.loanStatus === LoanStatusEnum.RETURNED_LATE ||
            loan.loanStatus === LoanStatusEnum.FORCED_RETURNED
        ) {
            throw new BadRequestException(
                'The book has already been returned.',
            );
        }

        loan.returnedAt = new Date();
        loan.loanStatus = LoanStatusEnum.FORCED_RETURNED;
        loan.forcedByAdmin = adminId;

        loan.book.availableCopies += 1;
        await this.bookRepository.save(loan.book);
        await this.loanRepository.save(loan);

        return { message: 'The loan has been forcibly marked as returned.' };
    }

    async updateOverdueLoans(): Promise<{ updated: number }> {
        const today = new Date();

        const result = await this.loanRepository
            .createQueryBuilder()
            .update(LoanEntity)
            .set({ loanStatus: LoanStatusEnum.OVERDUE })
            .where('loanStatus = :status', {
                status: LoanStatusEnum.BORROWED,
            })
            .andWhere('dueDate < :today', { today })
            .execute();

        return { updated: result.affected || 0 };
    }

    async getMyLoans(
        filterDto: GetLoansFilterDto & { userId: string },
    ): Promise<LoanListResponseDto> {
        await this.updateOverdueLoans();

        const { page = 1, pageSize = 10, userId, year, month } = filterDto;

        if (!userId) {
            throw new UnauthorizedException(
                'Access denied. User ID is required.',
            );
        }

        const offset = (page - 1) * pageSize;

        const query = this.loanRepository
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.book', 'book')
            .where('loan.userId = :userId', { userId });

        if (year) {
            query.andWhere('YEAR(loan.loanDate) = :year', { year });
        }

        if (month) {
            query.andWhere('MONTH(loan.loanDate) = :month', { month });
        }

        query.orderBy('loan.loanDate', 'DESC').limit(pageSize).offset(offset);

        const [loans, total] = await query.getManyAndCount();

        const loanStatistics = await this.getUserLoanStatistics(
            userId,
            month,
            year,
        );

        return {
            data: loans.map((loan) => plainToInstance(LoanResponseDto, loan)),
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
                hasNextPage: page < Math.ceil(total / pageSize),
                hasPrevPage: page > 1,
                ...loanStatistics,
            },
        };
    }

    async getAllLoans(
        filterDto: GetLoansFilterDto,
    ): Promise<LoanListResponseDto> {
        await this.updateOverdueLoans();

        const {
            page = 1,
            pageSize = 10,
            customerId,
            loanDateFrom,
            loanDateTo,
            loanStatus,
        } = filterDto;
        const offset = (page - 1) * pageSize;

        const query = this.loanRepository
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.book', 'book')
            .leftJoinAndSelect('loan.user', 'user')
            .select([
                'loan.id',
                'loan.loanDate',
                'loan.dueDate',
                'loan.returnedAt',
                'loan.loanStatus',
                'book.id',
                'book.title',
                'book.author',
                'book.totalCopies',
                'book.availableCopies',
                'user.id',
                'user.firstName',
                'user.lastName',
                'user.libraryCardNumber',
            ])
            .orderBy('loan.loanDate', 'DESC')
            .limit(pageSize)
            .offset(offset);

        if (loanStatus) {
            query.andWhere('loan.loanStatus = :loanStatus', {
                loanStatus,
            });
        }
        if (customerId) {
            query.andWhere('loan.userId = :customerId', { customerId });
        }
        if (loanDateFrom) {
            query.andWhere('loan.loanDate >= :loanDateFrom', {
                loanDateFrom,
            });
        }
        if (loanDateTo) {
            query.andWhere('loan.loanDate <= :loanDateTo', {
                loanDateTo,
            });
        }

        const [loans, total] = await query.getManyAndCount();

        const mappedLoans = loans.map((loan) => {
            const userIds = loan.book?.loans?.map((r) => r.userId) || [];
            return plainToInstance(LoanResponseDto, {
                id: loan.id,
                loanDate: loan.loanDate,
                dueDate: loan.dueDate,
                returnedAt: loan.returnedAt || null,
                loanStatus: loan.loanStatus,
                book: {
                    id: loan.book?.id,
                    title: loan.book?.title,
                    author: loan.book?.author,
                    totalCopies: loan.book?.totalCopies || 0,
                    availableCopies: loan.book?.availableCopies || 0,
                    isBorrowed: userIds.length > 0,
                    userIds,
                },
                user: loan.user
                    ? {
                          id: loan.user.id,
                          firstName: loan.user.firstName,
                          lastName: loan.user.lastName,
                          libraryCardNumber: loan.user.libraryCardNumber,
                      }
                    : null,
            });
        });

        const totalPages = Math.ceil(total / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            data: mappedLoans,
            meta: {
                total,
                page,
                pageSize,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        };
    }

    async getUserLoanStatistics(
        userId: string,
        month?: number,
        year?: number,
    ): Promise<any> {
        const query = this.loanRepository
            .createQueryBuilder('loan')
            .where('loan.userId = :userId', { userId });

        if (year) {
            query.andWhere('YEAR(loan.loanDate) = :year', { year });
        }

        if (month) {
            query.andWhere('MONTH(loan.loanDate) = :month', { month });
        }

        const loans = await query.getMany();

        return {
            totalBorrowed: loans.length,
            returnedOnTime: loans.filter(
                (loan) => loan.loanStatus === LoanStatusEnum.RETURNED,
            ).length,
            returnedLate: loans.filter(
                (loan) => loan.loanStatus === LoanStatusEnum.RETURNED_LATE,
            ).length,
            currentlyBorrowed: loans.filter(
                (loan) =>
                    loan.loanStatus === LoanStatusEnum.BORROWED ||
                    loan.loanStatus === LoanStatusEnum.OVERDUE,
            ).length,
            overdueBooks: loans.filter(
                (loan) => loan.loanStatus === LoanStatusEnum.OVERDUE,
            ).length,
        };
    }

    async getAdminLoanStatistics(): Promise<AdminLoanStatisticsDto> {
        const bookStats = await this.bookRepository
            .createQueryBuilder('book')
            .select([
                'COUNT(book.id) as uniqueBooks',
                'SUM(book.totalCopies) as totalCopies',
            ])
            .getRawOne();

        const loanStats = await this.loanRepository
            .createQueryBuilder('loan')
            .select([
                'COUNT(*) as totalLoans',
                `SUM(CASE WHEN loan.loanStatus = '${LoanStatusEnum.BORROWED}' THEN 1 ELSE 0 END) as borrowed`,
                `SUM(CASE WHEN loan.loanStatus = '${LoanStatusEnum.RETURNED}' THEN 1 ELSE 0 END) as returned`,
                `SUM(CASE WHEN loan.loanStatus = '${LoanStatusEnum.RETURNED_LATE}' THEN 1 ELSE 0 END) as returnedLate`,
                `SUM(CASE WHEN loan.loanStatus = '${LoanStatusEnum.OVERDUE}' THEN 1 ELSE 0 END) as overdue`,
                `SUM(CASE WHEN loan.loanStatus = '${LoanStatusEnum.FORCED_RETURNED}' THEN 1 ELSE 0 END) as forcedReturned`,
            ])
            .getRawOne();

        return {
            totalUniqueBooks: bookStats.uniqueBooks || 0,
            totalCopies: bookStats.totalCopies || 0,
            totalLoans: loanStats.totalLoans || 0,
            borrowed: loanStats.borrowed || 0,
            returned: loanStats.returned || 0,
            returnedLate: loanStats.returnedLate || 0,
            overdue: loanStats.overdue || 0,
            forcedReturned: loanStats.forcedReturned || 0,
        };
    }
}
