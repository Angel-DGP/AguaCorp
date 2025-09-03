import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Customer } from '@services/mockApi';
import { findCustomerByIdOrMeter } from '@services/mockApi';

type Role = 'Cliente' | 'Lector' | 'Admin';

type ReaderInfo = {
  code: string;
  name: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  role: Role;
  currentCustomer: Customer | null;
  currentReader: ReaderInfo | null;
  loginClient: (query: string) => { ok: boolean; error?: string };
  loginReader: (code: string, name: string) => void;
  loginAdmin: () => void;
  logout: () => void;
  refreshCurrentCustomer: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Cliente');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentReader, setCurrentReader] = useState<ReaderInfo | null>(null);

  const value = useMemo(
    () => ({
      isAuthenticated,
      role,
      currentCustomer,
      currentReader,
      loginClient: (query: string) => {
        console.log('AuthContext - loginClient called with:', query);
        const customer = findCustomerByIdOrMeter(query.trim());
        console.log('AuthContext - Found customer:', customer);
        
        if (!customer) {
          console.log('AuthContext - No customer found, returning error');
          setIsAuthenticated(false);
          setCurrentCustomer(null);
          return { ok: false, error: 'Cliente no encontrado' };
        }
        
        console.log('AuthContext - Setting client authentication');
        setRole('Cliente');
        setCurrentCustomer(customer);
        setCurrentReader(null);
        setIsAuthenticated(true);
        console.log('AuthContext - Client authentication successful, role:', 'Cliente', 'isAuthenticated:', true);
        return { ok: true };
      },
      loginReader: (code: string, name: string) => {
        console.log('AuthContext - loginReader called with:', code, name);
        setRole('Lector');
        setCurrentReader({ code, name });
        setCurrentCustomer(null);
        setIsAuthenticated(true);
        console.log('AuthContext - Reader login successful, role set to:', 'Lector', 'isAuthenticated:', true);
      },
      loginAdmin: () => {
        console.log('AuthContext - loginAdmin called');
        setRole('Admin');
        setCurrentReader(null);
        setCurrentCustomer(null);
        setIsAuthenticated(true);
        console.log('AuthContext - Admin login successful, role set to:', 'Admin', 'isAuthenticated:', true);
      },
      logout: () => {
        console.log('AuthContext - logout called');
        setIsAuthenticated(false);
        setCurrentCustomer(null);
        setCurrentReader(null);
        setRole('Cliente');
        console.log('AuthContext - Logout successful, role reset to:', 'Cliente', 'isAuthenticated:', false);
      },
      refreshCurrentCustomer: () => {
        console.log('AuthContext - refreshCurrentCustomer called');
        if (currentCustomer) {
          const refreshed = findCustomerByIdOrMeter(currentCustomer.id);
          if (refreshed) {
            setCurrentCustomer(refreshed);
            console.log('AuthContext - Customer data refreshed');
          } else {
            console.log('AuthContext - Customer not found, logging out');
            setIsAuthenticated(false);
            setCurrentCustomer(null);
            setCurrentReader(null);
            setRole('Cliente');
          }
        }
      },
    }),
    [isAuthenticated, role, currentCustomer, currentReader]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


