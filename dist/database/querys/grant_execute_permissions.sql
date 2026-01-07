-- ============================================
-- Script para otorgar permisos de ejecución a stored procedures
-- Ejecutar este script si ya creaste el usuario pero faltan permisos
-- ============================================
USE [FEMCENTRAL];
GO

-- ============================================
-- Permisos para ejecutar stored procedures propios
-- ============================================
GRANT EXECUTE ON [dbo].[SavePin] TO [fondoApp];
GRANT EXECUTE ON [dbo].[ResetPassword] TO [fondoApp];
GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetInfoUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetEmailUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[SaveUser] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetCreditos] TO [fondoApp];
GRANT EXECUTE ON [dbo].[GetAhorros] TO [fondoApp];
GO

-- ============================================
-- Permisos para ejecutar stored procedures externos
-- ============================================
GRANT EXECUTE ON [dbo].[consultarnovedadesparalaliquidacion] TO [fondoApp];
GO

-- ============================================
-- Verificar permisos otorgados
-- ============================================
SELECT 
    dp.name AS DatabaseUserName,
    p.permission_name AS Permission,
    p.state_desc AS PermissionState,
    OBJECT_NAME(p.major_id) AS ObjectName
FROM sys.database_permissions p
INNER JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
WHERE dp.name = 'fondoApp' 
    AND p.permission_name = 'EXECUTE'
    AND OBJECT_NAME(p.major_id) IS NOT NULL
ORDER BY ObjectName;
GO

