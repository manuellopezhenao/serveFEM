"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../functions/users/users.service");
const jwt_1 = require("@nestjs/jwt");
const user_models_1 = require("../models/user.models");
const generate_code_service_1 = require("./generate-code.service");
const send_email_1 = require("../utils/send_email");
const encryp_data_1 = require("../utils/encryp_data");
let AuthService = class AuthService {
    constructor(usersService, jwtService, password) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.password = password;
    }
    async validateUser(username, pass) {
        var _a, _b;
        const userDB = await this.usersService.findOneUser(username);
        const user = new user_models_1.User(userDB[0].id_user, userDB[0].cedula, userDB[0].name, userDB[0].email, userDB[0].username, userDB[0].password, userDB[0].created_at);
        if ((_a = userDB[0]['error']) === null || _a === void 0 ? void 0 : _a.includes('Usuario No Existe')) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'El usuario no existe',
            });
        }
        if ((_b = userDB[0]['error']) === null || _b === void 0 ? void 0 : _b.includes('Usuario Desactivado')) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'El usuario esta desactivado',
            });
        }
        if (!(await (0, encryp_data_1.compareData)(pass, userDB[0].password))) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'La contraseña es incorrecta',
            });
        }
        if (user.id_user) {
            return user;
        }
        return null;
    }
    async login(id_user) {
        const payload = {
            user: id_user.id_user,
            created_at: Date.now(),
        };
        return {
            access_token: this.jwtService.sign(payload),
            statusCode: '200',
            message: 'Login success',
        };
    }
    async register(user) {
        const newUser = await this.usersService.registerUser(user);
        return {
            statusCode: newUser[0]['error'] ? '400' : '200',
            message: newUser[0]['error'] ? newUser[0]['error'] : 'Register success',
        };
    }
    async getInformationUser(id_user) {
        return await this.usersService.getIfo(id_user);
    }
    async sendCode(cedula) {
        const userDB = await this.usersService.getEmail(cedula);
        const code = await this.password.generatecode();
        if (userDB[0].email) {
            await (0, send_email_1.sendEmail)(userDB[0].email, code, userDB[0].name);
            await this.usersService.saveCode(cedula, code);
            return {
                statusCode: '200',
                message: 'codigo enviado',
            };
        }
        else {
            return {
                statusCode: '500',
                message: 'Usuario No Existe',
            };
        }
    }
    async resetPassword(cedula, password, code) {
        const userDB = await this.usersService.resetPassword(cedula, password, code);
        if (userDB[0]['error']) {
            return {
                statusCode: '400',
                message: userDB[0]['error'],
            };
        }
        else {
            return {
                statusCode: '200',
                message: 'contraseña actualizada',
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        generate_code_service_1.PasswordResetService])
], AuthService);
//# sourceMappingURL=auth.service.js.map