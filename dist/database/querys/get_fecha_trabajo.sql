DROP PROCEDURE IF EXISTS GetFechaTrabajo;
CREATE PROCEDURE GetFechaTrabajo
    @proceso VARCHAR(255) = 'CAUSA-A'
AS
BEGIN
    SELECT TOP (1) 
        proceso,
        resultado,
        tiempo,
        fechatrabajo,
        fechasistema,
        numeronota,
        mensaje,
        id
    FROM [dbo].[resultadoscierreautomatico]
    WHERE proceso = @proceso
    ORDER BY fechatrabajo DESC;
END;

