-- ============================================
-- Script para solucionar problemas de permisos
-- Ejecutar este script si los permisos están otorgados pero aún hay errores
-- ============================================
USE [FEMCENTRAL];
GO

-- ============================================
-- PASO 1: Verificar que el stored procedure existe y su ownership
-- ============================================
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS ProcedureName,
    OBJECTPROPERTY(OBJECT_ID, 'IsMSShipped') AS IsSystemObject,
    USER_NAME(OBJECTPROPERTY(OBJECT_ID, 'OwnerId')) AS Owner
FROM sys.procedures
WHERE name = 'CheckUser';
GO

-- ============================================
-- PASO 2: Cambiar el ownership del stored procedure a dbo (si es necesario)
-- ============================================
-- Si el stored procedure no es propiedad de dbo, cambiarlo:
-- ALTER AUTHORIZATION ON [dbo].[CheckUser] TO [dbo];
-- GO

-- ============================================
-- PASO 3: Re-otorgar permisos explícitamente
-- ============================================
-- Primero revocar y luego otorgar de nuevo para limpiar caché
REVOKE EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GO

GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GO

-- ============================================
-- PASO 4: Verificar permisos después de re-otorgar
-- ============================================
SELECT 
    dp.name AS DatabaseUserName,
    p.permission_name AS Permission,
    p.state_desc AS PermissionState,
    SCHEMA_NAME(o.schema_id) + '.' + OBJECT_NAME(p.major_id) AS ObjectName
FROM sys.database_permissions p
INNER JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
LEFT JOIN sys.objects o ON p.major_id = o.object_id
WHERE dp.name = 'fondoApp' 
    AND p.permission_name = 'EXECUTE'
    AND OBJECT_NAME(p.major_id) = 'CheckUser';
GO

-- ============================================
-- PASO 5: Verificar el usuario actual de la conexión
-- ============================================
-- Ejecutar esto desde la aplicación para ver qué usuario está usando:
-- SELECT SYSTEM_USER AS CurrentUser, USER_NAME() AS CurrentDatabaseUser;
-- GO

