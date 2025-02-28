import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BookDto } from '../../book/dto/book.dto';
import { LoanStatusEnum } from '../loan.entity';

export class LoanDto {
    @ApiProperty({ description: 'Unique ID of the loan' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Date when the book was rented' })
    @Expose()
    loanDate: Date;

    @ApiProperty({ description: 'Date when the book is due' })
    @Expose()
    dueDate: Date;

    @ApiPropertyOptional({
        description: 'Date when the book was returned (if applicable)',
    })
    @Expose()
    returnedAt?: Date;

    @ApiProperty({ description: 'Current status of the loan' })
    @Expose()
    loanStatus: LoanStatusEnum;

    @ApiProperty({ description: 'Details of the rented book' })
    @Expose()
    @Type(() => BookDto)
    book: BookDto;
}
