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
            const checkUserRequest = new sql.Request(this.connection);
            checkUserRequest.query("SELECT SYSTEM_USER AS CurrentUser, USER_NAME() AS CurrentDatabaseUser", (err, result) => {
                if (err) {
                    console.error('Error al verificar usuario de conexión:', err);
                }
            });
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
            console.error('execute', error);
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
            console.error('excuteQuery', error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    disconnect() {
        this.connection.close((err) => {
            if (err) {
                console.error('Error al cerrar la conexión a la base de datos:', err);
                throw err;
            }
        });
    }
}
exports.db = db;
//# sourceMappingURL=db.js.map