"use client";

import type React from "react";

import { createContext, useState, useEffect, useCallback } from "react";
import AuthService from "@/services/auth-service";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/services/user-service";
import { Role } from "@/services/role-service";

// Tipos para o contexto de autenticação
export interface UserContext {
  id: number;
  name: string;
  username: string;
  role: Role; // <--- Usar a interface Role importada
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
  const pathname = usePathname(); // Hook para obter o pathname atual
  const { toast } = useToast();

  // Lista de rotas de autenticação (públicas)
  const AUTH_ROUTES = ["/login", "/signin"]; // Adicione outras rotas de auth se tiver

  // Função para mapear o usuário do backend para o contexto
  const mapUserToContext = useCallback((user: User): UserContext | null => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role, // <--- Isso agora passa o objeto Role completo
      email: user.email,
    };
  }, []);

  useEffect(() => {
    console.log("Current Pathname:", pathname);
    console.log("Is Auth Route:", AUTH_ROUTES.includes(pathname));

    // AQUI: Condicionar a execução do checkAuthStatus
    // Não execute checkAuthStatus se a rota atual for uma rota de autenticação
    if (AUTH_ROUTES.includes(pathname)) {
      setIsLoading(false); // Definir isLoading como false imediatamente para não travar a UI
      setUser(null); // Garantir que o user esteja nulo nessas rotas
      return; // Sair do useEffect
    }

    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedUserData = AuthService.getStoredUser();
        console.log("Dados do usuário armazenados:", storedUserData);

        if (storedUserData) {
          setUser(mapUserToContext(storedUserData));
        }

        const isAuthenticated = await AuthService.checkSessionStatus();
        console.log("Usuário autenticado:", isAuthenticated);

        if (isAuthenticated) {
          console.log("Usuário autenticado, buscando dados do usuário...");
          const currentUserResponse = await AuthService.getCurrentUser();
          console.log("Dados do usuário atual:", currentUserResponse);
          setUser(mapUserToContext(currentUserResponse.data.user));
        } else {
          console.log("Usuário não autenticado, redirecionando para login...");
          AuthService.logout();
          setUser(null);
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação com o backend:", error);
        AuthService.logout();
        setUser(null);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [mapUserToContext, pathname]); // MUDANÇA IMPORTANTE: Removido router e AUTH_ROUTES

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ username, password });
      console.log("Resposta do login:", response);

      setUser(mapUserToContext(response.data.user));
      router.push("/dashboard");
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
