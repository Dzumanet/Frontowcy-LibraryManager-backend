import { Test, TestingModule } from '@nestjs/testing';
import { BookImageService } from './bookimage.service';

describe('BookimageService', () => {
    let service: BookImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookImageService],
        }).compile();

        service = module.get<BookImageService>(BookImageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
