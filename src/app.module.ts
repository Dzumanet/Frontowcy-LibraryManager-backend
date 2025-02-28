import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { LogModule } from './log/log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookImageModule } from './bookimage/bookimage.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            // entities: ['dist/**/**.entity{.ts,.js}'],
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            bigNumberStrings: false,
            autoLoadEntities: true,
            logging: true,
            synchronize: false,
        }),
        AuthModule,
        BookModule,
        UserModule,
        LoanModule,
        LogModule,
        BookImageModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
