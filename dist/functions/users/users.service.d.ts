import { IRecordSet } from 'mssql';
import { DataBaseService } from './../../database/database.service';
import { ValidateRegisterDto } from 'src/validators/Register.validator';
import { EmployeeService } from './employee.service';
export declare class UsersService {
    private database;
    private employeeService;
    private readonly logger;
    private readonly serviciosExcelPath;
    private serviciosCache;
    private serviciosLastModifiedTime;
    constructor(database: DataBaseService, employeeService: EmployeeService);
    findOneUser(username: string): Promise<IRecordSet<any>>;
    registerUser(user: ValidateRegisterDto): Promise<IRecordSet<any>>;
    getIfo(cedula: number): Promise<any>;
    private getServiciosFileStats;
    private loadServiciosExcel;
    private ensureServiciosCacheIsUpToDate;
    getServicios(): Promise<any[]>;
    getEmail(cedula: string): Promise<IRecordSet<any>>;
    saveCode(cedula: string, code: string): Promise<IRecordSet<any>>;
    resetPassword(cedula: string, password: string, code: string): Promise<IRecordSet<any>>;
}
