import { Users, ShoppingCart, Package, Wallet } from "lucide-react";
import { routes } from "./routes"; // Assumindo que routes.ts tem as URLs corretas

export interface NavItem {
  title: string;
  href?: string; // Item pode não ter um link próprio se for apenas um agrupador com 'children'
  icon: React.ElementType;
  requiredRoles?: string[]; // 'requiredRoles' (plural) - lista de nomes de roles permitidas
  requiredPermission?: string; // Permissão específica (ex: "users.create")
  children?: NavItem[];
}

export const systemNavItems: NavItem[] = [
  // AQUI VÃO OS LINKS PRINCIPAIS PARA MÓDULOS, CONTROLADOS POR ROLE
  {
    title: "Vendas",
    icon: ShoppingCart,
    requiredRoles: ["ADMIN", "VENDAS", "GERENTE"], // Usuários com essas roles verão o módulo Vendas
    children: [
      {
        title: "Cadastros",
        icon: Users,
        // Este é um agrupador, não precisa de requiredRoles ou requiredPermission se os filhos tiverem
        children: [
          {
            title: "Clientes",
            href: routes.vendas.cadastros.clientes,
            icon: Users,
            // Acesso granular por PERMISSION. Ex: users.view para ver clientes (se clientes for um tipo de user)
            // ou customers.view se for um módulo de clientes separado.
            requiredPermission: "customers.view", // Permissão para ver clientes
          },
          {
            title: "Planos de Pagamento",
            href: routes.vendas.cadastros.planosPagamento,
            icon: Users,
            requiredPermission: "payment_plans.view", // Permissão para ver planos de pagamento
          },
        ],
      },
      {
        title: "Pedidos",
        href: routes.vendas.pedidos,
        icon: ShoppingCart,
        requiredPermission: "orders.view", // Permissão para ver pedidos de vendas
      },
    ],
  },
  {
    title: "Estoque",
    icon: Package,
    requiredRoles: ["ADMIN", "ESTOQUE", "GERENTE"],
    children: [
      {
        title: "Cadastros",
        icon: Users,
        children: [
          {
            title: "Produtos",
            href: routes.estoque.cadastros.produtos,
            icon: Users,
            requiredPermission: "products.view",
          },
          {
            title: "Códigos por Fornecedor",
            href: routes.estoque.cadastros.codigosFornecedor,
            icon: Users,
            requiredPermission: "supplier_codes.view",
          },
          {
            title: "Locais de Estoque",
            href: routes.estoque.cadastros.locais,
            icon: Users,
            requiredPermission: "stock_locations.view",
          },
          {
            title: "Localização de Produtos",
            href: routes.estoque.cadastros.localizacao,
            icon: Users,
            requiredPermission: "product_location.view",
          },
          {
            title: "Preços e Promoções",
            href: routes.estoque.cadastros.precosPromocoes,
            icon: Users,
            requiredPermission: "prices_promotions.view",
          },
          {
            title: "Tributação",
            href: routes.estoque.cadastros.tributacao,
            icon: Users,
            requiredPermission: "taxation.view",
          },
        ],
      },
    ],
  },
  {
    title: "Financeiro",
    href: routes.financeiro,
    icon: Wallet,
    requiredRoles: ["ADMIN", "FINANCEIRO", "GERENTE"],
  },
  {
    title: "Usuários",
    href: routes.usuarios,
    icon: Users,
    requiredRoles: ["ADMIN"], // Geralmente apenas ADMIN gerencia usuários
  },
  // O link 'Dashboard' genérico (que estará no Header) não precisa estar aqui no menu lateral.
  // Se quiser um link específico para o dashboard padrão do perfil no menu, pode adicionar:
  // {
  //   title: "Meu Dashboard",
  //   href: "/dashboard", // Redirecionará para o específico do perfil
  //   icon: BarChart3,
  // }
];

// MUDANÇA AQUI: Definindo os dashboards disponíveis e suas permissões
export interface DashboardOption {
  title: string;
  href: string;
  requiredPermission: string; // Permissão necessária para ver/acessar este dashboard
}

export const dashboardOptions: DashboardOption[] = [
  {
    title: "Meu Dashboard",
    href: "/dashboard",
    requiredPermission: "dashboard.view_default",
  }, // Dashboard geral do perfil logado
  {
    title: "Dashboard Admin",
    href: "/dashboard/admin",
    requiredPermission: "dashboard.admin.view",
  },
  {
    title: "Dashboard Vendas",
    href: "/dashboard/sales",
    requiredPermission: "dashboard.sales.view",
  },
  {
    title: "Dashboard Financeiro",
    href: "/dashboard/finance",
    requiredPermission: "dashboard.finance.view",
  },
  {
    title: "Dashboard Gerencial",
    href: "/dashboard/manager",
    requiredPermission: "dashboard.manager.view",
  },
];
