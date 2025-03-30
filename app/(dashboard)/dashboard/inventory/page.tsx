"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Package, Plus, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import ProductService from "@/services/product-service"
import InventoryService from "@/services/inventory-service"
import { ProductsList } from "@/components/inventory/products-list"
import { InventoryMovementsList } from "@/components/inventory/movements-list"
import { LowStockAlert } from "@/components/inventory/low-stock-alert"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("products")
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<{
    totalProducts: number
    totalStock: number
    lowStockCount: number
    outOfStockCount: number
    totalValue: number
  } | null>(null)
  const [lowStockProducts, setLowStockProducts] = useState([])

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Verificar permissões
  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "Estoque" && user.role !== "Gerente") {
      router.push("/dashboard")
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o módulo de estoque.",
      })
    }
  }, [user, router, toast])

  // Carregar dados do estoque
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setIsLoading(true)

        const [summaryData, lowStockData] = await Promise.all([
          InventoryService.getInventorySummary(),
          ProductService.getLowStockProducts(),
        ])

        setSummary(summaryData)
        setLowStockProducts(lowStockData)
      } catch (error) {
        console.error("Erro ao carregar dados do estoque:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do estoque.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "Estoque" || user.role === "Gerente")) {
      loadInventoryData()
    }
  }, [user, toast])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">Gerencie o estoque de produtos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/inventory/movements/new")}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Entrada
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/inventory/movements/new?type=saida")}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Saída
          </Button>
          <Button onClick={() => router.push("/dashboard/inventory/products/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      {lowStockProducts.length > 0 && <LowStockAlert products={lowStockProducts} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalStock || 0}</div>
            <p className="text-xs text-muted-foreground">Total de itens em estoque</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground">Produtos com estoque baixo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalValue || 0)}</div>
            <p className="text-xs text-muted-foreground">Valor total do estoque</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Gerencie todos os produtos do estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsList showFilters={true} showPagination={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações de Estoque</CardTitle>
              <CardDescription>Histórico de entradas, saídas e ajustes de estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryMovementsList showFilters={true} showPagination={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Produtos</CardTitle>
              <CardDescription>Gerencie as categorias de produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/dashboard/inventory/categories/new")} className="mb-4">
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>

              {/* Aqui entraria o componente de lista de categorias */}
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Categoria Pai</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        Carregando categorias...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

