-- ============================================
-- Script de diagnóstico completo para CheckUser
-- Ejecutar este script para identificar el problema
-- ============================================
USE [FEMCENTRAL];
GO

-- ============================================
-- 1. Verificar que el stored procedure existe y su ubicación
-- ============================================
PRINT '=== 1. Verificando stored procedure CheckUser ===';
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS ProcedureName,
    type_desc AS ObjectType,
    OBJECTPROPERTY(OBJECT_ID, 'OwnerId') AS OwnerId,
    USER_NAME(OBJECTPROPERTY(OBJECT_ID, 'OwnerId')) AS Owner
FROM sys.procedures
WHERE name = 'CheckUser';
GO

-- ============================================
-- 2. Verificar permisos de ejecución
-- ============================================
PRINT '=== 2. Verificando permisos de ejecución ===';
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
-- 3. Verificar permisos en tablas que usa CheckUser
-- ============================================
PRINT '=== 3. Verificando permisos en tablas (users y asociados) ===';
SELECT 
    dp.name AS DatabaseUserName,
    p.permission_name AS Permission,
    p.state_desc AS PermissionState,
    SCHEMA_NAME(o.schema_id) + '.' + OBJECT_NAME(p.major_id) AS ObjectName
FROM sys.database_permissions p
INNER JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
LEFT JOIN sys.objects o ON p.major_id = o.object_id
WHERE dp.name = 'fondoApp' 
    AND p.permission_name = 'SELECT'
    AND OBJECT_NAME(p.major_id) IN ('users', 'asociados');
GO

-- ============================================
-- 4. Verificar si el usuario fondoApp existe
-- ============================================
PRINT '=== 4. Verificando usuario fondoApp ===';
SELECT 
    name AS UserName,
    type_desc AS UserType,
    default_schema_name AS DefaultSchema
FROM sys.database_principals
WHERE name = 'fondoApp';
GO

-- ============================================
-- 5. Verificar el login de fondoApp
-- ============================================
PRINT '=== 5. Verificando login de fondoApp ===';
SELECT 
    name AS LoginName,
    type_desc AS LoginType,
    default_database_name AS DefaultDatabase
FROM sys.server_principals
WHERE name = 'fondoApp';
GO

-- ============================================
-- 6. Intentar ejecutar como fondoApp (simular)
-- ============================================
PRINT '=== 6. Verificando ownership del stored procedure ===';
SELECT 
    OBJECT_SCHEMA_NAME(OBJECT_ID('CheckUser')) AS SchemaName,
    OBJECT_NAME(OBJECT_ID('CheckUser')) AS ProcedureName,
    USER_NAME(OBJECTPROPERTY(OBJECT_ID('CheckUser'), 'OwnerId')) AS Owner;
GO

-- ============================================
-- 7. SOLUCIÓN: Aplicar todas las correcciones necesarias
-- ============================================
PRINT '=== 7. Aplicando correcciones ===';

-- Asegurar que el stored procedure esté en dbo
IF SCHEMA_NAME(OBJECTPROPERTY(OBJECT_ID('CheckUser'), 'SchemaId')) != 'dbo'
BEGIN
    PRINT 'Moviendo CheckUser al esquema dbo...';
    ALTER SCHEMA dbo TRANSFER OBJECT::[CheckUser];
END
GO

-- Cambiar ownership a dbo
ALTER AUTHORIZATION ON [dbo].[CheckUser] TO [dbo];
GO

-- Otorgar permisos en tablas
GRANT SELECT ON [dbo].[users] TO [fondoApp];
GRANT SELECT ON [dbo].[asociados] TO [fondoApp];
GO

-- Re-otorgar permisos de ejecución
REVOKE EXECUTE ON [dbo].[CheckUser] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GO

PRINT '=== Correcciones aplicadas. Verificar resultados arriba. ===';
GO

