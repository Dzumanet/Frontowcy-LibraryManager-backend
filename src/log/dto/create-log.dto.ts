import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LogActionEnum, StatusEnum } from '../log.entity';

export class CreateLogDto {
    @ApiProperty({
        description: 'UUID of the user performing the action',
        example: 'f32069d9-8015-4c3c-ab9c-a8f753b3bffd',
    })
    @IsUUID()
    @IsOptional()
    userId: string | null;

    @ApiProperty({
        description: 'Action performed by the user',
        example: LogActionEnum.LOGIN,
        enum: LogActionEnum,
        enumName: 'LogActionEnum',
    })
    @IsEnum(LogActionEnum)
    action: LogActionEnum;

    @ApiProperty({
        description: 'UUID of the book related to the action (optional)',
        example: 'd2d2f8c5-7bc8-4d84-b920-8b417784d99a',
        required: false,
    })
    @IsString()
    @IsOptional()
    bookId?: string;

    @ApiProperty({
        description: 'Status of the action',
        example: StatusEnum.SUCCESS,
        enum: StatusEnum,
        enumName: 'StatusEnum',
    })
    @IsEnum(StatusEnum)
    @IsOptional()
    status?: StatusEnum;
}
