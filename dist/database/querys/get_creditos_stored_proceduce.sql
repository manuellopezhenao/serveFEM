DROP PROCEDURE IF EXISTS GetCreditos;
CREATE PROCEDURE GetCreditos
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

SELECT
    c.codlinea as linea,
    c.pagare,
    c.capital as valorPrestamo,
	(c.saldocapital + c.intcorriente) AS ValorRestante,
    c.anualidad as cuota,
    c.F_iniciofinanciacion as fecha,
    CASE WHEN c.cuotasmora <= 0 THEN 0 ELSE c.saldoponersedia END as valorMora,
    c.cuotasmora as cuotasEnMora,
    ROUND((1 - (c.saldocapital / (c.capital))) * 100, 2) as porcentajePago,
    d.nombredestino as nombreCredito
FROM 
    creditos c
    LEFT JOIN destinos d ON c.coddestino = d.Coddestino
WHERE 
    c.cedulasociado = @cedula 
    and c.saldocapital > 0;
END;