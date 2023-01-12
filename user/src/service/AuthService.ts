import { UserTokenPayload } from './../types/UserTokenPayload';
import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { User } from './../entity/User';
import { ValidationError } from './../error/error-type/ValidationError';
import { UserService } from "./UserService";
import argon2 from 'argon2'
import { Secret, sign, verify } from 'jsonwebtoken'

export class AuthService {
    private userService: UserService

    constructor() {
        this.userService = new UserService();
    }

    async login(username: string, password: string) {
        const user = await this.userService.getUserByUsername(username);

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await this.validatePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ValidationError('Invalid password')
        }

        return {
            id: user.id,
            username: user.username,
            accessToken: this.createUserToken('accessToken', user),
            refreshToken: this.createUserToken('refreshToken', user),
        }
    }

    async register(userDTO: CreateUserDTO) {
        const newUser = await this.userService.createCustomer(userDTO);
        return {
            id: newUser.id,
            username: newUser.username,
            accessToken: this.createUserToken('accessToken', newUser),
        }
    }

    async refreshAccessToken(refreshToken: string) {
        const decodedToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as UserTokenPayload;
        const user = await this.userService.getUserById(decodedToken.userId);

        if (!user) {
            throw new Error("User not found");
        }

        return {
            accessToken: this.createUserToken('accessToken', user),
        }
    }

    async logout() {
        return true;
    }

    async validatePassword(password: string, hashedPassword: string) {
        return await argon2.verify(hashedPassword, password)
    }

    createUserToken(type: 'accessToken' | 'refreshToken', user: User) {
        const payload: UserTokenPayload = {
            userId: user.id,
            username: user.username,
        }
        return sign(
            payload,
            type === 'accessToken'
                ? (process.env.ACCESS_TOKEN_SECRET as Secret)
                : (process.env.REFRESH_TOKEN_SECRET as Secret),
            {
                expiresIn: type === 'accessToken' ? '15m' : '60m'
            }
        )
    }
}