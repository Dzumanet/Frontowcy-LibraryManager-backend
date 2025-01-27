import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BookDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier of the book.',
    })
    @Expose()
    id: string;

    @ApiProperty({
        example: 'Clean Code',
        description: 'The title of the book.',
    })
    @Expose()
    title: string;

    @ApiProperty({
        example: 'Robert C. Martin',
        description: 'The author of the book.',
    })
    @Expose()
    author: string;

    @ApiProperty({
        example: '10',
        description: 'Total copies of the book.',
    })
    @Expose()
    totalCopies: number;

    @ApiProperty({
        example: '8',
        description: 'Available copies of the book.',
    })
    @Expose()
    availableCopies: number;

    @ApiProperty({
        example: 2008,
        description: 'The publication year of the book.',
    })
    @Expose()
    year: number;
}
