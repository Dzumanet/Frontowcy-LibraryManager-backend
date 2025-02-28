import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BookDto } from '../../book/dto/book.dto';

class UserDto {
    @ApiProperty({ description: 'Id of the user' })
    id: string;

    @ApiProperty({ description: 'First name of the user' })
    firstName: string;

    @ApiProperty({ description: 'Last name of the user' })
    lastName: string;

    @ApiProperty({ description: 'Library card number of the user' })
    libraryCardNumber: string;
}

export class LoanResponseDto {
    @ApiProperty({ description: 'Unique ID of the ' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Date when the book was rented' })
    @Expose()
    loanDate: Date;

    @ApiPropertyOptional({
        description: 'Date when the book was returned (if applicable)',
    })
    @Expose()
    returnedAt?: Date;

    @ApiProperty({ description: 'Date when the book is due' })
    @Expose()
    dueDate: Date;

    @ApiProperty({ description: 'Current status of the loan' })
    @Expose()
    loanStatus: string;

    @ApiProperty({ description: 'Details of the rented book' })
    @Expose()
    @Type(() => BookDto)
    book: BookDto;

    @ApiProperty({ description: 'Details of the user who rented the book' })
    user: UserDto;
}
