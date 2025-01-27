import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalEntity } from './rental.entity';
import { BookEntity } from '../book/book.entity';
import { UserEntity } from '../user/user.entity';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RentalEntity, BookEntity, UserEntity])],
    controllers: [RentalController],
    providers: [RentalService],
    exports: [RentalService],
})
export class RentalModule {}
