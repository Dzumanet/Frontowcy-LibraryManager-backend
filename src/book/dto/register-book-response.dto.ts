import { ApiProperty } from '@nestjs/swagger';

export class RegisterBookResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique identifier of the registered book',
        required: false,
    })
    id?: string;

    @ApiProperty({
        example: 'Book has been successfully registered.',
        description: 'The response message',
    })
    message: string;

    @ApiProperty({
        example: true,
        description: 'Indicates if the book already exists in the library',
        required: false,
    })
    exists?: boolean;

    @ApiProperty({
        example: true,
        description: 'Indicates if the book was successfully created',
        required: false,
    })
    bookCreated?: boolean;

    @ApiProperty({
        example: ['Title is required.'],
        description: 'List of validation errors, if any',
        required: false,
    })
    errors?: string[];
}
