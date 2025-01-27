import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    Length,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    lastName: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email address of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'Password for the user account (minimum 6 characters)',
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    pwd: string;

    @IsOptional()
    @IsString()
    profilePictureUrl?: string | null;
}
