import {
    Body,
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseGuards,
    Query,
    Patch,
} from '@nestjs/common';
import { BookService } from './book.service';
import { RegisterBookDto } from './dto/register-book.dto';
import {
    ApiBody,
    ApiResponse,
    ApiTags,
    ApiParam,
    ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateBookDto } from './dto/update-book.dto';
import { DeleteBookResponseDto } from './dto/delete-book-response.dto';
import { BookDto } from './dto/book.dto';
import { GetBooksFilterDto } from './dto/get-books-filter.dto';
import { BooksListResponseDto } from './dto/books-list-response.dto';

@ApiTags('Books')
@Controller()
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post('/book/register')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Register a new book (Admin only).' })
    @ApiBody({ type: RegisterBookDto })
    @ApiResponse({
        status: 201,
        description: 'Book has been successfully created.',
    })
    @ApiResponse({
        status: 409,
        description: 'Book with this title and author already exists.',
    })
    async registerBook(@Body() newBook: RegisterBookDto) {
        return this.bookService.registerBook(newBook);
    }

    @Get('/books')
    @ApiOperation({ summary: 'Get a list of all books.' })
    @ApiResponse({
        status: 200,
        description: 'List of all books.',
        type: BooksListResponseDto,
    })
    async getAllBooks(
        @Query() filterDto: GetBooksFilterDto,
    ): Promise<BooksListResponseDto> {
        return this.bookService.getAllBooks(filterDto);
    }

    @Get('/book/:id')
    @ApiOperation({ summary: 'Get details of a book by its ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the book.' })
    @ApiResponse({ status: 200, description: 'Details of the book.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    @ApiBody({ type: BookDto })
    async getBookById(@Param('id') id: string) {
        return this.bookService.getBookById(id);
    }

    @Delete('/book/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a book by its ID (Admin only).' })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the book to delete.',
    })
    @ApiResponse({
        status: 200,
        description: 'Book successfully deleted.',
        type: DeleteBookResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async deleteBook(@Param('id') id: string): Promise<DeleteBookResponseDto> {
        return this.bookService.deleteBook(id);
    }

    @Patch('/book/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update a book by its ID (Admin only).' })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the book to update.',
    })
    @ApiBody({ type: UpdateBookDto, description: 'Data to update the book.' })
    @ApiResponse({ status: 200, description: 'Book successfully updated.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async updateBook(
        @Param('id') id: string,
        @Body() updateData: UpdateBookDto,
    ) {
        return this.bookService.updateBook(id, updateData);
    }
}
