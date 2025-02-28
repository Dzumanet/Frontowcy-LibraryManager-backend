import { Test, TestingModule } from '@nestjs/testing';
import { BookImageController } from './bookimage.controller';

describe('BookimageController', () => {
    let controller: BookImageController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookImageController],
        }).compile();

        controller = module.get<BookImageController>(BookImageController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
