// navigation.ts
import { BarChart3, Users, ShoppingCart, Package, Wallet } from "lucide-react";
import { routes } from "./routes";

export interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  requiredRole?: string[];
  children?: NavItem[];
}

export const systemNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: routes.dashboards.admin, // pode ser dinâmico conforme o perfil
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
            href: routes.vendas.cadastros.clientes,
            icon: Users,
          },
          {
            title: "Planos de Pagamento",
            href: routes.vendas.cadastros.planosPagamento,
            icon: Users,
          },
        ],
      },
      {
        title: "Pedidos",
        href: routes.vendas.pedidos,
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Estoque",
    icon: Package,
    requiredRole: ["ADMIN", "Estoque", "Gerente"],
    children: [
      {
        title: "Cadastros",
        icon: Users,
        children: [
          {
            title: "Produtos",
            href: routes.estoque.cadastros.produtos,
            icon: Users,
          },
          {
            title: "Códigos por Fornecedor",
            href: routes.estoque.cadastros.codigosFornecedor,
            icon: Users,
          },
          {
            title: "Locais de Estoque",
            href: routes.estoque.cadastros.locais,
            icon: Users,
          },
          {
            title: "Localização de Produtos",
            href: routes.estoque.cadastros.localizacao,
            icon: Users,
          },
          {
            title: "Preços e Promoções",
            href: routes.estoque.cadastros.precosPromocoes,
            icon: Users,
          },
          {
            title: "Tributação",
            href: routes.estoque.cadastros.tributacao,
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    title: "Financeiro",
    href: routes.financeiro,
    icon: Wallet,
    requiredRole: ["ADMIN", "Financeiro", "Gerente"],
  },
  {
    title: "Usuários",
    href: routes.usuarios,
    icon: Users,
    requiredRole: ["ADMIN"],
  },
];
