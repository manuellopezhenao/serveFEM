DROP PROCEDURE IF EXISTS GetEmailUser;

CREATE PROCEDURE GetEmailUser
    @cedula VARCHAR(255)
AS
BEGIN

    IF NOT EXISTS(SELECT TOP 1 cedula FROM users WHERE cedula = @cedula)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

    SELECT TOP 1
      [name]
      ,[email]
  FROM [FONDECAR].[dbo].[users] where [cedula] = @cedula

END
