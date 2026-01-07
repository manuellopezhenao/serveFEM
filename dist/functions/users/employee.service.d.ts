import { Empleado, Beneficiario } from '../../interfaces/employee.interface';
export declare class EmployeeService {
    private readonly logger;
    private readonly excelFilePath;
    private cache;
    private lastModifiedTime;
    constructor();
    private getFileStats;
    private loadExcelFile;
    private ensureCacheIsUpToDate;
    getBeneficiariosByIdEmpleado(idEmpleado: string): Promise<Beneficiario[]>;
    getEmpleadoById(idEmpleado: string): Promise<Empleado | null>;
    forceReload(): Promise<void>;
    getCacheStats(): {
        isLoaded: boolean;
        employeeCount: number;
        lastModified: number | null;
    };
}
