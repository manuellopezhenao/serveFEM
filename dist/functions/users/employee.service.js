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
var EmployeeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
let EmployeeService = EmployeeService_1 = class EmployeeService {
    constructor() {
        this.logger = new common_1.Logger(EmployeeService_1.name);
        this.cache = null;
        this.lastModifiedTime = null;
        this.excelFilePath = path.join(process.cwd(), 'dist', 'base_de_datos_consolidada.xlsx');
    }
    async getFileStats() {
        try {
            const stats = await fs.promises.stat(this.excelFilePath);
            return stats;
        }
        catch (error) {
            this.logger.error(`Error al leer el archivo Excel: ${error.message}`, error.stack);
            return null;
        }
    }
    async loadExcelFile() {
        try {
            const stats = await this.getFileStats();
            if (!stats) {
                throw new Error(`El archivo no existe o no se puede leer: ${this.excelFilePath}`);
            }
            const workbook = XLSX.readFile(this.excelFilePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, {
                raw: false,
            });
            if (rows.length === 0) {
                return {};
            }
            const empleadosMap = {};
            for (const row of rows) {
                const idEmpleado = String(row.id_empleado || '').trim();
                if (!idEmpleado) {
                    continue;
                }
                if (!empleadosMap[idEmpleado]) {
                    empleadosMap[idEmpleado] = {
                        id: idEmpleado,
                        nombre: String(row.nombre_empleado || '').trim(),
                        beneficiarios: [],
                    };
                }
                const nombreBeneficiario = String(row.nombre_beneficiario || '').trim();
                const parentesco = String(row.parentesco || '').trim();
                if (nombreBeneficiario) {
                    const beneficiario = {
                        nombre: nombreBeneficiario,
                        parentesco: parentesco,
                    };
                    const existeBeneficiario = empleadosMap[idEmpleado].beneficiarios.some((b) => b.nombre.toLowerCase() === nombreBeneficiario.toLowerCase() &&
                        b.parentesco.toLowerCase() === parentesco.toLowerCase());
                    if (!existeBeneficiario) {
                        empleadosMap[idEmpleado].beneficiarios.push(beneficiario);
                    }
                }
            }
            this.lastModifiedTime = stats.mtimeMs;
            return empleadosMap;
        }
        catch (error) {
            this.logger.error(`Error al procesar el archivo Excel: ${error.message}`, error.stack);
            throw new Error(`Error al procesar el archivo Excel: ${error.message}`);
        }
    }
    async ensureCacheIsUpToDate() {
        const stats = await this.getFileStats();
        if (!stats) {
            if (this.cache !== null) {
                this.cache = null;
                this.lastModifiedTime = null;
            }
            return;
        }
        if (this.cache === null ||
            this.lastModifiedTime === null ||
            stats.mtimeMs !== this.lastModifiedTime) {
            this.cache = await this.loadExcelFile();
        }
    }
    async getBeneficiariosByIdEmpleado(idEmpleado) {
        await this.ensureCacheIsUpToDate();
        if (!this.cache) {
            return [];
        }
        const idEmpleadoNormalizado = String(idEmpleado || '').trim();
        const empleado = this.cache[idEmpleadoNormalizado];
        if (!empleado) {
            return [];
        }
        return empleado.beneficiarios || [];
    }
    async getEmpleadoById(idEmpleado) {
        await this.ensureCacheIsUpToDate();
        if (!this.cache) {
            return null;
        }
        const idEmpleadoNormalizado = String(idEmpleado || '').trim();
        return this.cache[idEmpleadoNormalizado] || null;
    }
    async forceReload() {
        this.cache = null;
        this.lastModifiedTime = null;
        await this.ensureCacheIsUpToDate();
    }
    getCacheStats() {
        return {
            isLoaded: this.cache !== null,
            employeeCount: this.cache ? Object.keys(this.cache).length : 0,
            lastModified: this.lastModifiedTime,
        };
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = EmployeeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map