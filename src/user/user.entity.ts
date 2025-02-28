import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { LoanEntity } from '../loan/loan.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column({
        type: 'varchar',
        length: 30,
    })
    @Expose()
    firstName: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @Expose()
    lastName: string;

    @Column({
        type: 'varchar',
        length: 320,
        unique: true,
    })
    @Expose()
    email: string;

    @Column({
        type: 'char',
        length: 19,
        unique: true,
    })
    @Expose()
    libraryCardNumber: string;

    @Column({
        type: 'varchar',
    })
    @Exclude()
    pwdHash: string;

    @Column({
        type: 'varchar',
        nullable: true,
        default: null,
    })
    @Exclude()
    currentTokenId?: string | null;

    @Column({
        type: 'enum',
        enum: ['client', 'admin'],
        default: 'client',
    })
    @Expose()
    role: 'client' | 'admin';

    @CreateDateColumn()
    @Expose()
    createdAt: Date;

    @UpdateDateColumn()
    @Expose()
    updatedAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    @Expose()
    lastLogin?: Date | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @Expose()
    profilePictureUrl?: string | null;

    @OneToMany(() => LoanEntity, (loan) => loan.user)
    @Expose()
    loans: LoanEntity[];
}
