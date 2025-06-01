import axios from "axios";

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    // A lógica de refresh agora dependerá do backend lendo o refresh_token do cookie.
    // O frontend só precisa chamar o endpoint de refresh.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token:
        // O backend agora espera o refresh_token no cookie, não no corpo da requisição.
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true, // Garante que o cookie refresh_token seja enviado
          }
        );

        // O backend agora define os novos tokens (access e refresh) como cookies HttpOnly.
        // Reenviar a requisição original (o navegador enviará o novo access_token via cookie)
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, fazer logout
        // Limpar apenas os dados do usuário que não são tokens (se existirem)
        localStorage.removeItem("user_data");

        // O backend já limpará os cookies no logout, mas podemos forçar um redirecionamento aqui.
        window.location.href = "/login"; // Redirecionar para a página de login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
