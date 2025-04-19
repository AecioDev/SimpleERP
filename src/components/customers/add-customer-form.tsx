"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus } from "lucide-react";
import CustomerService, {
  type CreateCustomerDto,
} from "@/services/customer/customer-service";

interface AddCustomerFormProps {
  onCustomerAdded: (customer: any) => void;
}

export function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CreateCustomerDto>({
    name: "",
    email: "",
    phone: "",
    document: "",
    document_type: "cpf",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    notes: "",
  });
  const { toast } = useToast();

  const resetForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      document: "",
      document_type: "cpf",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      notes: "",
    });
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cliente",
        description: "O nome do cliente é obrigatório",
      });
      return;
    }

    try {
      const createdCustomer = await CustomerService.createCustomer(newCustomer);

      toast({
        title: "Cliente adicionado",
        description: `O cliente ${createdCustomer.name} foi adicionado com sucesso`,
      });

      onCustomerAdded(createdCustomer);
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cliente",
        description:
          error.response?.data?.message ||
          "Ocorreu um erro ao adicionar o cliente",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo cliente
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
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
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="document_type">Tipo de Documento</Label>
              <Select
                value={newCustomer.document_type}
                onValueChange={(value: "cpf" | "cnpj") =>
                  setNewCustomer({ ...newCustomer, document_type: value })
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
                value={newCustomer.document}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, document: e.target.value })
                }
                placeholder={
                  newCustomer.document_type === "cpf"
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
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
              placeholder="Rua, número, complemento"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={newCustomer.city}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, city: e.target.value })
                }
                placeholder="Cidade"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={newCustomer.state}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, state: e.target.value })
                }
                placeholder="Estado"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                value={newCustomer.postal_code}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
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
              value={newCustomer.notes}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, notes: e.target.value })
              }
              placeholder="Observações sobre o cliente"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddCustomer}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
