import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { LoanEntity } from '../loan/loan.entity';

export enum BookCategoryEnum {
    FICTION = 'fiction',
    NON_FICTION = 'non_fiction',
    SCIENCE_FICTION = 'science_fiction',
    FANTASY = 'fantasy',
    MYSTERY = 'mystery',
    HORROR = 'horror',
    ROMANCE = 'romance',
    HISTORY = 'history',
    BIOGRAPHY = 'biography',
    SCIENCE = 'science',
    PHILOSOPHY = 'philosophy',
    PSYCHOLOGY = 'psychology',
    BUSINESS = 'business',
    SELF_HELP = 'self_help',
    EDUCATION = 'education',
    RELIGION = 'religion',
    ART = 'art',
    MUSIC = 'music',
    COOKING = 'cooking',
    TRAVEL = 'travel',
    OTHER = 'other',
}

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

    @Column({
        type: 'enum',
        enum: BookCategoryEnum,
    })
    category: BookCategoryEnum;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    bookPictureUrl?: string | null;

    @OneToMany(() => LoanEntity, (loan) => loan.book)
    loans: LoanEntity[];
}
