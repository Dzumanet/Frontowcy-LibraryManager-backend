import { ApiProperty } from '@nestjs/swagger';
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

export class RentalResponseDto {
    @ApiProperty({ description: 'Unique ID of the rental' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Date when the book was rented' })
    @Expose()
    rentalDate: Date;

    @ApiProperty({ description: 'Date when the book is due' })
    @Expose()
    dueDate: Date;

    @ApiProperty({ description: 'Current status of the rental' })
    @Expose()
    rentalStatus: string;

    @ApiProperty({ description: 'Details of the rented book' })
    @Expose()
    @Type(() => BookDto)
    book: BookDto;

    @ApiProperty({ description: 'Details of the user who rented the book' })
    user: UserDto;
}
