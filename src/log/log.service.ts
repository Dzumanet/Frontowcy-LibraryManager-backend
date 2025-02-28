import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { LogResponseDto } from './dto/log-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetLogsFilterDto } from './dto/get-logs-filter.dto';
import { LogListResponseDto } from './dto/logs-list-response.dto';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(LogEntity)
        private readonly logsRepository: Repository<LogEntity>,
    ) {}

    async createLog(createLogDto: CreateLogDto): Promise<LogEntity> {
        try {
            const log = this.logsRepository.create(createLogDto);
            return await this.logsRepository.save(log);
        } catch (error) {
            throw new InternalServerErrorException('Błąd przy zapisie logu');
        }
    }

    async getAllLogs(filterDto: GetLogsFilterDto): Promise<LogListResponseDto> {
        const {
            page = 1,
            pageSize = 10,
            userId,
            bookId,
            status,
            action,
        } = filterDto;
        const offset = (page - 1) * pageSize;

        const query = this.logsRepository
            .createQueryBuilder('log')
            .select([
                'log.id',
                'log.timestamp',
                'log.userId',
                'log.action',
                'log.bookId',
                'log.status',
            ])
            .orderBy('log.timestamp', 'DESC')
            .limit(pageSize)
            .offset(offset);

        if (userId) query.andWhere('log.userId = :userId', { userId });
        if (bookId) query.andWhere('log.bookId = :bookId', { bookId });
        if (status) query.andWhere('log.status = :status', { status });
        if (action) query.andWhere('log.action = :action', { action });

        const [logs, total] = await query.getManyAndCount();

        const totalPages = Math.ceil(total / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            data: plainToInstance(LogResponseDto, logs),
            meta: {
                total,
                page,
                pageSize,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        };
    }

    async getLogsByUser(userId: string): Promise<LogResponseDto[]> {
        const logs = await this.logsRepository.find({
            where: { userId },
            order: { timestamp: 'DESC' },
        });
        return plainToInstance(LogResponseDto, logs, {
            excludeExtraneousValues: true,
        });
    }
}
