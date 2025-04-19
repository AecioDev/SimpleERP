"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import CustomerService, {
  type Customer,
} from "@/services/customer/customer-service";
import { CustomerDetailsCard } from "@/components/customers/customer-details-card";
import { CustomerPurchasesCard } from "@/components/customers/customer-purchases-card";

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const customerId = Number.parseInt(params.id);

  // Verificar permissões
  useEffect(() => {
    if (
      user &&
      user.role !== "ADMIN" &&
      user.role !== "Vendas" &&
      user.role !== "Gerente"
    ) {
      router.push("/dashboard");
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o módulo de vendas.",
      });
    }
  }, [user, router, toast]);

  // Carregar dados do cliente
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setIsLoading(true);
        const data = await CustomerService.getCustomerById(customerId);
        setCustomer(data);
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do cliente.",
        });
        router.push("/sales/customers");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      user &&
      (user.role === "ADMIN" ||
        user.role === "Vendas" ||
        user.role === "Gerente")
    ) {
      loadCustomer();
    }
  }, [customerId, user, router, toast]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Cliente não encontrado</p>
        <Button variant="link" onClick={() => router.push("/sales/customers")}>
          Voltar para a lista de clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/sales/customers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Cliente</h1>
        </div>
        <Button
          onClick={() => router.push(`/sales/customers/${customer.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Cliente
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CustomerDetailsCard customer={customer} />
        <CustomerPurchasesCard />
      </div>
    </div>
  );
}
