"use client";

import type React from "react";

import { createContext, useState, useEffect } from "react";
import AuthService from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/services/user-service";

// Tipos para o contexto de autenticação
export interface UserContext {
  id: number;
  name: string;
  username: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: UserContext | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const mapUserToContext = (user: User): UserContext | null => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role.name || "", // Se role estiver indefinido, substitui por uma string vazia
      email: user.email, // Atribui o email se existir
    };
  };

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const storedUser = AuthService.getStoredUser();
          if (storedUser) {
            setUser(mapUserToContext(storedUser.data.user) || null);
          } else {
            // Se temos token mas não temos usuário, buscar do servidor
            const currentUser = await AuthService.getCurrentUser();
            setUser(mapUserToContext(currentUser.data.user) || null);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Se houver erro, fazer logout
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ username, password });
      setUser(mapUserToContext(response.data.user));
      return true;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.response?.data?.message || "Credenciais inválidas",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
