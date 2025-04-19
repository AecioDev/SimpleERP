"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import type { Customer } from "@/services/customer/customer-service";

interface CustomerDetailsCardProps {
  customer: Customer;
}

export function CustomerDetailsCard({ customer }: CustomerDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>
              {customer.document_type === "cpf" ? "CPF" : "CNPJ"}:{" "}
              {customer.document || "Não informado"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{customer.email || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Telefone
            </p>
            <p>{customer.phone || "Não informado"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Endereço</p>
          <p>{customer.address || "Não informado"}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cidade</p>
            <p>{customer.city || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Estado</p>
            <p>{customer.state || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">CEP</p>
            <p>{customer.postal_code || "Não informado"}</p>
          </div>
        </div>
        {customer.notes && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Observações
            </p>
            <p className="whitespace-pre-line">{customer.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="flex w-full justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Cliente desde
            </p>
            <p>{new Date(customer.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p
              className={`font-medium ${
                customer.is_active ? "text-green-600" : "text-red-600"
              }`}
            >
              {customer.is_active ? "Ativo" : "Inativo"}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
