import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../book/book.entity';

export enum LoanStatusEnum {
    BORROWED = 'borrowed',
    RETURNED = 'returned',
    RETURNED_LATE = 'returned_late',
    OVERDUE = 'overdue',
    FORCED_RETURNED = 'forced_returned',
}

@Entity('loan')
export class LoanEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    loanDate: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    returnedAt?: Date;

    @Column({ type: 'datetime' })
    dueDate: Date;

    @Column({
        type: 'enum',
        enum: LoanStatusEnum,
        default: LoanStatusEnum.BORROWED,
    })
    loanStatus: LoanStatusEnum;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.loans, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'uuid' })
    bookId: string;

    @ManyToOne(() => BookEntity, (book) => book.loans, {
        eager: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'bookId' })
    book: BookEntity;

    @Column({
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    forcedByAdmin?: string;
}
