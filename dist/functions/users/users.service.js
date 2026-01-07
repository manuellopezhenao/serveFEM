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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./../../database/database.service");
const encryp_data_1 = require("../../utils/encryp_data");
const employee_service_1 = require("./employee.service");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
let UsersService = UsersService_1 = class UsersService {
    constructor(database, employeeService) {
        this.database = database;
        this.employeeService = employeeService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.serviciosCache = null;
        this.serviciosLastModifiedTime = null;
        this.serviciosExcelPath = path.join(process.cwd(), 'dist', 'servicios', 'servicios.xlsx');
    }
    async findOneUser(username) {
        const query = `EXEC [dbo].[CheckUser] @username = '${username}'`;
        const user = await this.database.db.excuteQuery(query);
        return user;
    }
    async registerUser(user) {
        const nameParts = [
            user.firstLastName,
            user.secondLastName,
            user.firstName,
            user.lastName
        ].filter(part => part && part.trim().length > 0);
        const fullname = nameParts.join(' ');
        const fullnamesinEspacios = fullname
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();
        const query = "EXEC SaveUser @cedula = '" +
            user.cedula +
            "', @name = '" +
            fullname +
            "', @email = '" +
            user.email +
            "', @password = '" +
            (await (0, encryp_data_1.encryptData)(user.password)) +
            "', @order_name = '" +
            fullnamesinEspacios +
            "'";
        const newUser = await this.database.db.excuteQuery(query);
        return newUser;
    }
    async getIfo(cedula) {
        var _a;
        const queryUsuario = `EXEC GetInfoUser @id_user = ${cedula}`;
        const usuario = await this.database.db.excuteQuery(queryUsuario);
        const queryAhorros = `EXEC GetAhorros @id_user = ${cedula}`;
        let ahorros = await this.database.db.excuteQuery(queryAhorros);
        if (Array.isArray(ahorros) && ahorros.length > 0) {
            const obtenerPrioridad = (linea) => {
                const lineaUpper = linea.trim().toUpperCase();
                if (lineaUpper === 'APOR')
                    return 1;
                if (lineaUpper === 'VOL' || lineaUpper.startsWith('VOL'))
                    return 2;
                if (lineaUpper === 'PERM')
                    return 3;
                return 999;
            };
            ahorros = ahorros.sort((a, b) => {
                const lineaA = String(a.linea || '').trim();
                const lineaB = String(b.linea || '').trim();
                const prioridadA = obtenerPrioridad(lineaA);
                const prioridadB = obtenerPrioridad(lineaB);
                return prioridadA - prioridadB;
            });
        }
        const queryCreditos = `EXEC GetCreditos @id_user = ${cedula}`;
        const creditos = await this.database.db.excuteQuery(queryCreditos);
        let beneficiarios = [];
        if ((_a = usuario[0]) === null || _a === void 0 ? void 0 : _a.cedula) {
            try {
                beneficiarios = await this.employeeService.getBeneficiariosByIdEmpleado(String(usuario[0].cedula));
            }
            catch (error) {
                console.error('Error al obtener beneficiarios:', error);
                beneficiarios = [];
            }
        }
        let servicios = [];
        try {
            servicios = await this.getServicios();
        }
        catch (error) {
            console.error('Error al obtener servicios:', error);
            servicios = [];
        }
        let fechaTrabajo = null;
        try {
            const fechaTrabajoResult = await this.getFechaTrabajo();
            if (fechaTrabajoResult && fechaTrabajoResult.length > 0 && fechaTrabajoResult[0].fechatrabajo) {
                fechaTrabajo = fechaTrabajoResult[0].fechatrabajo;
            }
        }
        catch (error) {
            console.error('Error al obtener fecha de trabajo:', error);
            fechaTrabajo = null;
        }
        return {
            usuario: usuario[0],
            ahorros,
            creditos,
            beneficiarios,
            servicios,
            fechaTrabajo,
        };
    }
    async getServiciosFileStats() {
        try {
            const stats = await fs.promises.stat(this.serviciosExcelPath);
            return stats;
        }
        catch (error) {
            this.logger.error(`Error al leer el archivo Excel de servicios: ${error.message}`, error.stack);
            return null;
        }
    }
    async loadServiciosExcel() {
        try {
            const stats = await this.getServiciosFileStats();
            if (!stats) {
                throw new Error(`El archivo no existe o no se puede leer: ${this.serviciosExcelPath}`);
            }
            const workbook = XLSX.readFile(this.serviciosExcelPath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, {
                raw: false,
            });
            if (rows.length === 0) {
                return [];
            }
            const protocol = process.env.USE_HTTPS === 'true' ? 'https' : 'http';
            const hostname = process.env.SERVER_HOST || 'localhost';
            const port = parseInt(process.env.SERVER_PORT || '3000', 10);
            const baseUrl = `${protocol}://${hostname}${port !== 80 && port !== 443 ? `:${port}` : ''}`;
            const servicios = rows.map((row) => {
                const nombreImagen = String(row.Imagen || '').trim();
                const imagenUrl = nombreImagen
                    ? `${baseUrl}/servicios/${nombreImagen}.png`
                    : null;
                return {
                    titulo: String(row.Título || '').trim(),
                    beneficio: String(row.Beneficio || '').trim(),
                    condiciones: String(row.Condiciones || '').trim(),
                    imagen: imagenUrl,
                };
            });
            this.serviciosLastModifiedTime = stats.mtimeMs;
            return servicios;
        }
        catch (error) {
            this.logger.error(`Error al procesar el archivo Excel de servicios: ${error.message}`, error.stack);
            throw new Error(`Error al procesar el archivo Excel de servicios: ${error.message}`);
        }
    }
    async ensureServiciosCacheIsUpToDate() {
        const stats = await this.getServiciosFileStats();
        if (!stats) {
            if (this.serviciosCache !== null) {
                this.serviciosCache = null;
                this.serviciosLastModifiedTime = null;
            }
            return;
        }
        if (this.serviciosCache === null ||
            this.serviciosLastModifiedTime === null ||
            stats.mtimeMs !== this.serviciosLastModifiedTime) {
            this.serviciosCache = await this.loadServiciosExcel();
        }
    }
    async getServicios() {
        await this.ensureServiciosCacheIsUpToDate();
        if (!this.serviciosCache) {
            return [];
        }
        return this.serviciosCache;
    }
    async getEmail(cedula) {
        const query = `EXEC GetEmailUser @cedula = '${cedula}'`;
        const user = await this.database.db.excuteQuery(query);
        return user;
    }
    async saveCode(cedula, code) {
        const fecha = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        const query = `EXEC SavePin @cedula = '${cedula}', @pin = '${code}', @expires = '${fecha}'`;
        const user = await this.database.db.excuteQuery(query);
        return user;
    }
    async resetPassword(cedula, password, code) {
        const fecha = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        const query = `EXEC ResetPassword @cedula = '${cedula}', @password = '${await (0, encryp_data_1.encryptData)(password)}', @code = '${code}', @date = '${fecha}'`;
        const user = await this.database.db.excuteQuery(query);
        return user;
    }
    async getFechaTrabajo() {
        const query = `EXEC GetFechaTrabajo`;
        const fechaTrabajo = await this.database.db.excuteQuery(query);
        return fechaTrabajo;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DataBaseService,
        employee_service_1.EmployeeService])
], UsersService);
//# sourceMappingURL=users.service.js.map