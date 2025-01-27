import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { RegisterBookDto } from './dto/register-book.dto';
import { RegisterBookResponseDto } from './dto/register-book-response.dto';
import { DeleteBookResponseDto } from './dto/delete-book-response.dto';
import { BookDto } from './dto/book.dto';

@Injectable()
export class BookService {
    async registerBook(
        newBook: RegisterBookDto,
    ): Promise<RegisterBookResponseDto> {
        const existingBook = await BookEntity.findOne({
            where: { title: newBook.title, author: newBook.author },
        });

        if (existingBook) {
            return {
                message: 'This book already exists.',
                exists: true,
                bookCreated: false,
            };
        }

        const book = BookEntity.create({
            title: newBook.title,
            author: newBook.author,
            description: newBook.description,
            year: newBook.year,
            totalCopies: newBook.totalCopies,
            availableCopies: newBook.totalCopies,
        });

        try {
            await book.save();

            return {
                message: 'The book has been registered.',
                id: book.id,
                exists: false,
                bookCreated: true,
            };
        } catch (error) {
            throw new HttpException(
                {
                    message: 'Failed to register the book.',
                    errors: [error.message],
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllBooks(): Promise<BookEntity[]> {
        return BookEntity.find();
    }

    async getBookEntityById(id: string): Promise<BookEntity> {
        const book = await BookEntity.findOne({ where: { id } });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return book;
    }

    async getBookById(id: string): Promise<BookDto> {
        const book = await this.getBookEntityById(id);
        return this.toBookDto(book);
    }

    private toBookDto(book: BookEntity): BookDto {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
        };
    }

    async deleteBook(id: string): Promise<DeleteBookResponseDto> {
        const result = await BookEntity.delete(id);
        if (result.affected === 0) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            message: 'Book successfully deleted.',
        };
    }

    async updateBook(
        id: string,
        updateData: Partial<BookEntity>,
    ): Promise<BookEntity> {
        const book = await this.getBookEntityById(id);
        Object.assign(book, updateData);
        try {
            await book.save();
            return book;
        } catch (error) {
            throw new HttpException(
                {
                    message: 'Failed to update the book.',
                    errors: [error.message],
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
