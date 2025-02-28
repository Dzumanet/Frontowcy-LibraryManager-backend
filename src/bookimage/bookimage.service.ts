import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { isUUID } from 'class-validator';
import * as fs from 'fs/promises';
import { join } from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { BookEntity } from '../book/book.entity';

@Injectable()
export class BookImageService {
    private readonly uploadDir = join(process.cwd(), 'uploads', 'books');

    async uploadOrReplaceBookImage(
        id: string,
        file: Express.Multer.File,
    ): Promise<BookEntity> {
        if (!isUUID(id)) {
            throw new HttpException(
                'Invalid book ID format',
                HttpStatus.BAD_REQUEST,
            );
        }

        const book = await BookEntity.findOne({ where: { id } });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        const compressedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();

        if (book.bookPictureUrl) {
            const oldFilePath = join(process.cwd(), book.bookPictureUrl);
            try {
                await fs.unlink(oldFilePath);
            } catch (error) {
                console.warn(
                    'Nie udało się usunąć starego zdjęcia:',
                    error.message,
                );
            }
        }

        const filename = `${uuidv4()}.jpeg`;
        await fs.mkdir(this.uploadDir, { recursive: true });

        const filePath = join(this.uploadDir, filename);
        await fs.writeFile(filePath, compressedImageBuffer);

        book.bookPictureUrl = `/uploads/books/${filename}`;
        await book.save();

        return book;
    }

    async removeBookImage(id: string): Promise<BookEntity> {
        if (!isUUID(id)) {
            throw new HttpException(
                'Invalid book ID format',
                HttpStatus.BAD_REQUEST,
            );
        }

        const book = await BookEntity.findOne({ where: { id } });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        if (!book.bookPictureUrl) {
            throw new HttpException(
                'Book has no assigned image',
                HttpStatus.BAD_REQUEST,
            );
        }

        const filePath = join(process.cwd(), book.bookPictureUrl);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn('Nie udało się usunąć zdjęcia:', error.message);
        }

        book.bookPictureUrl = null;
        await book.save();

        return book;
    }
}
