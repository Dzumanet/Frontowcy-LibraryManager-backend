import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LogEntity } from './log.entity';
import { RoleGuard } from '../guards/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([LogEntity])],
    controllers: [LogController],
    providers: [LogService, RoleGuard],
    exports: [LogService],
})
export class LogModule {}
