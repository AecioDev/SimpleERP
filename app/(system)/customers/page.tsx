// UI para listar clientes (rota: routes.vendas.cadastros.clientes.root)
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Customer } from "@/services/customer/customer-service"; // Certifique-se de que este tipo está correto
import Link from "next/link";
import { routes } from "@/config/routes"; // Suas rotas globais
import { Button } from "rizzui"; // Ou o componente Button do seu UI kit
import { PiPlusBold } from "react-icons/pi";
import { CustomersList } from "@/components/customers/common/customers-list"; // Assumindo que esta lista existe
import { PagePermissionGuard } from "@/components/layout/PagePermissionGuard";

export default function CustomersPage() {
  // Estado para o carregamento do CONTEÚDO da página, não da autenticação
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customers, setCustomers] = useState<Customer[]>([]); // Estado para os dados dos clientes

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(
      customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  // Se a verificação de permissão foi concluída E o usuário tem acesso, renderiza o conteúdo da página
  return (
    <PagePermissionGuard
      requiredPermissions={["customers.view"]}
      accessDeniedMessage="Você não tem permissão para visualizar clientes."
    >
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
              href={routes.customers.create} // Certifique-se de que esta rota está correta
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
    </PagePermissionGuard>
  );
}
