import {
    IsOptional,
    IsInt,
    Min,
    Max,
    IsString,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LoanStatusEnum } from '../loan.entity';

export class GetLoansFilterDto {
    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 1 : parsed;
    })
    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 1 : parsed;
    })
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 10 : parsed;
    })
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = 10;

    @IsOptional()
    @IsString()
    customerId?: string;

    @IsOptional()
    @IsDateString(
        { strict: false },
        { message: 'Invalid date format (loanDateFrom)' },
    )
    loanDateFrom?: string;

    @IsOptional()
    @IsDateString(
        { strict: false },
        { message: 'Invalid date format (loanDateTo)' },
    )
    loanDateTo?: string;

    @IsOptional()
    @IsEnum(LoanStatusEnum, { message: 'Invalid loan status' })
    loanStatus?: LoanStatusEnum;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(2000)
    @Max(new Date().getFullYear())
    year?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    @Max(12)
    month?: number;
}
