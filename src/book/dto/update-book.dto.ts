import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

export class UpdateBookDto {
    @ApiProperty({
        example: 'Clean Architecture',
        description: 'The new title of the book.',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @ApiProperty({
        example: 'Robert C. Martin',
        description: 'The new author of the book.',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    author?: string;

    @ApiProperty({
        example: 'Updated description of the book.',
        description: 'The new description of the book.',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 2010,
        description: 'The new publication year of the book.',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1500)
    @Max(2025)
    year?: number;

    @ApiProperty({
        example: 15,
        description: 'The updated total number of copies.',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    totalCopies?: number;
}
