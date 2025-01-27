import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookEntity } from '../book/book.entity';

@Entity('rental')
export class RentalEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    rentalDate: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    returnedAt?: Date;

    @Column({ type: 'datetime' })
    dueDate: Date;

    @Column({
        type: 'enum',
        enum: ['borrowed', 'returned', 'overdue', 'forced_returned'],
        default: 'borrowed',
    })
    rentalStatus: 'borrowed' | 'returned' | 'overdue' | 'forced_returned';

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.rentals, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'uuid' })
    bookId: string;

    @ManyToOne(() => BookEntity, (book) => book.rentals, { eager: false })
    @JoinColumn({ name: 'bookId' })
    book: BookEntity;

    @Column({
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    forcedByAdmin?: string;
}
