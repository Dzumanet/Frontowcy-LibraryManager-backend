import { CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export enum LogActionEnum {
    BORROWED = 'borrowed',
    RETURNED = 'returned',
    OVERDUE = 'overdue',
    LOGIN = 'login',
    LOGOUT = 'logout',
    UPDATE_PROFILE = 'updateProfile',
    CREATE_PROFILE = 'createProfile',
    DELETE_ACCOUNT = 'deleteAccount',
    ADD_BOOK = 'addBook',
    EDIT_BOOK = 'editBook',
    DELETE_BOOK = 'deleteBook',
}

export enum StatusEnum {
    SUCCESS = 'success',
    FAILED = 'failed',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
}

export class CreateLogDto {
    @CreateDateColumn()
    timestamp: Date;

    @ApiProperty({
        description: 'UUID of the user performing the action',
        example: 'f32069d9-8015-4c3c-ab9c-a8f753b3bffd',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'Email of the user performing the action',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

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
    bookId?: string;

    @ApiProperty({
        description: 'Status of the action (e.g., Success, Failed) (optional)',
        example: 'Success',
        required: false,
    })
    @ApiProperty({
        description: 'Status of the action',
        example: StatusEnum.SUCCESS,
        enum: StatusEnum,
        enumName: 'StatusEnum',
    })
    @IsEnum(StatusEnum)
    status?: StatusEnum;
}
