"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Eye, MoreHorizontal, Trash2, Loader2 } from "lucide-react";

import CustomerService, {
  type Customer,
} from "@/services/customer/customer-service";
import { DeleteCustomerDialog } from "src/components/customers/delete-customer-dialog";

interface CustomersListProps {
  onEdit: (customer: Customer) => void;
}

export function CustomersList({ onEdit }: CustomersListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchName, setSearchName] = useState("");
  const [searchDocument, setSearchDocument] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const filters: { name?: string; document?: string } = {};

        if (searchName) filters.name = searchName;
        if (searchDocument) filters.document = searchDocument;

        const response = await CustomerService.getCustomers(
          currentPage,
          10,
          filters
        );
        setCustomers(response.data);
        setTotalPages(Math.ceil(response.pagination.totalPages / 10));
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de clientes.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, searchName, searchDocument, toast]);

  const handleSearch = () => setCurrentPage(1);
  const confirmDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      await CustomerService.deleteCustomer(selectedCustomer.id);
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));

      toast({
        title: "Cliente excluído",
        description: `O cliente foi excluído com sucesso`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description:
          error.response?.data?.message || "Erro ao excluir cliente.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const viewCustomerDetails = (id: number) => {
    router.push(`/sales/customers/${id}`);
  };

  const renderCell = (value?: string | null) => value || "-";

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="search-name">Buscar por nome</Label>
          <Input
            id="search-name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="search-document">Buscar por documento</Label>
          <Input
            id="search-document"
            value={searchDocument}
            onChange={(e) => setSearchDocument(e.target.value)}
            placeholder="CPF ou CNPJ"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleSearch} className="mb-0.5">
            Buscar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left font-medium">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Cidade/UF</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const phone = customer.contacts
                  ? customer.contacts.find((c) => c.type === "phone")?.contact
                  : "-";
                const email = customer.contacts
                  ? customer.contacts.find((c) => c.type === "email")?.contact
                  : "-";
                const address = customer.addresses
                  ? customer.addresses[0]
                  : "-";
                //const city =  address?.city ? address?.city.name || "-";
                //const state = address?.city.state.name || "-";

                return (
                  <tr key={customer.id} className="border-b">
                    <td className="px-4 py-3">{customer.first_name}</td>
                    <td className="px-4 py-3">
                      {customer.document_number ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {customer.person_type === "cpf" ? "CPF" : "CNPJ"}:{" "}
                          {customer.document_number}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{phone}</td>
                    <td className="px-4 py-3">{email}</td>
                    <td className="px-4 py-3">
                      {/*city !== "-" && state !== "-" ? `${city}/${state}` : "-"*/}{" "}
                      Cidade / UF
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => viewCustomerDetails(customer.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(customer)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Diálogo de exclusão */}
      <DeleteCustomerDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        customerName={selectedCustomer?.first_name || ""}
        onConfirm={handleDeleteCustomer}
      />
    </>
  );
}
