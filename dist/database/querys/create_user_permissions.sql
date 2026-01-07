-- Script para crear usuario de SQL Server y otorgar permisos necesarios
-- Basado en el análisis de todos los procedimientos almacenados

-- ============================================
-- PASO 1: Crear el usuario de login (si no existe)
-- ============================================
-- Ejecutar en la base de datos maestra (master)
USE master;
GO

-- Crear login (cambiar 'fondoApp' y 'B9n63QbNxPQBWEDXCUY5' por valores reales)
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'fondoApp')
BEGIN
    CREATE LOGIN [fondoApp] WITH PASSWORD = 'B9n63QbNxPQBWEDXCUY5', 
        DEFAULT_DATABASE = [FEMCENTRAL],
        CHECK_EXPIRATION = OFF,
        CHECK_POLICY = OFF;
END
GO

-- ============================================
-- PASO 2: Cambiar al contexto de la base de datos
-- ============================================
USE [FEMCENTRAL];
GO

-- ============================================
-- PASO 3: Crear el usuario en la base de datos
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'fondoApp')
BEGIN
    CREATE USER [fondoApp] FOR LOGIN [fondoApp];
END
GO

-- ============================================
-- PASO 4: Permisos en la tabla USERS (acceso completo)
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON [dbo].[users] TO [fondoApp];
GO

-- ============================================
-- PASO 5: Permisos de lectura en otras tablas
-- ============================================
-- Tablas requeridas por los stored procedures
GRANT SELECT ON [dbo].[asociados] TO [fondoApp];
GRANT SELECT ON [dbo].[CedulasAhorros] TO [fondoApp];
GRANT SELECT ON [dbo].[creditos] TO [fondoApp];
GRANT SELECT ON [dbo].[destinos] TO [fondoApp];
GRANT SELECT ON [dbo].[ahorrospermanentes] TO [fondoApp];
GRANT SELECT ON [dbo].[AportesSociales] TO [fondoApp];
GRANT SELECT ON [dbo].[ahorrosalavista] TO [fondoApp];
GRANT SELECT ON [dbo].[ahorrosContractual] TO [fondoApp];
GRANT SELECT ON [dbo].[resultadoscierreautomatico] TO [fondoApp];
GO

-- ============================================
-- PASO 6: Permisos en vistas
-- ============================================
GRANT SELECT ON [dbo].[VIEWcodeudoresparalaweb] TO [fondoApp];
GO

-- ============================================
-- PASO 7: Permisos para ejecutar stored procedures
-- ============================================
-- Permisos para ejecutar los stored procedures creados en el proyecto

-- Stored procedures propios
GRANT EXECUTE ON [dbo].[SavePin] TO [fondoApp];
GRANT EXECUTE ON [dbo].[ResetPassword] TO [fondoApp];
GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetInfoUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetEmailUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[SaveUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetCreditos] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetAhorros] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetFechaTrabajo] TO [fondoApp];
GO

-- Stored procedure externo (ejecutado desde GetNovedades)
GRANT EXECUTE ON [dbo].[consultarnovedadesparalaliquidacion] TO [fondoApp];
GO

-- ============================================
-- PASO 8: Permisos para crear/modificar stored procedures (OPCIONAL)
-- ============================================
-- ⚠️ IMPORTANTE: Solo necesitas estos permisos si el usuario "fondoApp" 
-- va a ejecutar los scripts de creación/modificación de stored procedures.
-- Si los stored procedures los crea un administrador u otro usuario, NO necesitas esto.

-- OPCIÓN 1: Si el usuario necesita crear/modificar procedimientos almacenados
-- Descomentar las siguientes líneas:
-- GRANT CREATE PROCEDURE TO [fondoApp];
-- GRANT ALTER ON SCHEMA::[dbo] TO [fondoApp];

-- OPCIÓN 2: Usar rol predefinido (da más permisos de los necesarios)
-- ALTER ROLE db_ddladmin ADD MEMBER [fondoApp];

-- Si solo necesita EJECUTAR los procedimientos (no crearlos), NO necesita estos permisos
GO

-- ============================================
-- PASO 9: Verificar permisos (opcional)
-- ============================================
-- Verificar permisos otorgados
SELECT 
    dp.name AS DatabaseUserName,
    dp.type_desc AS UserType,
    p.permission_name AS Permission,
    p.state_desc AS PermissionState,
    OBJECT_NAME(p.major_id) AS ObjectName
FROM sys.database_permissions p
INNER JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
WHERE dp.name = 'fondoApp'
ORDER BY ObjectName, Permission;
GO

-- ============================================
-- ALTERNATIVA: Usar roles predefinidos (más simple)
-- ============================================
-- Si prefieres usar roles, puedes agregar al usuario a estos roles:
-- ALTER ROLE db_datareader ADD MEMBER [fondoApp];
-- ALTER ROLE db_datawriter ADD MEMBER [fondoApp];
-- ALTER ROLE db_ddladmin ADD MEMBER [fondoApp]; -- Solo si necesita crear/modificar objetos

-- NOTA: Los roles predefinidos dan más permisos de los necesarios,
-- por lo que se recomienda usar permisos granulares como arriba.

