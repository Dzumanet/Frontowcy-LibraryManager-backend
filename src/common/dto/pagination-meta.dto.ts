import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({
        example: 100,
        description: 'Total number of items available.',
    })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number.' })
    page: number;

    @ApiProperty({ example: 10, description: 'Number of items per page.' })
    pageSize: number;

    @ApiProperty({ example: 10, description: 'Total number of pages.' })
    totalPages: number;

    @ApiProperty({
        example: true,
        description: 'Indicates if there is a next page.',
    })
    hasNextPage: boolean;

    @ApiProperty({
        example: false,
        description: 'Indicates if there is a previous page.',
    })
    hasPrevPage: boolean;
}
