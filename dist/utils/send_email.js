"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer = require("nodemailer");
const sendEmail = async (email, code, nombre) => {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2('clientId', 'clientSecret', 'https://developers.google.com/oauthplayground');
    oAuth2Client.setCredentials({ refresh_token: 'refreshToken' });
    try {
        const transport = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'recuperacionfecor@gmail.com',
                pass: 'fgdvpqchsjkzpdgf',
            },
        });
        const mailOptions = {
            from: 'Fecor <recuperacionfecor@gmail.com>',
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Código de recuperación de contraseña</title>
          <style>
            body {
              background-color: #f4f6f9;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            h1, h2 {
              color: #002147;
              font-weight: bold;
              margin-bottom: 20px;
              text-align: center;
              text-transform: uppercase;
            }
            p {
              color: #002147;
              margin-bottom: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 4px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              margin: 50px auto;
              max-width: 600px;
              padding: 30px;
            }
            .code {
              background-color: #62c462;
              border-radius: 4px;
              color: #ffffff;
              display: inline-block;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 20px;
              padding: 10px 20px;
            }
            .button {
              background-color: #005cb9;
              border-radius: 4px;
              color: #ffffff;
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              transition: background-color 0.3s ease-in-out;
            }
            .button:hover {
              background-color: #2e8def;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Código de recuperación de contraseña</h1>
            <p>Estimado/a ${nombre},</p>
            <p>Aquí está su código de recuperación de contraseña:</p>
            <h2 class="code">${code}</h2>
            <p>Ingrese este código en el formulario de recuperación de contraseña para establecer una nueva contraseña. Tenga en cuenta que este código caducará en 5 minutos.</p>
            <p>Si no ha solicitado una recuperación de contraseña, ignore este correo electrónico.</p>
            <p>Atentamente,</p>
            <p>El equipo de Fecor</p>
          </div>
        </body>
      </html>
      `,
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send_email.js.map