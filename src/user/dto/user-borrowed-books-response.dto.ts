import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from '../../book/dto/book.dto';

export class UserBorrowedBooksResponseDto {
    @ApiProperty({
        description: 'The library card number of the user.',
        example: 'f4539868-c76a-445f-a1bd-f5d18d0f5029',
    })
    libraryCardNumber: string;

    @ApiProperty({
        description: 'The number of books currently borrowed by the user.',
        example: 2,
    })
    borrowedBooksCount: number;

    @ApiProperty({
        description: 'List of borrowed books with their details.',
        type: [BookDto],
    })
    borrowedBooks: BookDto[];
}
