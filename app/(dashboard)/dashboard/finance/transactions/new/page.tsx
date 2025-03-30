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
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import FinancialService, { type CreateTransactionDto } from "@/services/financial-service"
import PaymentMethodService, { type PaymentMethod } from "@/services/payment-method-service"

export default function NewTransactionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transaction, setTransaction] = useState<CreateTransactionDto>({
    transaction_type: "receita",
    amount: 0,
    description: "",
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    payment_method_id: 0,
    status: "pendente",
  })
  const [transactionDate, setTransactionDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined)

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Verificar permissões
  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "Financeiro" && user.role !== "Gerente") {
      router.push("/dashboard")
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o módulo financeiro.",
      })
    }
  }, [user, router, toast])

  // Carregar métodos de pagamento
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setIsLoading(true)
        const methods = await PaymentMethodService.getPaymentMethods()
        setPaymentMethods(methods)

        // Definir o primeiro método como padrão se existir
        if (methods.length > 0) {
          setTransaction((prev) => ({ ...prev, payment_method_id: methods[0].id }))
        }
      } catch (error) {
        console.error("Erro ao carregar métodos de pagamento:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os métodos de pagamento.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "Financeiro" || user.role === "Gerente")) {
      loadPaymentMethods()
    }
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transaction.description || !transaction.amount || !transaction.payment_method_id) {
      toast({
        variant: "destructive",
        title: "Erro ao criar transação",
        description: "Preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      setIsSaving(true)

      // Formatar datas
      const formattedTransaction = {
        ...transaction,
        transaction_date: format(transactionDate, "yyyy-MM-dd"),
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
        payment_date: paymentDate ? format(paymentDate, "yyyy-MM-dd") : undefined,
      }

      await FinancialService.createTransaction(formattedTransaction)

      toast({
        title: "Transação criada",
        description: "A transação foi criada com sucesso.",
      })

      router.push("/dashboard/finance")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar transação",
        description: error.response?.data?.message || "Ocorreu um erro ao criar a transação.",
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
        <h1 className="text-3xl font-bold">Nova Transação</h1>
        <p className="text-muted-foreground">Registre uma nova transação financeira</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes da Transação</CardTitle>
            <CardDescription>Preencha os detalhes da transação financeira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transaction_type">Tipo de Transação</Label>
                <Select
                  value={transaction.transaction_type}
                  onValueChange={(value: "receita" | "despesa") =>
                    setTransaction({ ...transaction, transaction_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={transaction.amount || ""}
                  onChange={(e) => setTransaction({ ...transaction, amount: Number.parseFloat(e.target.value) })}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_date">Data da Transação</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionDate ? (
                        format(transactionDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={(date) => setTransactionDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Método de Pagamento</Label>
                <Select
                  value={transaction.payment_method_id.toString()}
                  onValueChange={(value) =>
                    setTransaction({ ...transaction, payment_method_id: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={transaction.status}
                  onValueChange={(value: "pendente" | "pago" | "cancelado") =>
                    setTransaction({ ...transaction, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Data de Vencimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {transaction.status === "pago" && (
                <div className="space-y-2">
                  <Label htmlFor="payment_date">Data de Pagamento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={transaction.description}
                onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                placeholder="Descreva a transação"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/finance")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Transação"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

