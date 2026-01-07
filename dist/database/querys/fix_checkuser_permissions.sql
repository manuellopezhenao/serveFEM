-- ============================================
-- Script para solucionar el problema de permisos de CheckUser
-- ============================================
USE [FEMCENTRAL];
GO

-- ============================================
-- PASO 1: Verificar que el stored procedure existe y su esquema
-- ============================================
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS ProcedureName,
    type_desc AS ObjectType
FROM sys.procedures
WHERE name = 'CheckUser';
GO

-- ============================================
-- PASO 2: Asegurar que el stored procedure esté en el esquema dbo
-- ============================================
-- Si el stored procedure no está en dbo, moverlo:
-- ALTER SCHEMA dbo TRANSFER [esquema_actual].[CheckUser];
-- GO

-- ============================================
-- PASO 3: Cambiar el ownership del stored procedure a dbo
-- ============================================
ALTER AUTHORIZATION ON [dbo].[CheckUser] TO [dbo];
GO

-- ============================================
-- PASO 4: Asegurar permisos en las tablas que usa CheckUser
-- ============================================
-- CheckUser usa las tablas: users y asociados
-- Asegurar que fondoApp tenga permisos SELECT en estas tablas
GRANT SELECT ON [dbo].[users] TO [fondoApp];
GRANT SELECT ON [dbo].[asociados] TO [fondoApp];
GO

-- ============================================
-- PASO 5: Re-otorgar permisos de ejecución
-- ============================================
REVOKE EXECUTE ON [dbo].[CheckUser] FROM [fondoApp];
GO

GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GO

-- ============================================
-- PASO 6: Verificar permisos finales
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
    AND (
        (p.permission_name = 'EXECUTE' AND OBJECT_NAME(p.major_id) = 'CheckUser')
        OR (p.permission_name = 'SELECT' AND OBJECT_NAME(p.major_id) IN ('users', 'asociados'))
    )
ORDER BY ObjectName, Permission;
GO

