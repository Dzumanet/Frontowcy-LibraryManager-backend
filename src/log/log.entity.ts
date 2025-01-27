import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
} from 'typeorm';
import { LogActionEnum } from './dto/create-log.dto';

@Entity('log')
export class LogEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({
        type: 'varchar',
        length: 320,
    })
    email: string;

    @Column({
        type: 'enum',
        enum: [
            'borrowed',
            'returned',
            'overdue',
            'login',
            'logout',
            'updateProfile',
            'createProfile',
            'deleteAccount',
            'addBook',
            'editBook',
            'deleteBook',
        ],
    })
    action: LogActionEnum;

    @Column({ type: 'uuid', nullable: true })
    bookId?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    status?: string;
}
