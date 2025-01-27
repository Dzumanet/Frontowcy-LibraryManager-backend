import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalEntity } from './rental.entity';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { CreateRentalsResponseDto } from './dto/create-rental-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { RentalDto } from './dto/rental.dto';

@ApiTags('rental')
@Controller()
export class RentalController {
    constructor(private readonly rentalService: RentalService) {}

    @Post('/rental/create')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Create a new rental',
        description:
            'Creates a new rental for a specified user and book. The book must have available copies, and both user and book must exist.',
    })
    @ApiBody({
        description: 'Details of the user and book for creating the rental.',
        required: true,
        schema: {
            example: {
                userId: '123e4567-e89b-12d3-a456-426614174000',
                bookId: '123e4567-e89b-12d3-a456-426614174001',
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Rental has been successfully created.',
        type: RentalEntity,
    })
    @ApiResponse({
        status: 400,
        description: 'No available copies of the book, or invalid input data.',
    })
    @ApiResponse({
        status: 404,
        description: 'User or book not found.',
    })
    async createRental(
        @Body() newRental: CreateRentalDto,
    ): Promise<CreateRentalsResponseDto> {
        return this.rentalService.createRental(newRental);
    }

    @Get('/rentals')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get a list of all rentals.' })
    @ApiResponse({ status: 200, description: 'List of all rentals.' })
    async getAllRentals(): Promise<RentalResponseDto[]> {
        return this.rentalService.getAllRentals();
    }

    @Post('/rental/return/:rentalId')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Return a borrowed book',
        description:
            'Marks a rental as returned and updates the availability of the book. The rental must exist, and its status must be "borrowed".',
    })
    @ApiParam({
        name: 'rentalId',
        description: 'The ID of the rental to be returned.',
        example: '123e4567-e89b-12d3-a456-426614174002',
    })
    @ApiResponse({
        status: 200,
        description: 'Book has been successfully returned.',
        schema: {
            example: {
                message: 'Book successfully returned.',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'The book is not currently borrowed.',
    })
    @ApiResponse({
        status: 404,
        description: 'Rental not found.',
    })
    async returnBook(
        @Param('rentalId') rentalId: string,
    ): Promise<{ message: string }> {
        return this.rentalService.returnBook(rentalId);
    }

    @Get('/rental/book/:bookId')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Get rental details for a specific book for user',
        description:
            'Retrieves the rental details for a specific book by its ID. The authenticated user can view the rental information associated with the specified book.',
    })
    @ApiParam({
        name: 'bookId',
        description:
            'The ID of the book whose rental details are being retrieved.',
        example: '123e4567-e89b-12d3-a456-426614174004',
    })
    @ApiResponse({
        status: 200,
        description: 'Details of the rental for the given book.',
        type: RentalDto,
    })
    @ApiResponse({
        status: 404,
        description:
            'Book not found or no rental exists for the specified book ID.',
    })
    async getUserRentalsByBook(
        @Param('bookId') bookId: string,
    ): Promise<RentalDto> {
        return this.rentalService.findRental({ bookId });
    }

    @Get('/rentals/user/:userId')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({
        summary: 'Get all rentals for a user.(Admin only).',
        description:
            'Retrieves a list of all rentals for a specific user, including their details and the details of the rented books.',
    })
    @ApiParam({
        name: 'userId',
        description: 'The ID of the user whose rentals are being retrieved.',
        example: '123e4567-e89b-12d3-a456-426614174003',
    })
    @ApiResponse({
        status: 200,
        description: 'List of rentals for the given user.',
        type: [RentalResponseDto],
    })
    @ApiResponse({
        status: 403,
        description:
            'Access denied. The user does not have the necessary permissions.',
        schema: {
            example: {
                message: 'Access denied',
                error: 'Forbidden',
                statusCode: 403,
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found or user has no rentals.',
    })
    async getRentalsByUser(
        @Param('userId') userId: string,
    ): Promise<RentalResponseDto[]> {
        return this.rentalService.findRentals({ userId });
    }

    @Get('/rentals/book/:bookId')
    @UseGuards(AuthGuard('jwt'))
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({
        summary: 'Get all rentals for a book. (Admin only).',
        description:
            'Retrieves a list of all rentals for a specific book, including details about users who rented the book.',
    })
    @ApiParam({
        name: 'bookId',
        description: 'The ID of the book whose rentals are being retrieved.',
        example: '123e4567-e89b-12d3-a456-426614174004',
    })
    @ApiResponse({
        status: 200,
        description: 'List of rentals for the given book.',
        type: [RentalResponseDto],
    })
    @ApiResponse({
        status: 404,
        description: 'Book not found or book has no rentals.',
    })
    async getRentalsByBook(
        @Param('bookId') bookId: string,
    ): Promise<RentalResponseDto[]> {
        return this.rentalService.findRentals({ bookId });
    }
}
