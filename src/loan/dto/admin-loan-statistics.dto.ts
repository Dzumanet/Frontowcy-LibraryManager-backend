import { ApiProperty } from '@nestjs/swagger';

export class AdminLoanStatisticsDto {
    @ApiProperty({
        description: 'Total number of unique books in the database',
        example: 200,
    })
    totalUniqueBooks: number;

    @ApiProperty({
        description: 'Total number of all book copies in the database',
        example: 2524,
    })
    totalCopies: number;

    @ApiProperty({ description: 'Total number of loans', example: 500 })
    totalLoans: number;

    @ApiProperty({
        description: 'Number of currently borrowed books',
        example: 150,
    })
    borrowed: number;

    @ApiProperty({
        description: 'Number of books returned on time',
        example: 200,
    })
    returned: number;

    @ApiProperty({ description: 'Number of books returned late', example: 50 })
    returnedLate: number;

    @ApiProperty({ description: 'Number of overdue books', example: 80 })
    overdue: number;

    @ApiProperty({
        description: 'Number of books forcibly returned by the administrator',
        example: 20,
    })
    forcedReturned: number;
}
