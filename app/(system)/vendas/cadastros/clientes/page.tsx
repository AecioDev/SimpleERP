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
import Link from "next/link";
import { routes } from "@/config/routes";
import { Button } from "rizzui";
import { PiPlusBold } from "react-icons/pi";
import { CustomersList } from "./components/customers-list";

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
        <div>
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
          <CustomersList onEdit={handleEditCustomer} />
        </CardContent>
      </Card>
    </div>
  );
}
