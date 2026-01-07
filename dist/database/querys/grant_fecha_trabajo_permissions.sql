-- ============================================
-- Script para otorgar permisos de GetFechaTrabajo
-- Ejecutar este script en SSMS
-- ============================================
USE [FEMCENTRAL];
GO

-- Permiso de lectura en la tabla resultadoscierreautomatico
GRANT SELECT ON [dbo].[resultadoscierreautomatico] TO [fondoApp];
GO

-- Permiso de ejecución en el stored procedure GetFechaTrabajo
GRANT EXECUTE ON [dbo].[GetFechaTrabajo] TO [fondoApp];
GO

-- Verificar que los permisos se otorgaron correctamente
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
        (p.permission_name = 'EXECUTE' AND OBJECT_NAME(p.major_id) = 'GetFechaTrabajo')
        OR (p.permission_name = 'SELECT' AND OBJECT_NAME(p.major_id) = 'resultadoscierreautomatico')
    )
ORDER BY ObjectName, Permission;
GO

