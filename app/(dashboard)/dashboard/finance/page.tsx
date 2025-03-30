"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import FinancialService, {
  type FinancialSummary,
  type CashFlowItem,
} from "@/services/financial-service";
import { FinancialTransactionsList } from "@/components/finance/transactions-list";
import { FinancialSummaryCards } from "@/components/finance/summary-cards";
import { CashFlowChart } from "@/components/finance/cash-flow-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowItem[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30), // 30 dias atrás
    to: new Date(), // Data atual
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Verificar permissões
  useEffect(() => {
    if (
      user &&
      user.role !== "ADMIN" &&
      user.role !== "Financeiro" &&
      user.role !== "Gerente"
    ) {
      router.push("/dashboard");
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o módulo financeiro.",
      });
    }
  }, [user, router, toast]);

  // Carregar dados financeiros
  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        setIsLoading(true);

        const startDate = dateRange.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : "";
        const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

        const [summaryData, cashFlowData] = await Promise.all([
          FinancialService.getSummary(startDate, endDate),
          FinancialService.getCashFlow(startDate, endDate),
        ]);

        setSummary(summaryData);
        setCashFlow(cashFlowData);
      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados financeiros.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (
      user &&
      (user.role === "ADMIN" ||
        user.role === "Financeiro" ||
        user.role === "Gerente")
    ) {
      loadFinancialData();
    }
  }, [user, dateRange, toast]);

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Gerencie as finanças do seu negócio
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/finance/transactions/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <div className="flex justify-end">
        <DateRangePicker
          date={dateRange}
          onDateChange={handleDateRangeChange}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {summary && <FinancialSummaryCards summary={summary} />}

          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>
                Visualize o fluxo de caixa no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CashFlowChart data={cashFlow} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas transações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTransactionsList limit={5} showPagination={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transações Financeiras</CardTitle>
              <CardDescription>
                Gerencie todas as transações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTransactionsList
                showFilters={true}
                showPagination={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Gere relatórios financeiros detalhados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Relatório de Receitas e Despesas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relatório detalhado de receitas e despesas no período
                      selecionado.
                    </p>
                    <Button>Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Relatório de Fluxo de Caixa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relatório detalhado do fluxo de caixa no período
                      selecionado.
                    </p>
                    <Button>Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Relatório de Contas a Pagar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relatório detalhado de contas a pagar no período
                      selecionado.
                    </p>
                    <Button>Gerar Relatório</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Relatório de Contas a Receber
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relatório detalhado de contas a receber no período
                      selecionado.
                    </p>
                    <Button>Gerar Relatório</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
