"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import ProductService, { type Product } from "@/services/product-service"
import InventoryService, { type CreateMovementDto } from "@/services/inventory-service"

export default function NewMovementPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [movement, setMovement] = useState<CreateMovementDto>({
    product_id: 0,
    quantity: 1,
    movement_type: "entrada",
    notes: "",
  })

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar tipo de movimento nos parâmetros da URL
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "saida") {
      setMovement((prev) => ({ ...prev, movement_type: "saida" }))
    } else if (type === "ajuste") {
      setMovement((prev) => ({ ...prev, movement_type: "ajuste" }))
    }
  }, [searchParams])

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

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const response = await ProductService.getProducts(1, 100, { is_active: true })
        setProducts(response.data)

        // Definir o primeiro produto como padrão se existir
        if (response.data.length > 0) {
          setMovement((prev) => ({ ...prev, product_id: response.data[0].id }))
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de produtos.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "Estoque" || user.role === "Gerente")) {
      loadProducts()
    }
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!movement.product_id || !movement.quantity) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar movimentação",
        description: "Preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      setIsSaving(true)
      await InventoryService.createMovement(movement)

      toast({
        title: "Movimentação registrada",
        description: "A movimentação de estoque foi registrada com sucesso.",
      })

      router.push("/dashboard/inventory")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar movimentação",
        description: error.response?.data?.message || "Ocorreu um erro ao registrar a movimentação.",
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
        <h1 className="text-3xl font-bold">
          {movement.movement_type === "entrada"
            ? "Nova Entrada"
            : movement.movement_type === "saida"
              ? "Nova Saída"
              : "Novo Ajuste"}{" "}
          de Estoque
        </h1>
        <p className="text-muted-foreground">
          Registre uma{" "}
          {movement.movement_type === "entrada" ? "entrada" : movement.movement_type === "saida" ? "saída" : "ajuste"}{" "}
          de produtos no estoque
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes da Movimentação</CardTitle>
            <CardDescription>Preencha os detalhes da movimentação de estoque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="movement_type">Tipo de Movimentação</Label>
                <Select
                  value={movement.movement_type}
                  onValueChange={(value: "entrada" | "saida" | "ajuste") =>
                    setMovement({ ...movement, movement_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                    <SelectItem value="ajuste">Ajuste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select
                  value={movement.product_id.toString()}
                  onValueChange={(value) => setMovement({ ...movement, product_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={movement.movement_type === "saida" ? 1 : 0}
                  value={movement.quantity}
                  onChange={(e) => setMovement({ ...movement, quantity: Number.parseInt(e.target.value) })}
                  placeholder="Quantidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={movement.notes || ""}
                onChange={(e) => setMovement({ ...movement, notes: e.target.value })}
                placeholder="Observações sobre a movimentação"
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
                "Registrar Movimentação"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

