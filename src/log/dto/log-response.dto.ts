import { ApiProperty } from '@nestjs/swagger';
import { LogActionEnum } from '../log.entity';
import { Expose } from 'class-transformer';

export class LogResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @Expose()
    id: string;

    @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
    @Expose()
    timestamp: Date;

    @ApiProperty({ example: '456e7890-f12g-34h5-i678-910jklmnopqr' })
    @Expose()
    userId: string;

    @ApiProperty({ enum: LogActionEnum })
    @Expose()
    action: LogActionEnum;

    @ApiProperty({
        example: '789e1234-a56b-78cd-901e-23fg45hi67jk',
        nullable: true,
    })
    @Expose()
    bookId?: string;

    @ApiProperty({ example: 'overdue', nullable: true })
    @Expose()
    status?: string;
}
