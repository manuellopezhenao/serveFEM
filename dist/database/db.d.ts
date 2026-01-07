import * as sql from 'mssql';
declare class db {
    connection: any;
    constructor();
    execute(procedure: string, params: any): Promise<sql.IRecordSet<any>>;
    excuteQuery(query: string): Promise<sql.IRecordSet<any>>;
    disconnect(): void;
}
export { db };
