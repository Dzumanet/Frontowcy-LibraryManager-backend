import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
    @ApiProperty({
        description:
            'A unique identifier for the user. It follows the UUID format to ensure global uniqueness.',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description:
            'The first name of the user, representing their given name.',
        example: 'John',
    })
    @Expose()
    firstName: string;

    @ApiProperty({
        description:
            'The last name of the user, representing their family name.',
        example: 'Doe',
    })
    @Expose()
    lastName: string;

    @ApiProperty({
        description:
            'The primary email address associated with the user, used for login and communication.',
        example: 'john.doe@example.com',
    })
    @Expose()
    email: string;

    @ApiProperty({
        description:
            "The user's library card number, serving as a unique identifier for library-related operations.",
        example: '12345-67890',
    })
    @Expose()
    libraryCardNumber: string;

    @ApiProperty({
        description:
            'The role assigned to the user, defining their access level and permissions within the system.',
        example: 'admin',
        enum: ['client', 'admin'],
    })
    @Expose()
    role: 'client' | 'admin';

    @ApiProperty({
        description:
            'The date and time when the user account was created, in ISO 8601 format.',
        example: '2025-01-01T00:00:00.000Z',
    })
    @Expose()
    createdAt: Date;

    @ApiProperty({
        description:
            'The date and time when the user account was last updated, in ISO 8601 format.',
        example: '2025-01-15T00:00:00.000Z',
    })
    @Expose()
    updatedAt: Date;

    @ApiProperty({
        description:
            "The date and time of the user's last login, recorded in ISO 8601 format. This field is optional.",
        example: '2025-01-20T10:15:30.000Z',
        required: false,
    })
    @Expose()
    lastLogin?: Date;

    @ApiProperty({
        description:
            "The URL of the user's profile picture, which can be used to display their avatar in the system. This field is optional.",
        example: 'https://example.com/profile-pictures/user123.jpg',
        required: false,
    })
    @Expose()
    profilePictureUrl?: string;
}
