import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { LogResponseDto } from './dto/log-response.dto';
import { plainToInstance } from 'class-transformer';
import { LogActionEnum, StatusEnum } from './log.entity';
import { GetLogsFilterDto } from './dto/get-logs-filter.dto';
import { LogListResponseDto } from './dto/logs-list-response.dto';

@ApiTags('Log')
@Controller('log')
export class LogController {
    constructor(private readonly logsService: LogService) {}

    @ApiOperation({ summary: 'Create a new log entry.' })
    @ApiResponse({
        status: 201,
        description: 'Log entry has been created.',
        type: LogResponseDto,
    })
    @Post()
    @ApiQuery({
        name: 'action',
        description: 'Filter logs by action type',
        required: true,
        enum: LogActionEnum,
    })
    @ApiQuery({
        name: 'status',
        description: 'Filter logs by status type',
        required: true,
        enum: StatusEnum,
    })
    async createLog(
        @Body() createLogDto: CreateLogDto,
    ): Promise<LogResponseDto> {
        const log = await this.logsService.createLog(createLogDto);
        return plainToInstance(LogResponseDto, log, {
            excludeExtraneousValues: true,
        });
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({
        summary:
            'Get all log entries with pagination and filtering (Admin only).',
    })
    @ApiResponse({
        status: 200,
        description: 'List of log entries with pagination.',
        type: [LogResponseDto],
    })
    async getAllLogs(
        @Query() filterDto: GetLogsFilterDto,
    ): Promise<LogListResponseDto> {
        return this.logsService.getAllLogs(filterDto);
    }

    @ApiOperation({ summary: 'Get log entries by user (Admin only).' })
    @ApiParam({
        name: 'userId',
        description: 'UUID of the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'List of logs related to the user.',
        type: [LogResponseDto],
    })
    @Get('user/:userId')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    async getLogsByUser(
        @Param('userId') userId: string,
    ): Promise<LogResponseDto[]> {
        const logs = await this.logsService.getLogsByUser(userId);
        return plainToInstance(LogResponseDto, logs, {
            excludeExtraneousValues: true,
        });
    }
}
