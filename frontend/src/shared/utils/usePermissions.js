import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    
    // Проверка для администратора
    if (user.roles?.includes('admin')) return true;
    
    // Проверка конкретных разрешений
    return user.permissions?.includes(requiredPermission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    if (user.roles?.includes('admin')) return true;
    
    return permissions.some(permission => 
      user.permissions?.includes(permission)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    isAdmin: user?.roles?.includes('admin')
  };
};
