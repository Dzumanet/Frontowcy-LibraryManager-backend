import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterUserResponseDto {
    @Expose()
    id: number;
    @ApiProperty({
        description: 'The email of the registered user.',
        example: 'user@example.com',
        required: false,
    })
    @Expose()
    email: string;

    @ApiProperty({
        description:
            'Response message providing details about the registration process.',
        example: 'Registration successful.',
    })
    @Expose()
    message: string;

    @ApiProperty({
        description:
            'Indicates whether the email already exists in the system.',
        example: true,
        required: false,
    })
    @Expose()
    exists: boolean;

    @ApiProperty({
        description: 'The library card number assigned to the user.',
        example: 'LIB-455ECA',
        required: false,
    })
    @Expose()
    libraryCardNumber: string;

    @ApiProperty({
        description: 'Indicates whether the account was successfully created.',
        example: true,
        required: false,
    })
    @Expose()
    accountCreated: boolean;
}
