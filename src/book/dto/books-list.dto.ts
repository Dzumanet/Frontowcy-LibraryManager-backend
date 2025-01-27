import { ApiProperty } from '@nestjs/swagger';

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
}
