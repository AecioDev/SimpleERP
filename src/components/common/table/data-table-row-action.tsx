"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export interface RowAction {
  label: string;
  onClick: () => void;
  icon?: string;
  variant?: "default" | "destructive"; // Para aplicar estilos como o "text-destructive"
  permission?: string; // Opcional: permissão necessária para exibir o item de menu
}

interface DataTableRowActionsProps {
  actions: RowAction[];
  // Opcional: Se você quiser passar o item de dados original (cliente, usuário, etc.)
  // por exemplo, se alguma ação precisar de mais do que apenas o ID.
  // dataItem?: any;
}

export function DataTableRowActions({ actions }: DataTableRowActionsProps) {
  // TODO: Adicionar lógica para verificar permissões aqui, se 'permission' for usado
  // import { useRequirePermission } from "@/hooks/use-require-permission";
  // const { hasPermission } = useRequirePermission(); // Exemplo de uso

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          {/* Ícone de três pontos para o botão de trigger */}
          <Icon icon="mdi:dots-horizontal" className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, index) => (
          // Você pode adicionar uma checagem de permissão aqui se quiser:
          // {action.permission && !hasPermission(action.permission) ? null : (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={
              action.variant === "destructive" ? "text-destructive" : ""
            }
          >
            {/* Renderiza o ícone do Iconify se fornecido */}
            {action.icon && (
              <Icon icon={action.icon} className="mr-2 h-4 w-4" />
            )}
            {action.label}
          </DropdownMenuItem>
          // )}
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
