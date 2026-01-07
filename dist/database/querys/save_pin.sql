DROP PROCEDURE IF EXISTS SavePin;

CREATE PROCEDURE SavePin
    @cedula VARCHAR(255),
    @pin VARCHAR(255),
    @expires DATETIME
AS
BEGIN

    IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE cedula = @cedula)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

    UPDATE users SET code_reset_password = @pin, code_reset_password_expires = @expires WHERE cedula = @cedula

    select 'Pin Actualizado' as message

END
