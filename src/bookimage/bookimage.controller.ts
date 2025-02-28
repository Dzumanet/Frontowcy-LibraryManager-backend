import {
    Controller,
    Post,
    Delete,
    Param,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { memoryStorage } from 'multer';
import {
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BookImageService } from './bookimage.service';

@ApiTags('Book Images')
@Controller('/book/:id/image')
export class BookImageController {
    constructor(private readonly bookImageService: BookImageService) {}

    @Post('/upload')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Upload and replace a book image (Admin only).' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the book.' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'Book image uploaded successfully.',
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new Error('Only image files are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    async uploadBookImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bookImageService.uploadOrReplaceBookImage(id, file);
    }

    @Delete('/remove')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Remove a book image (Admin only).' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the book.' })
    @ApiResponse({
        status: 200,
        description: 'Book image removed successfully.',
    })
    async removeBookImage(@Param('id') id: string) {
        return this.bookImageService.removeBookImage(id);
    }
}
