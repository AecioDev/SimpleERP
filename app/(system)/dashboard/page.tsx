"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // Seu hook de autenticação
import { Spinner } from "@/components/ui/spinner"; // Opcional: para exibir enquanto redireciona

export default function DashboardIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só tentamos redirecionar se o carregamento do usuário estiver completo
    // e se tivermos um objeto de usuário.
    if (!isLoading && user) {
      // Usar router.replace para que o usuário não possa voltar para esta página de redirecionamento
      // com o botão 'voltar' do navegador.
      switch (user.role.name) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "GERENTE": // Assumindo que o nome da role é 'GERENTE' no backend
          router.replace("/dashboard/manager");
          break;
        case "FINANCEIRO": // Assumindo que o nome da role é 'FINANCEIRO' no backend
          router.replace("/dashboard/finance");
          break;
        case "VENDAS": // Assumindo que o nome da role é 'VENDAS' no backend
          router.replace("/dashboard/sales");
          break;
        default:
          // Caso a role não seja reconhecida ou não tenha um dashboard específico
          router.replace("/dashboard/general"); // Ou uma página de erro/dashboard padrão
          break;
      }
    }
  }, [isLoading, user, router]); // Dependências do useEffect

  // Exibir um spinner enquanto o redirecionamento acontece
  // Ou um componente de carregamento simples.
  if (isLoading) {
    return <Spinner fullScreen />;
  }

  // Se o usuário está presente mas ainda não redirecionou (por algum atraso),
  // ou se não há role correspondente, podemos exibir algo temporário ou null.
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
      <p className="ml-2 text-lg">Redirecionando para o seu dashboard...</p>
    </div>
  );
}
