import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { RentalModule } from './rental/rental.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [AuthModule, BookModule, UserModule, RentalModule, LogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
