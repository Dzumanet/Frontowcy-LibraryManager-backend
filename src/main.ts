import * as express from 'express';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(cookieParser());

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true, // Pozwala na przesyłanie ciasteczek
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Library Manager API')
        .setDescription('API for managing the library system')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(helmet());
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

    app.use(
        '/uploads',
        express.static(resolve('uploads'), {
            setHeaders: (res) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader(
                    'Access-Control-Allow-Methods',
                    'GET, HEAD, OPTIONS',
                );
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'Content-Type, Authorization',
                );
            },
        }),
    );

    const PORT = process.env.PORT ?? 3000;
    await app.listen(PORT);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
}

bootstrap();
