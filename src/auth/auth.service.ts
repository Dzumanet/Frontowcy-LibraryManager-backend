import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';
import { sign } from 'jsonwebtoken';
import { UserEntity } from '../user/user.entity';
import { v4 as uuid } from 'uuid';
import { AuthLoginDto } from './dto/auth-login.dto';
import { hashPwd } from '../utils/hash-pwd';
import { Response } from 'express';

@Injectable()
export class AuthService {
    private createToken(
        currentTokenId: string,
        role: string,
    ): {
        accessToken: string;
        expiresIn: number;
    } {
        const payload: JwtPayload = { id: currentTokenId, role };
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, process.env.JWT_KEY, { expiresIn });

        return {
            accessToken,
            expiresIn,
        };
    }

    private async generateToken(user: UserEntity): Promise<string> {
        let token: string;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await UserEntity.findOne({
                where: { currentTokenId: token },
            });
        } while (!!userWithThisToken);
        user.currentTokenId = token;
        await user.save();

        return token;
    }

    async login(req: AuthLoginDto, res: Response): Promise<any> {
        const user = await UserEntity.findOne({
            where: {
                libraryCardNumber: req.libraryCardNumber,
                pwdHash: hashPwd(req.pwd),
            },
        });

        if (!user) {
            throw new UnauthorizedException(
                'Check your library card number and password',
            );
        }

        user.lastLogin = new Date();
        await user.save();

        const tokenData = this.createToken(
            await this.generateToken(user),
            user.role,
        );

        res.cookie('jwt', tokenData.accessToken, {
            httpOnly: true,
            secure: false,
            domain: 'localhost',
            path: '/',
        });

        return res.json({
            loggedIn: true,
            userId: user.id,
            loggedUser: user.libraryCardNumber,
            role: user.role,
        });
    }

    async logout(user: UserEntity, res: Response) {
        try {
            user.currentTokenId = null;
            await user.save();
            res.clearCookie('jwt', {
                secure: false,
                domain: 'localhost',
                httpOnly: true,
            });
            return res.json({ loggedIn: false });
        } catch (e) {
            return res.json({ error: e.message });
        }
    }
}
