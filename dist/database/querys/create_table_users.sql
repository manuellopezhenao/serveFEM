DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id_user INT PRIMARY KEY IDENTITY(1,1),
    cedula varchar(255) UNIQUE,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    code_reset_password varchar(255),
    code_reset_password_expires DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE()
);