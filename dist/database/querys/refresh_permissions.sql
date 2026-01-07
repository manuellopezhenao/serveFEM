-- ============================================
-- Script para refrescar permisos (limpiar caché)
-- Ejecutar este script si los permisos están otorgados pero aún hay errores
-- ============================================
USE [FEMCENTRAL];
GO

-- Re-otorgar todos los permisos de ejecución para refrescar la caché
REVOKE EXECUTE ON [dbo].[CheckUser] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[CheckUser] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[SavePin] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[SavePin] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[ResetPassword] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[ResetPassword] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[GetInfoUser] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[GetInfoUser] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[GetEmailUser] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[GetEmailUser] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[SaveUser] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[SaveUser] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[GetCreditos] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[GetCreditos] TO [fondoApp];

REVOKE EXECUTE ON [dbo].[GetAhorros] FROM [fondoApp];
GRANT EXECUTE ON [dbo].[GetAhorros] TO [fondoApp];

GO

-- Verificar que los permisos se otorgaron correctamente
SELECT 
    OBJECT_NAME(p.major_id) AS StoredProcedure,
    p.permission_name AS Permission,
    p.state_desc AS State
FROM sys.database_permissions p
INNER JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
WHERE dp.name = 'fondoApp' 
    AND p.permission_name = 'EXECUTE'
    AND OBJECT_NAME(p.major_id) IS NOT NULL
ORDER BY StoredProcedure;
GO

