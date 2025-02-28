import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsInt, Min, Max } from 'class-validator';
import { LogActionEnum, StatusEnum } from '../log.entity';
import { Transform } from 'class-transformer';

export class GetLogsFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({
        description: 'Filter by book ID',
        example: '789e1234-a56b-78cd-901e-23fg45hi67jk',
    })
    @IsOptional()
    @IsUUID()
    bookId?: string;

    @ApiPropertyOptional({
        description: 'Filter by action type',
        enum: LogActionEnum,
    })
    @IsOptional()
    @IsEnum(LogActionEnum)
    action?: LogActionEnum;

    @ApiPropertyOptional({ description: 'Filter by status', enum: StatusEnum })
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;

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
}
