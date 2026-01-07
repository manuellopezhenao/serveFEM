DROP PROCEDURE IF EXISTS GetInfoUser;

CREATE PROCEDURE GetInfoUser
    @id_user VARCHAR(255)
AS
BEGIN
    IF NOT EXISTS(SELECT TOP 1 id_user FROM users WHERE id_user = @id_user)
    BEGIN
        SELECT 'Usuario No Existe' AS error
        RETURN
    END

    SELECT TOP 1
        u.cedula,
        u.name,
        a.salario
    FROM
        users u
    LEFT JOIN
        asociados a ON u.cedula = a.cedulasociado
    WHERE
        u.id_user = @id_user
END
