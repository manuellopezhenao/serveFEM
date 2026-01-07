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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/auth.service");
const local_auth_guard_1 = require("../../auth/local-auth.guard");
const User_validate_1 = require("../../validators/User.validate");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const Reset_validator_1 = require("../../validators/Reset.validator");
const Register_validator_1 = require("../../validators/Register.validator");
let UsersController = class UsersController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async login(userDto) {
        const user = await this.authService.validateUser(userDto.username, userDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario o contraseña incorrectos');
        }
        return this.authService.login(user);
    }
    async register(RegisterDto) {
        return this.authService.register(RegisterDto);
    }
    async getInfo(req) {
        const paylod = this.jwtService.decode(req.headers.authorization.split(' ')[1]);
        const data = await this.authService.getInformationUser(paylod['user']);
        data['statusCode'] = '200';
        data['message'] = 'Información del usuario';
        return data;
    }
    async sendCode(ResetDto) {
        return this.authService.sendCode(ResetDto.cedula);
    }
    async resetPassword(ResetDto) {
        return this.authService.resetPassword(ResetDto.cedula, ResetDto.password, ResetDto.code);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_validate_1.ValidateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Register_validator_1.ValidateRegisterDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('getInfo'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Post)('sendCode'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Reset_validator_1.ValidateResetDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Reset_validator_1.ValidateResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], UsersController);
//# sourceMappingURL=users.controller.js.map