"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
const path_1 = require("path");
async function bootstrap() {
    const isHttps = process.env.USE_HTTPS === 'true';
    let app;
    if (isHttps) {
        const httpsOptions = {
            key: fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8'),
            cert: fs.readFileSync(process.env.CERTIFICATE_PATH, 'utf8'),
            ca: process.env.CA_PATH
                ? [fs.readFileSync(process.env.CA_PATH, 'utf8')]
                : undefined,
        };
        app = await core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
    }
    else {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
    }
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'dist', 'servicios'), {
        prefix: '/servicios/',
    });
    const port = process.env.SERVER_PORT || 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map