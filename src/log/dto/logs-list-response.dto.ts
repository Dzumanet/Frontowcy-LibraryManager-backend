import { LogResponseDto } from './log-response.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class LogListResponseDto {
    data: LogResponseDto[];
    meta: PaginationMetaDto;
}
