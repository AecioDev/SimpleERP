"use client";

import { useState, useEffect } from "react";
import { useRequirePermission } from "@/hooks/use-require-permission";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Customer } from "@/services/customer/customer-service"; // Certifique-se de que este tipo está correto
import Link from "next/link";
import { routes } from "@/config/routes"; // Suas rotas globais
import { Button } from "rizzui"; // Ou o componente Button do seu UI kit
import { PiPlusBold } from "react-icons/pi";
import { CustomersList } from "./components/customers-list"; // Assumindo que esta lista existe

export default function CustomersPage() {
  // Estado para o carregamento do CONTEÚDO da página, não da autenticação
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customers, setCustomers] = useState<Customer[]>([]); // Estado para os dados dos clientes

  // Usa o hook de permissão para gerenciar o acesso à página
  // A página 'Clientes' precisa da permissão 'customers.view'
  const { hasPermissionCheckCompleted } = useRequirePermission({
    requiredPermissions: ["customers.view"],
    accessDeniedMessage: "Você não tem permissão para visualizar clientes.",
    // redirectPath: "/dashboard", // Opcional, já é o padrão
  });

  // useEffect para carregar os dados dos clientes APENAS se a verificação de permissão foi concluída
  useEffect(() => {
    if (hasPermissionCheckCompleted) {
      // Simula o carregamento de dados. Substitua por sua lógica de fetch real!
      // Por exemplo:
      // CustomerService.getCustomers().then(data => {
      //   setCustomers(data);
      //   setIsLoadingContent(false);
      // }).catch(error => {
      //   console.error("Erro ao carregar clientes:", error);
      //   setIsLoadingContent(false);
      // });

      // Por enquanto, apenas define como carregado para mostrar a UI
      setIsLoadingContent(false);
    }
  }, [hasPermissionCheckCompleted]); // Dependência: só roda quando a verificação de permissão é finalizada

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(
      customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  // Exibe um loader enquanto a verificação de permissão está em andamento ou o conteúdo está carregando
  if (!hasPermissionCheckCompleted || isLoadingContent) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se a verificação de permissão foi concluída E o usuário tem acesso, renderiza o conteúdo da página
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes do seu negócio
          </p>
        </div>
        <div>
          {/* Você pode adicionar uma permissão aqui também para o botão "Add Cliente" */}
          <Link
            href={routes.vendas.cadastros.createCliente}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Cliente
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Passe os clientes carregados para a lista */}
          <CustomersList onEdit={handleEditCustomer} />
        </CardContent>
      </Card>
    </div>
  );
}
