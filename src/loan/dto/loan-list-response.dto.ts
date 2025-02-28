import { ApiProperty } from '@nestjs/swagger';
import { LoanResponseDto } from './loan-response.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { LoanDto } from './loan.dto';

export class LoanListResponseDto {
    @ApiProperty({ type: [LoanDto], description: 'List of books.' })
    data: LoanResponseDto[];
    meta: PaginationMetaDto;
}
