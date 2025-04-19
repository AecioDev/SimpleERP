"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Customer } from "@/services/customer/customer-service";
import { CustomersList } from "@/components/customers/customers-list";
import { AddCustomerForm } from "@/components/customers/add-customer-form";
import { EditCustomerForm } from "@/components/customers/edit-customer-form";

export default function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

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
    } else {
      setIsLoading(false);
    }
  }, [user, router, toast]);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(
      customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes do seu negócio
          </p>
        </div>
        <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersList onEdit={handleEditCustomer} />
        </CardContent>
      </Card>

      <EditCustomerForm
        customer={selectedCustomer}
        open={isEditCustomerOpen}
        onOpenChange={setIsEditCustomerOpen}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </div>
  );
}
