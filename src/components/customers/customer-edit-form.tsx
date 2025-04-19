"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import type { Customer } from "@/services/customer/customer-service";

interface CustomerEditFormProps {
  customer: Customer;
  onSave: (customer: Customer) => Promise<void>;
  onCancel: () => void;
}

export function CustomerEditForm({
  customer,
  onSave,
  onCancel,
}: CustomerEditFormProps) {
  const [editedCustomer, setEditedCustomer] = useState<Customer>({
    ...customer,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedCustomer.name) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "O nome do cliente é obrigatório",
      });
      return;
    }

    try {
      setIsSaving(true);
      await onSave(editedCustomer);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Atualize as informações do cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={editedCustomer.name}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, name: e.target.value })
              }
              placeholder="Nome do cliente"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedCustomer.email || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    email: e.target.value,
                  })
                }
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editedCustomer.phone || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    phone: e.target.value,
                  })
                }
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="document_type">Tipo de Documento</Label>
              <Select
                value={editedCustomer.document_type || "cpf"}
                onValueChange={(value: "cpf" | "cnpj") =>
                  setEditedCustomer({ ...editedCustomer, document_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                value={editedCustomer.document || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    document: e.target.value,
                  })
                }
                placeholder={
                  editedCustomer.document_type === "cpf"
                    ? "000.000.000-00"
                    : "00.000.000/0000-00"
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={editedCustomer.address || ""}
              onChange={(e) =>
                setEditedCustomer({
                  ...editedCustomer,
                  address: e.target.value,
                })
              }
              placeholder="Rua, número, complemento"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={editedCustomer.city || ""}
                onChange={(e) =>
                  setEditedCustomer({ ...editedCustomer, city: e.target.value })
                }
                placeholder="Cidade"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={editedCustomer.state || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    state: e.target.value,
                  })
                }
                placeholder="Estado"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                value={editedCustomer.postal_code || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    postal_code: e.target.value,
                  })
                }
                placeholder="00000-000"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={editedCustomer.notes || ""}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, notes: e.target.value })
              }
              placeholder="Observações sobre o cliente"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="is_active">Status</Label>
            <Select
              value={editedCustomer.is_active ? "active" : "inactive"}
              onValueChange={(value) =>
                setEditedCustomer({
                  ...editedCustomer,
                  is_active: value === "active",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
