import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { RentalEntity } from '../rental/rental.entity';

@Entity('book')
export class BookEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    author: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    totalCopies: number;

    @Column({ type: 'int', default: 0 })
    availableCopies: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => RentalEntity, (rental) => rental.book)
    rentals: RentalEntity[];
}
