"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const { isLoading } = useAuth(); // Mantém para exibir spinner e lidar com o estado inicial

  if (isLoading) {
    return <Spinner fullScreen />; // Mostra spinner enquanto o AuthContext verifica o estado
  }

  // Se isLoading é false e user é null, mostra o formulário de login
  // Se user não é null (usuário logado), o middleware ou o redirecionamento do login já cuidou de tudo.

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-16 w-16" />
          <h1 className="text-2xl font-bold">Sistema ERP</h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
