// src/components/settings/permissions-table.tsx
"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Permission } from "@/services/auth/permission-schema"; // Certifique-se que o import está correto
import { routes } from "@/config/routes";
import { DataTable } from "@/components/common/table/data-table"; // Importe seu novo componente DataTable
import { Icon } from "@iconify/react"; // Para os ícones nos botões de ação do dropdown
import { Button } from "@/components/ui/button";
import {
  DataTableRowActions,
  RowAction,
} from "@/components/common/table/data-table-row-action";

interface PermissionsTableProps {
  permissions: Permission[];
  onConfirmDelete: (permission: Permission) => void;
}

export function PermissionsTable({
  permissions,
  onConfirmDelete,
}: PermissionsTableProps) {
  const router = useRouter();

  const viewPermissionDetails = (id: number) => {
    // Ajuste o caminho se a rota for diferente para visualizar uma permissão específica
    router.push(`${routes.settings.permissions}/${id}`);
  };

  const editPermission = (id: number) => {
    // Ajuste o caminho se a rota for diferente para editar uma permissão específica
    router.push(`${routes.settings.permissions}/${id}/edit`);
  };

  // 1. Defina as colunas para a sua tabela de permissões
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "module", // Campo de dados no seu objeto Permission
      header: (
        { column } // Cabeçalho com ordenação
      ) => (
        <Button
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
          className="p-0 h-auto"
        >
          Módulo
          <Icon
            icon={
              column.getIsSorted() === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"
            }
            className={
              column.getIsSorted() ? "ml-1 h-3 w-3" : "ml-1 h-3 w-3 opacity-0"
            }
          />
        </Button>
      ),
      cell: ({ row }) => row.original.module,
    },
    {
      accessorKey: "permission", // Campo de dados
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
          className="p-0 h-auto"
        >
          Permissão
          <Icon
            icon={
              column.getIsSorted() === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"
            }
            className={
              column.getIsSorted() ? "ml-1 h-3 w-3" : "ml-1 h-3 w-3 opacity-0"
            }
          />
        </Button>
      ),
      cell: ({ row }) => row.original.permission,
    },
    {
      accessorKey: "description", // Campo de dados
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
          className="p-0 h-auto"
        >
          Descrição
          <Icon
            icon={
              column.getIsSorted() === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"
            }
            className={
              column.getIsSorted() ? "ml-1 h-3 w-3" : "ml-1 h-3 w-3 opacity-0"
            }
          />
        </Button>
      ),
      cell: ({ row }) => row.original.description,
    },
    {
      id: "actions", // ID da coluna de ações
      header: "Ações", // Cabeçalho
      enableHiding: false, // Não permite esconder essa coluna
      cell: ({ row }) => {
        const perm = row.original; // Obtém o objeto Permission da linha

        const actions: RowAction[] = [
          {
            label: "Visualizar",
            onClick: () => viewPermissionDetails(perm.ID),
            icon: "mdi:eye",
            permission: "permissions.view", // Permissão para visualizar a permissão
          },
          {
            label: "Editar",
            onClick: () => editPermission(perm.ID),
            icon: "mdi:pencil",
            permission: "permissions.edit", // Permissão para editar a permissão
          },
          {
            label: "Excluir",
            onClick: () => onConfirmDelete(perm),
            icon: "mdi:trash-can",
            variant: "destructive",
            permission: "permissions.delete", // Permissão para excluir a permissão
          },
        ];

        return <DataTableRowActions actions={actions} />;
      },
    },
  ];

  return (
    // Renderiza o componente DataTable genérico
    <DataTable columns={columns} data={permissions} />
  );
}
