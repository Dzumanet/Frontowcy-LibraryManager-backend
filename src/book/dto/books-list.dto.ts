import { ApiProperty } from '@nestjs/swagger';
import { BookCategoryEnum } from '../book.entity';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BooksListDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier of the book.',
    })
    id: string;

    @ApiProperty({
        example: 'Clean Code',
        description: 'The title of the book.',
    })
    title: string;

    @ApiProperty({
        example: 'Robert C. Martin',
        description: 'The author of the book.',
    })
    author: string;

    @ApiProperty({
        example: 2008,
        description: 'The publication year of the book.',
    })
    year: number;

    @ApiProperty({
        example: '8',
        description: 'Available copies of the book.',
    })
    @Expose()
    availableCopies: number;

    @ApiProperty({
        description: 'Picture of the book.',
    })
    @IsOptional()
    @Expose()
    bookPictureUrl: string;

    @ApiProperty({
        example: 'PROGRAMMING',
        description:
            'The category of the book, selected from predefined categories.',
    })
    category: BookCategoryEnum;
}
