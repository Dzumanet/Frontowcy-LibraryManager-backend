import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserBorrowedBooksResponseDto } from './dto/user-borrowed-books-response.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { generateCardNumber } from '../utils/generateCardNumber';

@Injectable()
export class UserService {
    async registerUser(
        newUser: RegisterUserDto,
    ): Promise<RegisterUserResponseDto> {
        const existingUser = await UserEntity.findOne({
            where: { email: newUser.email },
        });
        if (existingUser) {
            return plainToInstance(
                RegisterUserResponseDto,
                {
                    email: newUser.email,
                    libraryCardNumber: null,
                    message: 'Email already in use.',
                    exists: true,
                    accountCreated: false,
                },
                { excludeExtraneousValues: true },
            );
        }

        const libraryCardNumber = generateCardNumber();

        const user = UserEntity.create({
            ...newUser,
            libraryCardNumber,
            pwdHash: hashPwd(newUser.pwd),
        });
        await user.save();

        return plainToInstance(
            RegisterUserResponseDto,
            {
                ...user,
                message: 'User has been successfully registered.',
                exists: false,
                accountCreated: true,
            },
            { excludeExtraneousValues: true },
        );
    }

    async getCurrentUser(userId: string): Promise<UserResponseDto> {
        const user = await UserEntity.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }

    async updateUserProfile(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await UserEntity.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        if (updateUserDto.pwd) {
            user.pwdHash = hashPwd(updateUserDto.pwd);
        }

        Object.assign(user, { ...updateUserDto, password: undefined });
        await user.save();

        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }

    async getBorrowedBooks(
        userId: string,
    ): Promise<UserBorrowedBooksResponseDto> {
        const user = await UserEntity.findOne({
            where: { id: userId },
            relations: ['rentals', 'rentals.book'],
        });
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        const borrowedBooks = user.rentals
            .filter((rental) => rental.rentalStatus === 'borrowed')
            .map((rental) => ({
                id: rental.book.id,
                title: rental.book.title,
                author: rental.book.author,
            }));
        return plainToInstance(UserBorrowedBooksResponseDto, {
            borrowedBooksCount: borrowedBooks.length,
            borrowedBooks,
        });
    }
}
