"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import ProductService, { type CreateProductDto } from "@/services/product-service"
import CategoryService, { type Category } from "@/services/category-service"
import UnitService, { type Unit } from "@/services/unit-service"

export default function NewProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [product, setProduct] = useState<CreateProductDto>({
    sku: "",
    name: "",
    category_id: 0,
    unit_id: 0,
    cost_price: 0,
    selling_price: 0,
    min_stock: 0,
    current_stock: 0,
  })

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

  // Carregar categorias e unidades
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, unitsData] = await Promise.all([CategoryService.getCategories(), UnitService.getUnits()])

        setCategories(categoriesData)
        setUnits(unitsData)

        // Definir valores padrão se existirem
        if (categoriesData.length > 0) {
          setProduct((prev) => ({ ...prev, category_id: categoriesData[0].id }))
        }
        if (unitsData.length > 0) {
          setProduct((prev) => ({ ...prev, unit_id: unitsData[0].id }))
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as categorias e unidades.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "Estoque" || user.role === "Gerente")) {
      loadData()
    }
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product.name || !product.sku || !product.category_id || !product.unit_id) {
      toast({
        variant: "destructive",
        title: "Erro ao criar produto",
        description: "Preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      setIsSaving(true)
      await ProductService.createProduct(product)

      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso.",
      })

      router.push("/dashboard/inventory")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar produto",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o produto.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="text-muted-foreground">Cadastre um novo produto no estoque</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes do Produto</CardTitle>
            <CardDescription>Preencha os detalhes do produto a ser cadastrado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">Código (SKU)</Label>
                <Input
                  id="sku"
                  value={product.sku}
                  onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  placeholder="Código único do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras (opcional)</Label>
                <Input
                  id="barcode"
                  value={product.barcode || ""}
                  onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                  placeholder="Código de barras"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={product.category_id.toString()}
                  onValueChange={(value) => setProduct({ ...product, category_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade de Medida</Label>
                <Select
                  value={product.unit_id.toString()}
                  onValueChange={(value) => setProduct({ ...product, unit_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} ({unit.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_price">Preço de Custo</Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.cost_price || ""}
                  onChange={(e) => setProduct({ ...product, cost_price: Number.parseFloat(e.target.value) })}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="selling_price">Preço de Venda</Label>
                <Input
                  id="selling_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.selling_price || ""}
                  onChange={(e) => setProduct({ ...product, selling_price: Number.parseFloat(e.target.value) })}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock">Estoque Mínimo</Label>
                <Input
                  id="min_stock"
                  type="number"
                  min="0"
                  value={product.min_stock || ""}
                  onChange={(e) => setProduct({ ...product, min_stock: Number.parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_stock">Estoque Máximo (opcional)</Label>
                <Input
                  id="max_stock"
                  type="number"
                  min="0"
                  value={product.max_stock || ""}
                  onChange={(e) => setProduct({ ...product, max_stock: Number.parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_stock">Estoque Inicial</Label>
                <Input
                  id="current_stock"
                  type="number"
                  min="0"
                  value={product.current_stock || ""}
                  onChange={(e) => setProduct({ ...product, current_stock: Number.parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={product.description || ""}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/inventory")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Produto"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

