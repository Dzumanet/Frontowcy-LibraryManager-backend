import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { LoanResponseDto } from '../../loan/dto/loan-response.dto';

export class UserWithLoansDto {
    @ApiProperty({
        description: 'List of loans associated with the user.',
        type: [LoanResponseDto],
    })
    @Expose()
    @Type(() => LoanResponseDto)
    loans: LoanResponseDto[];
}
