import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const rolesClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const user = {
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          roles: Array.isArray(rolesClaim) ? rolesClaim : rolesClaim ? [rolesClaim] : [],
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const token = response.token;
    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    const userData = {
      id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      roles: Array.isArray(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        : [decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']],
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, password) => {
    await authService.register(email, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    const roles = Array.isArray(user?.roles) ? user.roles : user?.roles ? [user.roles] : [];
    return roles.map((role) => String(role).toLowerCase()).includes('admin');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
