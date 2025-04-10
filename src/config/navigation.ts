import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Wallet,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: string[];
}

export const systemNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    href: "/users",
    icon: Users,
    requiredRole: ["ADMIN"],
  },
  {
    title: "Vendas",
    href: "/sales",
    icon: ShoppingCart,
    requiredRole: ["ADMIN", "Vendas", "Gerente"],
  },
  {
    title: "Estoque",
    href: "/inventory",
    icon: Package,
    requiredRole: ["ADMIN", "Estoque", "Gerente"],
  },
  {
    title: "Financeiro",
    href: "/finance",
    icon: Wallet,
    requiredRole: ["ADMIN", "Financeiro", "Gerente"],
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    requiredRole: ["ADMIN"],
  },
];
