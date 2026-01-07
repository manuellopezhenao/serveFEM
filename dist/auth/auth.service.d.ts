import { UsersService } from '../functions/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.models';
import { PasswordResetService } from './generate-code.service';
import { ValidateRegisterDto } from 'src/validators/Register.validator';
export declare class AuthService {
    private usersService;
    private jwtService;
    private password;
    constructor(usersService: UsersService, jwtService: JwtService, password: PasswordResetService);
    validateUser(username: string, pass: string): Promise<any>;
    login(id_user: User): Promise<{
        access_token: string;
        statusCode: string;
        message: string;
    }>;
    register(user: ValidateRegisterDto): Promise<{
        statusCode: string;
        message: any;
    }>;
    getInformationUser(id_user: number): Promise<any>;
    sendCode(cedula: string): Promise<{
        statusCode: string;
        message: string;
    }>;
    resetPassword(cedula: string, password: string, code: string): Promise<{
        statusCode: string;
        message: any;
    }>;
}
