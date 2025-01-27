import { ApiProperty } from '@nestjs/swagger';
import { RentalResponseDto } from '../../rental/dto/rental-response.dto';
import { Expose, Type } from 'class-transformer';

export class UserWithRentalsDto {
    @ApiProperty({
        description: 'List of rentals associated with the user.',
        type: [RentalResponseDto],
    })
    @Expose()
    @Type(() => RentalResponseDto)
    rentals: RentalResponseDto[];
}
