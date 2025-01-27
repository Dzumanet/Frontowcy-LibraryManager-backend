import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { LogResponseDto } from './dto/log-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(LogEntity)
        private readonly logsRepository: Repository<LogEntity>,
    ) {}

    async createLog(createLogDto: CreateLogDto): Promise<LogResponseDto> {
        const { userId, email, action, bookId, status } = createLogDto;

        const log = this.logsRepository.create({
            userId,
            email,
            action,
            bookId,
            status,
            timestamp: new Date(),
        });

        const savedLog = await this.logsRepository.save(log);
        return plainToInstance(LogResponseDto, savedLog, {
            excludeExtraneousValues: true,
        });
    }

    async getAllLogs(): Promise<LogResponseDto[]> {
        const logs = await this.logsRepository.find({
            order: { timestamp: 'DESC' },
        });
        return plainToInstance(LogResponseDto, logs, {
            excludeExtraneousValues: true,
        });
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
