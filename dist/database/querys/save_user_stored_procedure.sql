DROP PROCEDURE IF EXISTS SaveUser;

CREATE PROCEDURE SaveUser @cedula VARCHAR(255),
                           @name VARCHAR(255),
                           @email VARCHAR(255),
                           @password VARCHAR(255),
                           @order_name VARCHAR(255)
AS
BEGIN
    -- Verificar si el username existe
    IF EXISTS
        (SELECT TOP 1 *
         FROM users
         WHERE cedula = @cedula)
    BEGIN
        -- Si el username existe, devolver un mensaje de error
        SELECT 'El Usuario Ya Existe' AS error FROM users
    END
    ELSE
    BEGIN
        -- verificar si la cedula existe en la tabla asociados

        IF EXISTS
            (SELECT TOP 1 *
             FROM asociados
             WHERE cedulasociado = @cedula
                 AND estado = 'A')
        BEGIN
            -- Si el username no existe, insertar el usuario
            IF (SELECT COUNT(*) FROM CedulasAhorros WHERE codigo = @cedula AND nombre LIKE @name + '%') > 0
            BEGIN
                INSERT INTO users (cedula, name, email, password)
                VALUES (@cedula,
                        @order_name,
                        @email,
                        @password)
            END
            ELSE
            BEGIN
                SELECT 'Datos proporcionados son incorrectos' AS error
                RETURN
            END

            -- Devolver la información del usuario
            SELECT TOP 1 *
            FROM users
            WHERE cedula = @cedula
            RETURN
        END
        ELSE
        BEGIN
            -- Si la cedula no existe, devolver un mensaje de error
            SELECT 'Datos proporcionados son incorrectos' AS error
            RETURN
        END
    END
END
