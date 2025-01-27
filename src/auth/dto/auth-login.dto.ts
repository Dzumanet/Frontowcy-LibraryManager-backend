import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @ApiProperty({
        example: '12345-67890',
        description: 'Library card number associated with the user',
    })
    @IsString()
    @IsNotEmpty()
    libraryCardNumber: string;

    @ApiProperty({
        example: 'securePassword123',
        description: 'Password for the user account',
    })
    @IsString()
    @IsNotEmpty()
    pwd: string;
}
