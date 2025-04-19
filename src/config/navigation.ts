import { BarChart3, Users, ShoppingCart, Package, Wallet } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  requiredRole?: string[];
  children?: NavItem[]; // Para submenus
}

export const systemNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    requiredRole: ["ADMIN", "Vendas", "Gerente"],
    children: [
      {
        title: "Cadastros",
        icon: Users,
        children: [
          {
            title: "Clientes",
            href: "/vendas/cadastros/clientes",
            icon: Users,
          },
          {
            title: "Planos de Pagamento",
            href: "/vendas/cadastros/planos-pagamento",
            icon: Users,
          },
        ],
      },
      {
        title: "Pedidos",
        href: "/vendas/pedidos",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Estoque",
    href: "/estoque",
    icon: Package,
    requiredRole: ["ADMIN", "Estoque", "Gerente"],
    children: [
      {
        title: "Cadastros",
        icon: Users,
        children: [
          {
            title: "Produtos",
            href: "/estoque/cadastros/produtos",
            icon: Users,
          },
          {
            title: "Códigos por Fornecedor",
            href: "/estoque/cadastros/codigos-fornecedor",
            icon: Users,
          },
          {
            title: "Locais de Estoque",
            href: "/estoque/cadastros/locais",
            icon: Users,
          },
          {
            title: "Localização de Produtos",
            href: "/estoque/cadastros/localizacao",
            icon: Users,
          },
          {
            title: "Preços e Promoções",
            href: "/estoque/cadastros/precos-promocoes",
            icon: Users,
          },
          {
            title: "Tributação",
            href: "/estoque/cadastros/tributacao",
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    requiredRole: ["ADMIN", "Financeiro", "Gerente"],
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
    requiredRole: ["ADMIN"],
  },
];
