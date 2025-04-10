import api from "./api";
import { User } from "./user-service";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
}

const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    const { access_token, refresh_token, user } = response.data.data; // Corrigindo o acesso aos dados

    // Armazenar tokens e informações do usuário
    localStorage.setItem("token", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Remover tokens e informações do usuário
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem("user");
    //console.log("Local User:", user); // Adicionando log para verificar o valor

    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
