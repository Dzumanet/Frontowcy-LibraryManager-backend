import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity])],
    providers: [BookService],
    controllers: [BookController],
    exports: [TypeOrmModule],
})
export class BookModule {}
