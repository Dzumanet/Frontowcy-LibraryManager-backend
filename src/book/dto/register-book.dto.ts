import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookCategoryEnum } from '../book.entity';

export class RegisterBookDto {
    @ApiProperty({
        example: 'Clean Code',
        description: 'The title of the book',
    })
    @IsString()
    @MinLength(3, { message: 'Title must have at least 3 character.' })
    title: string;

    @ApiProperty({
        example: 'Robert C. Martin',
        description: 'The author of the book',
    })
    @IsString()
    @MinLength(3, { message: 'Author must have at least 3 character.' })
    author: string;

    @ApiProperty({
        example: 'A Handbook of Agile Software Craftsmanship',
        description: 'Description of the book',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @ApiProperty({
        example: 2008,
        description: 'The publication year of the book',
    })
    @IsInt({ message: 'Year must be an integer.' })
    @Min(1500, { message: 'Year must not be less than 1500.' })
    @Max(2025, { message: 'Year must not be greater than 2025.' })
    year: number;

    @ApiProperty({
        example: 10,
        description: 'The total number of copies available in the library',
    })
    @IsInt({ message: 'Total number of copies must be an integer.' })
    @Min(1, { message: 'Total number of copies must be at least 1.' })
    totalCopies: number;

    @ApiProperty({
        example: 'Programming',
        description: 'The category of the book',
    })
    @IsString()
    category: BookCategoryEnum;

    @ApiProperty({
        example: 'https://example.com/book-cover.jpg',
        description: 'URL to the book cover image',
        required: false,
    })
    @IsOptional()
    bookPictureUrl?: string | null;
}
