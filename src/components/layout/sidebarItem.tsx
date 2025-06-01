// components/layout/sidebarItem.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from "lucide-react";

// MUDANÇA 1: Importar a interface NavItem do navigation.ts
// É crucial que esta interface esteja sincronizada com config/navigation.ts
import { NavItem } from "@/config/navigation";

interface SidebarItemProps {
  item: NavItem;
  collapsed?: boolean;
  // level?: number; // Opcional: para controlar indentação ou estilos de nível
}

export function SidebarItem({
  item,
  collapsed /*, level = 0*/,
}: SidebarItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // Estado para submenu expandido/colapsado
  const [popoverOpen, setPopoverOpen] = useState(false); // Estado para Popover (quando sidebar está colapsado)

  // Verifica se o item de navegação está ativo
  const isActive = (href?: string) =>
    href && (pathname === href || pathname.startsWith(`${href}/`));

  // Lógica para alternar a abertura do submenu
  const toggleOpen = () => setOpen((prev) => !prev);

  // Se o item tem filhos, ele é um item de menu pai (com submenu)
  if (item.children && item.children.length > 0) {
    // Opção 1: Sidebar colapsado - Usar Popover para mostrar submenus
    if (collapsed) {
      return (
        <li key={item.title}>
          {" "}
          {/* Adiciona um li para a lista */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              {/* Botão principal para o Popover quando colapsado */}
              <Button
                variant={
                  isActive(item.href) || popoverOpen ? "secondary" : "ghost"
                } // Ativar se o próprio item for ativo ou popover estiver aberto
                className="w-full justify-center px-0" // Centraliza o ícone
              >
                {item.icon && <item.icon className="h-5 w-5 mx-auto" />}
                <span className="sr-only">{item.title}</span>{" "}
                {/* Texto para acessibilidade */}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start" // Alinha ao início para evitar sobreposição
              className="w-48 p-2"
              onMouseLeave={() => setPopoverOpen(false)} // Fecha ao sair do popover
            >
              {/* MUDANÇA CRUCIAL AQUI: Recursividade para filhos */}
              {item.children.map((childItem) => (
                <SidebarItem
                  key={childItem.title}
                  item={childItem}
                  collapsed={false} // Filhos não são colapsados dentro do popover
                  // level={level + 1} // Opcional
                />
              ))}
            </PopoverContent>
          </Popover>
        </li>
      );
    }
    // Opção 2: Sidebar expandido - Usar expansão normal de submenu
    else {
      return (
        <li key={item.title}>
          {" "}
          {/* Adiciona um li para a lista */}
          <Button
            variant={isActive(item.href) || open ? "secondary" : "ghost"} // Ativar se o próprio item for ativo ou submenu estiver aberto
            onClick={toggleOpen}
            className="w-full justify-start pr-2" // Ajusta padding para o ícone de seta
          >
            {item.icon && <item.icon className="h-5 w-5 mr-2" />}
            <span className="flex-1 text-left">{item.title}</span>
            {open ? (
              <ChevronDown className="ml-auto h-4 w-4 transition-transform rotate-180" />
            ) : (
              <ChevronDown className="ml-auto h-4 w-4 transition-transform rotate-0" />
            )}
          </Button>
          {/* Renderiza os submenus se estiverem abertos */}
          {open && (
            <ul
              className={cn("mt-1 space-y-1", item.children ? "ml-4" : "ml-0")}
            >
              {" "}
              {/* Ajusta indentação */}
              {/* MUDANÇA CRUCIAL AQUI: Recursividade para filhos */}
              {item.children.map((childItem) => (
                <SidebarItem
                  key={childItem.title}
                  item={childItem}
                  collapsed={false} // Submenus não são colapsados dentro do pai expandido
                  // level={level + 1} // Opcional
                />
              ))}
            </ul>
          )}
        </li>
      );
    }
  }

  // Se o item NÃO tem filhos, ele é um item de menu folha (final)
  // Adiciona um li para a lista
  return (
    <li key={item.title}>
      <Link href={item.href || "#"}>
        {" "}
        {/* Use "#" ou rota de fallback se href for opcional */}
        <Button
          variant={isActive(item.href) ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            collapsed ? "px-0 justify-center" : "pl-2" // Ajuste o padding para o Link/Botão final
            // level > 0 && !collapsed && `pl-${level * 4}` // Opcional: para indentação baseada no nível
          )}
        >
          {item.icon && (
            <item.icon
              className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")}
            />
          )}
          {!collapsed && <span>{item.title}</span>}
        </Button>
      </Link>
    </li>
  );
}
