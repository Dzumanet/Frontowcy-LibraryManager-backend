import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'Updated first name of the user',
        example: 'John',
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({
        description: 'Updated last name of the user',
        example: 'Doe',
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({
        description: 'Updated email address of the user',
        example: 'john.doe@example.com',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: 'Updated password for the user account',
        example: 'newSecurePassword123',
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    pwd?: string;

    pwdHash?: string;
}
