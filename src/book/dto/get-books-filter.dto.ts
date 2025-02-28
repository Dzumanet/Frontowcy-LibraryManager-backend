import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { BookCategoryEnum } from '../book.entity';

export class GetBooksFilterDto {
    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsEnum(BookCategoryEnum, { message: 'Invalid category' })
    category?: BookCategoryEnum;

    @IsOptional()
    sortBy?: 'title' | 'author';

    @IsOptional()
    sortOrder?: 'ASC' | 'DESC';

    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 1 : parsed;
    })
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 10 : parsed;
    })
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = 10;
}
