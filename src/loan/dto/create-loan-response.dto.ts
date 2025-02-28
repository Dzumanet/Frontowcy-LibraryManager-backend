import { ApiProperty } from '@nestjs/swagger';

export class CreateLoansResponseDto {
    @ApiProperty({ description: 'Unique ID of the loan' })
    id: string;

    @ApiProperty({ description: 'Date when the loan was created' })
    loanDate: Date;

    @ApiProperty({ description: 'Due date for returning the book' })
    dueDate: Date;

    @ApiProperty({
        description: 'Status of the loan',
        enum: ['borrowed', 'returned', 'overdue', 'forced_returned'],
    })
    loanStatus:
        | 'borrowed'
        | 'returned'
        | 'returned_late'
        | 'overdue'
        | 'forced_returned';
}
