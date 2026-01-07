export interface Beneficiario {
    nombre: string;
    parentesco: string;
}
export interface Empleado {
    id: string;
    nombre: string;
    beneficiarios: Beneficiario[];
}
export interface EmpleadosMap {
    [idEmpleado: string]: Empleado;
}
export interface ExcelRow {
    id_empleado: string | number;
    nombre_empleado: string;
    nombre_beneficiario: string;
    parentesco: string;
}
