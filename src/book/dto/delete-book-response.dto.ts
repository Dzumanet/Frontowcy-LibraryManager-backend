import { ApiProperty } from '@nestjs/swagger';

export class DeleteBookResponseDto {
    @ApiProperty({
        example: true,
        description: 'Indicates if the book was successfully deleted.',
    })
    success: boolean;

    @ApiProperty({
        example: 'Book successfully deleted.',
        description: 'Message about the operation.',
    })
    message: string;
}
