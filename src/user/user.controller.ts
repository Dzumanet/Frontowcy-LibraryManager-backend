import {
    Controller,
    Get,
    Patch,
    Post,
    Body,
    Req,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';
import { UserBorrowedBooksResponseDto } from './dto/user-borrowed-books-response.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { JwtUserDto } from '../auth/dto/jwt-user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User has been successfully registered.',
    })
    @ApiResponse({ status: 409, description: 'Email already in use.' })
    @Post('/register')
    @HttpCode(201)
    async registerUser(
        @Body() newUser: RegisterUserDto,
    ): Promise<RegisterUserResponseDto> {
        return this.userService.registerUser(newUser);
    }

    @ApiOperation({ summary: 'Get current user information' })
    @ApiResponse({
        status: 200,
        description: 'Returns information about the currently logged-in user.',
    })
    @ApiBody({ type: UserResponseDto })
    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getCurrentUser(
        @Req() req: { user: JwtUserDto },
    ): Promise<UserResponseDto> {
        return this.userService.getCurrentUser(req.user.id);
    }

    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({
        status: 200,
        description: 'User profile has been successfully updated.',
    })
    @UseGuards(AuthGuard('jwt'))
    @Patch('/update-profile')
    async updateProfile(
        @Req() req: { user: JwtUserDto },
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.updateUserProfile(req.user.id, updateUserDto);
    }

    @ApiOperation({ summary: 'Check borrowed books with IDs for a user' })
    @ApiResponse({
        status: 200,
        description:
            'Returns the number of books and their IDs borrowed by the user.',
    })
    @ApiBody({ type: UserBorrowedBooksResponseDto })
    @UseGuards(AuthGuard('jwt'))
    @Get('/borrowed-books/')
    async getBorrowedBooksWithIds(
        @Req() req: { user: JwtUserDto },
    ): Promise<UserBorrowedBooksResponseDto> {
        return this.userService.getBorrowedBooks(req.user.id);
    }
}
