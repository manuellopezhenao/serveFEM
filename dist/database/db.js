"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const common_1 = require("@nestjs/common");
const sql = require("mssql");
class db {
    constructor() {
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            port: parseInt(process.env.DB_PORT),
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
        };
        this.connection = new sql.ConnectionPool(config);
        this.connection.connect((err) => {
            if (err)
                throw err;
            console.log('Conexión a la base de datos establecida');
        });
    }
    async execute(procedure, params) {
        try {
            const request = new sql.Request(this.connection);
            params.forEach((param) => {
                request.input(param.name, param.type, param.value);
            });
            const result = await request.execute(procedure);
            return result.recordset;
        }
        catch (error) {
            console.log('execute', error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async excuteQuery(query) {
        try {
            const request = new sql.Request(this.connection);
            const result = await request.query(query);
            return result.recordset;
        }
        catch (error) {
            console.log('excuteQuery', error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    disconnect() {
        this.connection.close((err) => {
            if (err)
                throw err;
            console.log('Conexión a la base de datos cerrada');
        });
    }
}
exports.db = db;
//# sourceMappingURL=db.js.map