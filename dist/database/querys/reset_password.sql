DROP PROCEDURE IF EXISTS ResetPassword;

CREATE PROCEDURE ResetPassword
    @cedula VARCHAR(255),
    @password VARCHAR(255),
    @code VARCHAR(255),
    @date DATETIME
AS
BEGIN

    IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE cedula = @cedula)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

    IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE cedula = @cedula AND code_reset_password = @code)
    BEGIN
        SELECT 'Codigo Incorrecto' AS error
        RETURN
    END

    DECLARE @expires DATETIME
    SELECT @expires = code_reset_password_expires FROM users WHERE cedula = @cedula AND code_reset_password = @code
    IF DATEDIFF(MINUTE, @expires, @date) > 5
    BEGIN
        SELECT 'El código ha expirado' AS error
        RETURN
    END

    UPDATE users SET password = @password WHERE cedula = @cedula

    UPDATE users SET code_reset_password = NULL, code_reset_password_expires = NULL WHERE cedula = @cedula

    SELECT 'Contraseña Actualizada' AS message
END

