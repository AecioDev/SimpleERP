"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import CustomerService, {
  type Customer,
} from "@/services/customer/customer-service";

interface EditCustomerFormProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUpdated: (customer: Customer) => void;
}

export function EditCustomerForm({
  customer,
  open,
  onOpenChange,
  onCustomerUpdated,
}: EditCustomerFormProps) {
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (customer) {
      setEditedCustomer({ ...customer });
    }
  }, [customer]);

  const handleUpdateCustomer = async () => {
    if (!editedCustomer) return;

    if (!editedCustomer.name) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "O nome do cliente é obrigatório",
      });
      return;
    }

    try {
      const updatedCustomer = await CustomerService.updateCustomer(
        editedCustomer.id,
        {
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
        }
      );

      toast({
        title: "Cliente atualizado",
        description: `O cliente ${updatedCustomer.name} foi atualizado com sucesso`,
      });

      onCustomerUpdated(updatedCustomer);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description:
          error.response?.data?.message ||
          "Ocorreu um erro ao atualizar o cliente",
      });
    }
  };

  if (!editedCustomer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome Completo</Label>
            <Input
              id="edit-name"
              value={editedCustomer.name}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editedCustomer.email || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editedCustomer.phone || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-document-type">Tipo de Documento</Label>
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
              <Label htmlFor="edit-document">Documento</Label>
              <Input
                id="edit-document"
                value={editedCustomer.document || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    document: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-address">Endereço</Label>
            <Input
              id="edit-address"
              value={editedCustomer.address || ""}
              onChange={(e) =>
                setEditedCustomer({
                  ...editedCustomer,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="edit-city">Cidade</Label>
              <Input
                id="edit-city"
                value={editedCustomer.city || ""}
                onChange={(e) =>
                  setEditedCustomer({ ...editedCustomer, city: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-state">Estado</Label>
              <Input
                id="edit-state"
                value={editedCustomer.state || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    state: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-postal-code">CEP</Label>
              <Input
                id="edit-postal-code"
                value={editedCustomer.postal_code || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    postal_code: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea
              id="edit-notes"
              value={editedCustomer.notes || ""}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, notes: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateCustomer}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
