// src/config/navigation.ts
import {
  Users,
  ShoppingCart,
  Package,
  Wallet,
  Home,
  Archive, // Exemplo para Estoque/Inventory Setup
  Truck, // Exemplo para Fornecedores/Suppliers
  Briefcase, // Exemplo para Compras/Purchases ou Gerencial
  Settings, // Exemplo para Configurações ou Setup geral
  ClipboardList, // Exemplo para Pedidos/Ordens
  ArrowRightLeft, // Exemplo para Movimentações de Estoque
  ArrowDownToLine, // Exemplo para Entradas de Estoque
  ArrowUpFromLine, // Exemplo para Saídas de Estoque
  SlidersHorizontal, // Exemplo para Ajustes de Estoque
  Receipt, // Exemplo para Contas a Receber
  Landmark, // Exemplo para Contas a Pagar
} from "lucide-react";
import { routes } from "./routes"; // Agora importa o routes.ts com chaves e caminhos em inglês

export interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  requiredRoles?: string[];
  requiredPermission?: string;
  children?: NavItem[];
}

export const systemNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: routes.dashboards.root,
    icon: Home,
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    requiredRoles: ["ADMIN", "VENDAS", "GERENTE"], // Use nomes de roles em inglês se padronizar
    children: [
      {
        title: "Pedidos",
        href: routes.sales.orders.root,
        icon: ClipboardList,
        // requiredPermission: "orders.view",
      },
      {
        title: "Cadastros",
        icon: Settings,
        children: [
          {
            title: "Clientes",
            href: routes.customers.root,
            icon: Users,
            // requiredPermission: "customers.view",
          },
        ],
      },
    ],
  },
  {
    title: "Compras",
    icon: Briefcase,
    requiredRoles: ["ADMIN", "COMPRAS", "GERENTE"],
    children: [
      {
        title: "Pedidos de Compras",
        href: routes.purchases.orders.root,
        icon: ClipboardList,
        // requiredPermission: "purchase_orders.view",
      },
      {
        title: "Cadastros",
        icon: Settings,
        children: [
          {
            title: "Fornecedores",
            href: routes.suppliers.root,
            icon: Truck,
            // requiredPermission: "suppliers.view",
          },
        ],
      },
    ],
  },
  {
    title: "Estoque",
    icon: Package,
    requiredRoles: ["ADMIN", "ESTOQUE", "GERENTE"],
    children: [
      {
        title: "Produtos",
        href: routes.products.root, // Link para a entidade central de Produtos
        icon: Archive,
        // requiredPermission: "products.view",
      },
      {
        title: "Movimentação", // Anteriormente "Movimentação" - agora é um item pai
        icon: ArrowRightLeft, // Ícone para o grupo de movimentações
        // href: routes.inventory.movements.root, // Opcional: se /inventory/movements for uma página clicável
        // // requiredPermission: "inventory.movements.view_all", // Permissão para ver a visão geral ou o grupo
        children: [
          // Sub-itens para os tipos de movimentação
          {
            title: "Notas de Entrada",
            href: routes.inventory.movements.inbound,
            icon: ArrowDownToLine,
            // requiredPermission: "inventory.movements.inbound.view", // Exemplo de permissão
          },
          {
            title: "Notas de Saídas",
            href: routes.inventory.movements.outbound,
            icon: ArrowUpFromLine,
            // requiredPermission: "inventory.movements.outbound.view",
          },
          {
            title: "Ajuste de Estoque",
            href: routes.inventory.movements.adjustments,
            icon: SlidersHorizontal,
            // requiredPermission: "inventory.movements.adjustments.view",
          },
        ],
      },
      {
        title: "Níveis de Estoque",
        href: routes.inventory.stockLevels,
        icon: Package,
        // requiredPermission: "inventory.stock_levels.view",
      },
      {
        title: "Cadastro",
        icon: Settings,
        children: [
          {
            title: "Locations",
            href: routes.inventory.setup.locations,
            icon: Archive,
            // requiredPermission: "stock_locations.view",
          },
        ],
      },
    ],
  },
  {
    title: "Financeiro",
    icon: Wallet,
    requiredRoles: ["ADMIN", "FINANCEIRO", "GERENTE"],
    children: [
      {
        title: "Dashboard Financeiro",
        href: routes.dashboards.financial,
        icon: Home,
        // requiredPermission: "dashboard.financial.view",
      },
      {
        title: "Contas a Receber",
        href: routes.financial.accountsReceivable,
        icon: Receipt,
        // requiredPermission: "financial.accounts_receivable.view_module",
        children: [
          {
            title: "Clientes",
            href: routes.customers.root,
            icon: Users,
            // requiredPermission: "customers.view",
          },
          // Você pode adicionar outros itens específicos de Contas a Receber aqui, por exemplo:
          // {
          //   title: "Invoices",
          //   href: routes.financial.accountsReceivable.invoices, // Supondo que essa rota exista
          //   icon: ClipboardList,
          //   // requiredPermission: "financial.invoices.view",
          // },
          // {
          //   title: "Receipts / Boletos",
          //   href: routes.financial.accountsReceivable.boletos, // Usando a rota de boletos
          //   icon: Receipt, // Ou um ícone específico para boletos
          //   // requiredPermission: "financial.receipts.view",
          // },
        ],
      },
      {
        title: "Contas a Pagar",
        href: routes.financial.accountsPayable,
        icon: Landmark,
        // requiredPermission: "financial.accounts_payable.view_module",
        children: [
          {
            title: "Fornecedores",
            href: routes.suppliers.root,
            icon: Truck,
            // requiredPermission: "suppliers.view",
          },
          // Você pode adicionar outros itens específicos de Contas a Pagar aqui, por exemplo:
          // {
          //   title: "Bills",
          //   href: routes.financial.accountsPayable.bills, // Supondo que essa rota exista
          //   icon: ClipboardList,
          //   // requiredPermission: "financial.bills.view",
          // },
        ],
      },
      // O link direto para "Customers" que existia antes sob "Financial" foi removido,
      // pois agora está aninhado dentro de "Accounts Receivable".
      // Você pode adicionar outras seções principais do financeiro aqui, como:
      // {
      //   title: "Cash Flow",
      //   href: routes.financial.cashFlow, // Supondo que essa rota exista
      //   icon: BarChart3, // Exemplo
      //   // requiredPermission: "financial.cashflow.view",
      // },
    ],
  },
  {
    title: "Users", // Usuários
    href: routes.users.root,
    icon: Users,
    requiredRoles: ["ADMIN"],
  },
];

