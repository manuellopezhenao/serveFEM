CREATE PROCEDURE GetNovedades (@id_user VARCHAR(255))
AS
BEGIN

     Declare @cedula int;

	IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE id_user = @id_user)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

	SELECT @cedula = cedula FROM users WHERE id_user = @id_user;

	BEGIN TRY
        -- Intentar ejecutar el subproceso "ConsultaNovedadesAsociadoPuntoAtencion"
        EXEC consultarnovedadesparalaliquidacion @cedula;
    END TRY
    BEGIN CATCH
        -- Si se produce un error, devolver los datos de la tabla con valores vacíos
        --SELECT '' AS Productos, '' AS Linea, '' AS Nombre, '' AS Cuota, '' AS Saldo, '' AS Cuenta;
        --RETURN;
		 -- Si se produce un error, devolver arreglo vacío
        SELECT CAST(NULL AS INT) AS Productos, CAST(NULL AS VARCHAR(255)) AS Linea, CAST(NULL AS VARCHAR(255)) AS Nombre, CAST(NULL AS DECIMAL(10, 2)) AS Cuota, CAST(NULL AS DECIMAL(10, 2)) AS Saldo, CAST(NULL AS VARCHAR(255)) AS Cuenta
        WHERE 1 = 0;
        RETURN;
    END CATCH
END