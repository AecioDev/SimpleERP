// routes.ts
export const routes = {
  dashboards: {
    admin: "/dashboard/admin",
    vendas: "/dashboard/vendas",
    financeiro: "/dashboard/financeiro",
  },

  vendas: {
    root: "/vendas",
    cadastros: {
      root: "/vendas/cadastros",
      clientes: "/vendas/cadastros/clientes",
      createCliente: "/vendas/cadastros/clientes/create",
      planosPagamento: "/vendas/cadastros/planos-pagamento",
    },
    pedidos: "/vendas/pedidos",
  },

  estoque: {
    root: "/estoque",
    cadastros: {
      root: "/estoque/cadastros",
      produtos: "/estoque/cadastros/produtos",
      codigosFornecedor: "/estoque/cadastros/codigos-fornecedor",
      locais: "/estoque/cadastros/locais",
      localizacao: "/estoque/cadastros/localizacao",
      precosPromocoes: "/estoque/cadastros/precos-promocoes",
      tributacao: "/estoque/cadastros/tributacao",
    },
  },

  financeiro: "/financeiro",
  usuarios: "/usuarios",
};
