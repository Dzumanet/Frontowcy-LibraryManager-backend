import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsDate } from 'class-validator';

export class UpdateRentalDto {
    @ApiPropertyOptional({
        description: 'Updated rental status',
        enum: ['borrowed', 'returned', 'overdue', 'forced_returned'],
    })
    @IsOptional()
    @IsEnum(['borrowed', 'returned', 'overdue', 'forced_returned'])
    rentalStatus?: 'borrowed' | 'returned' | 'overdue' | 'forced_returned';

    @ApiPropertyOptional({ description: 'Date when the rental was returned' })
    @IsOptional()
    @IsDate()
    returnedAt?: Date;

    @ApiPropertyOptional({
        description: 'ID of the admin who forced the return',
    })
    @IsOptional()
    @IsUUID()
    forcedByAdmin?: string;
}
