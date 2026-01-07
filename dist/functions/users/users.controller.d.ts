import { AuthService } from '../../auth/auth.service';
import { ValidateUserDto } from 'src/validators/User.validate';
import { JwtService } from '@nestjs/jwt';
import { ValidateResetDto, ValidateResetPasswordDto } from 'src/validators/Reset.validator';
import { ValidateRegisterDto } from 'src/validators/Register.validator';
export declare class UsersController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(userDto: ValidateUserDto): Promise<{
        access_token: string;
        statusCode: string;
        message: string;
    }>;
    register(RegisterDto: ValidateRegisterDto): Promise<{
        statusCode: string;
        message: any;
    }>;
    getInfo(req: any): Promise<any>;
    sendCode(ResetDto: ValidateResetDto): Promise<{
        statusCode: string;
        message: string;
    }>;
    resetPassword(ResetDto: ValidateResetPasswordDto): Promise<{
        statusCode: string;
        message: any;
    }>;
}
