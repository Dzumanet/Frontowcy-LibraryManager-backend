import { ApiProperty } from '@nestjs/swagger';

export class CreateRentalsResponseDto {
    @ApiProperty({ description: 'Unique ID of the rental' })
    id: string;

    @ApiProperty({ description: 'Date when the rental was created' })
    rentalDate: Date;

    @ApiProperty({ description: 'Due date for returning the book' })
    dueDate: Date;

    @ApiProperty({
        description: 'Status of the rental',
        enum: ['borrowed', 'returned', 'overdue', 'forced_returned'],
    })
    rentalStatus: 'borrowed' | 'returned' | 'overdue' | 'forced_returned';
}
