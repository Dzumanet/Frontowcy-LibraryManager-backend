import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/user.entity';
import { UserObj } from '../decorators/user-obj.decorator';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 400, description: 'Invalid login details.' })
    async login(
        @Body() req: AuthLoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseDto> {
        return this.authService.login(req, res);
    }

    @Get('/check')
    @ApiOperation({ summary: 'Check if the user is logged in' })
    @ApiResponse({ status: 200, description: 'User is logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    @UseGuards(AuthGuard('jwt'))
    async loginCheck(@UserObj() user: UserEntity) {
        return {
            userId: user.id,
            firstName: user.firstName,
            role: user.role,
        };
    }

    @Get('/logout')
    @ApiOperation({ summary: 'Log out the user' })
    @ApiResponse({ status: 200, description: 'User successfully logged out.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    @UseGuards(AuthGuard('jwt'))
    async logout(@UserObj() user: UserEntity, @Res() res: Response) {
        return this.authService.logout(user, res);
    }
}
