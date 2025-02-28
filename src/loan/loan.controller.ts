import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateLoansResponseDto } from './dto/create-loan-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { GetLoansFilterDto } from './dto/get-loan-filter.dto';
import { LoanListResponseDto } from './dto/loan-list-response.dto';
import { JwtUserDto } from '../auth/dto/jwt-user.dto';
import { AdminLoanStatisticsDto } from './dto/admin-loan-statistics.dto';

@ApiTags('loan')
@Controller()
export class LoanController {
    constructor(private readonly loanService: LoanService) {}

    @Post('/loans')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiOperation({ summary: 'Create a new loan' })
    async createLoan(
        @Body() newLoan: CreateLoanDto,
    ): Promise<CreateLoansResponseDto> {
        return this.loanService.createLoan(newLoan);
    }

    @Get('/loans')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get a list of all loans with pagination.' })
    async getAllLoans(
        @Query() filterDto: GetLoansFilterDto,
    ): Promise<LoanListResponseDto> {
        return this.loanService.getAllLoans(filterDto);
    }

    @Post('/loans/:loanId/return')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiOperation({ summary: 'Return a borrowed book' })
    async returnBook(
        @Param('loanId') loanId: string,
    ): Promise<{ message: string }> {
        return this.loanService.returnBook(loanId);
    }

    @Post('/admin/loans/:loanId/return')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Forcibly return a book loan (admin only)' })
    async adminReturnLoan(
        @Param('loanId') loanId: string,
        @Req() req: { user: JwtUserDto },
    ): Promise<{ message: string }> {
        return this.loanService.adminReturnLoan(loanId, req.user.id);
    }

    @Get('/loans/me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Get all loans for the authenticated user with pagination.',
    })
    async getMyLoans(
        @Req() req: { user: JwtUserDto },
        @Query() filterDto: GetLoansFilterDto,
    ): Promise<LoanListResponseDto> {
        return this.loanService.getMyLoans({
            ...filterDto,
            userId: req.user.id,
        });
    }

    @Get('/admin/loans/statistics')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get loan statistics for admin.' })
    @ApiResponse({ status: 200, type: AdminLoanStatisticsDto })
    async getAdminLoanStatistics(): Promise<AdminLoanStatisticsDto> {
        return this.loanService.getAdminLoanStatistics();
    }
}
