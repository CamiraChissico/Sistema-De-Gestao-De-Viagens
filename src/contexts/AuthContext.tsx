import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "rh" | "gestor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "pending";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; message: string };
  isAuthenticated: boolean;
  allUsers: User[];
  approveUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  addUser: (name: string, email: string, password: string, role: UserRole) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

interface StoredUser extends User {
  password: string;
}

const INITIAL_USERS: StoredUser[] = [
  { id: "1", name: "Fatima Macuácua", email: "rh@empresa.co.mz", role: "rh", password: "123456", status: "active" },
  { id: "2", name: "Carlos Mondlane", email: "gestor@empresa.co.mz", role: "gestor", password: "123456", status: "active" },
  { id: "3", name: "Maria Chissano", email: "admin@empresa.co.mz", role: "admin", password: "123456", status: "active" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUser[]>(INITIAL_USERS);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found && found.status === "active") {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const register = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Este email já está registado no sistema." };
    }
    const newUser: StoredUser = {
      id: `USR-${Date.now()}`,
      name,
      email,
      role,
      password,
      status: "pending",
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: "Conta criada com sucesso! Aguarde a aprovação do administrador." };
  }, [users]);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "active" as const } : u));
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const addUser = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Este email já está registado." };
    }
    const newUser: StoredUser = {
      id: `USR-${Date.now()}`,
      name,
      email,
      role,
      password,
      status: "active",
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: "Utilizador criado com sucesso!" };
  }, [users]);

  const allUsers: User[] = users.map(({ password: _, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, allUsers, approveUser, removeUser, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
