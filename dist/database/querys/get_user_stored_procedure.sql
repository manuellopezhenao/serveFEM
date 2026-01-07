DROP PROCEDURE IF EXISTS CheckUser;

CREATE PROCEDURE CheckUser
    @username VARCHAR(255)
AS
BEGIN

    IF NOT EXISTS(SELECT TOP 1 * FROM users WHERE cedula = @username)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

    IF NOT EXISTS
            (SELECT TOP 1 *
             FROM asociados
             WHERE cedulasociado = @username
                 AND estado = 'A')
    BEGIN
        SELECT 'Usuario Desactivado' AS error
        RETURN
    END



    IF EXISTS(SELECT TOP 1 * FROM users WHERE cedula = @username)
    BEGIN
        SELECT TOP 1 * FROM users WHERE cedula = @username
    END
    ELSE
    BEGIN
        SELECT 'Usuario Y Contraseña Incorrectos' AS error
    END
END
