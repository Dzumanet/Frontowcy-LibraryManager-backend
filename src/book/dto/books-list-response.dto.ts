import { BookDto } from './book.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class BooksListResponseDto {
    data: BookDto[];

    meta: PaginationMetaDto;
}
