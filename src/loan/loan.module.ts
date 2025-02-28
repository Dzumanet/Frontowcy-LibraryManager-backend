import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanEntity } from './loan.entity';
import { BookEntity } from '../book/book.entity';
import { UserEntity } from '../user/user.entity';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LoanEntity, BookEntity, UserEntity])],
    controllers: [LoanController],
    providers: [LoanService],
    exports: [LoanService],
})
export class LoanModule {}
