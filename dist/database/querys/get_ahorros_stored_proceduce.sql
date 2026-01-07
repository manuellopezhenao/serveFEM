DROP PROCEDURE IF EXISTS GetAhorros;

CREATE PROCEDURE GetAhorros
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

    DECLARE @AHORROS TABLE (
        linea char(4),
        nCuenta varchar(20),
        saldo decimal(18, 2),
        fechaInicio datetime,
        nombre VARCHAR(255)
    );
    
    INSERT INTO @AHORROS
    SELECT codlinea as linea, numerocuenta as nCuenta, saldoTotal as saldo, fechainicio as fechaInicio, 'Ahorro Permanente' as nombre
    FROM ahorrospermanentes
    WHERE cedulasociado = @cedula AND saldoTotal > 0

    INSERT INTO @AHORROS
    SELECT codlinea as linea, numerocuenta as nCuenta, saldoTotal as saldo, fechaapertura as fechaInicio, 'Aportes Sociales' as nombre
    FROM AportesSociales
    WHERE cedulasociado = @cedula AND saldoTotal > 0
    
    INSERT INTO @AHORROS
    SELECT codlinea as linea, numerocuenta as nCuenta, saldoTotal as saldo, fechainicio as fechaInicio, 'Ahorro Voluntario' as nombre
    FROM ahorrosalavista
    WHERE cedulasociado = @cedula AND saldoTotal > 0
    
    INSERT INTO @AHORROS
    SELECT codlinea as linea, numerocuenta as nCuenta, saldoTotal as saldo, fechainicio as fechaInicio, 'Ahorro Contractual' as nombre
    FROM ahorrosContractual
    WHERE cedulasociado = @cedula AND saldoTotal > 0

    SELECT * FROM @AHORROS;
END;



