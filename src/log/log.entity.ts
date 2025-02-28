import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
} from 'typeorm';

export enum LogActionEnum {
    BORROWED = 'borrowed',
    RETURNED = 'returned',
    FORCED_RETURNED = 'forced_returned',
    OVERDUE = 'overdue',
    LOGIN = 'login',
    LOGOUT = 'logout',
    UPDATE_PROFILE = 'updateProfile',
    CREATE_PROFILE = 'createProfile',
    DELETE_ACCOUNT = 'deleteAccount',
    ADD_BOOK = 'addBook',
    EDIT_BOOK = 'editBook',
    DELETE_BOOK = 'deleteBook',
    UPLOAD_BOOK_IMAGE = 'uploadImage',
    DELETE_BOOK_IMAGE = 'deleteImage',
}

export enum StatusEnum {
    SUCCESS = 'success',
    FAILED = 'failed',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
}

@Entity('log')
export class LogEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'uuid', nullable: true })
    userId: string | null;

    @Column({
        type: 'enum',
        enum: LogActionEnum,
    })
    action: LogActionEnum;

    @Column({ type: 'uuid', nullable: true })
    bookId?: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    status: StatusEnum;
}
