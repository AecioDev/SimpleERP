"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import CustomerService, {
  type Customer,
} from "@/services/customer/customer-service";
import { CustomerEditForm } from "@/components/customers/customer-edit-form";

export default function EditCustomerPage({
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

  const handleSave = async (editedCustomer: Customer) => {
    try {
      await CustomerService.updateCustomer(customerId, {
        name: editedCustomer.name,
        email: editedCustomer.email,
        phone: editedCustomer.phone,
        document: editedCustomer.document,
        document_type: editedCustomer.document_type,
        address: editedCustomer.address,
        city: editedCustomer.city,
        state: editedCustomer.state,
        postal_code: editedCustomer.postal_code,
        notes: editedCustomer.notes,
        is_active: editedCustomer.is_active,
      });

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso",
      });

      router.push(`/sales/customers/${customerId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description:
          error.response?.data?.message ||
          "Ocorreu um erro ao atualizar o cliente",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/sales/customers/${customerId}`);
  };

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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/sales/customers/${customerId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Cliente</h1>
      </div>

      <CustomerEditForm
        customer={customer}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
