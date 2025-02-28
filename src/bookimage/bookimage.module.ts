import { Module } from '@nestjs/common';
import { BookImageService } from './bookimage.service';
import { BookImageController } from './bookimage.controller';

@Module({
    providers: [BookImageService],
    controllers: [BookImageController],
})
export class BookImageModule {}
