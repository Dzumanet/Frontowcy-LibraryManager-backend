import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateLoanDto {
    @ApiProperty({
        description: 'UUID Number of the user who is renting the book',
        example: '987e4567-e89b-12d3-a456-426614174999',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'UUID of the book being rented',
        example: '987e4567-e89b-12d3-a456-426614174999',
    })
    @IsUUID()
    bookId: string;
}