// --- OPÇÕES PARA O DASHBOARD SWITCHER (Header) ---
export interface DashboardOption {
  title: string;
  href: string;
  // requiredPermission: string;
}

export const dashboardOptions: DashboardOption[] = [
  {
    title: "My Dashboard", // Meu Dashboard
    href: routes.dashboards.general, // Aponta para o dashboard geral/padrão
    // requiredPermission: "dashboard.view_default", // Ou dashboard.general.view
  },
  {
    title: "Admin Dashboard",
    href: routes.dashboards.admin,
    // requiredPermission: "dashboard.admin.view",
  },
  {
    title: "Purchase Dashboard", // Dashboard Compras
    href: routes.dashboards.purchase,
    // requiredPermission: "dashboard.purchase.view", // Ajustado para purchase
  },
  {
    title: "Inventory Dashboard", // Dashboard Estoque
    href: routes.dashboards.inventory,
    // requiredPermission: "dashboard.inventory.view",
  },
  {
    title: "Sales Dashboard", // Dashboard Vendas
    href: routes.dashboards.sales,
    // requiredPermission: "dashboard.sales.view",
  },
  {
    title: "Financial Dashboard", // Dashboard Financeiro
    href: routes.dashboards.financial,
    // requiredPermission: "dashboard.financial.view", // Ajustado para financial
  },
  {
    title: "Manager Dashboard", // Dashboard Gerencial
    href: routes.dashboards.manager,
    // requiredPermission: "dashboard.manager.view",
  },
];
