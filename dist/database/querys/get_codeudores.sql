-- Create procedure GetCodeudores
CREATE PROCEDURE GetCodeudores
    @id_user VARCHAR(255)
AS
BEGIN

    Declare @cedula int;

	IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE id_user = @id_user)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

	SELECT @cedula = cedula FROM users WHERE id_user = @id_user;

    -- Select codeudores based on the pagare values from the temp table
    SELECT
        V.cedulacodeudor,
        V.pagare,
        V.nombreintegrado,
        V.telefono
    FROM 
        [FONDECAR].[dbo].[VIEWcodeudoresparalaweb] V
    WHERE cedulacodeudor = @cedula and saldo > 0

END;