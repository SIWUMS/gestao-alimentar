"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, Package, DollarSign, AlertTriangle, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const consumoData = [
  { dia: "Seg", creche: 120, fundamental: 280 },
  { dia: "Ter", creche: 115, fundamental: 275 },
  { dia: "Qua", creche: 125, fundamental: 290 },
  { dia: "Qui", creche: 118, fundamental: 285 },
  { dia: "Sex", creche: 122, fundamental: 288 },
]

const custoData = [
  { mes: "Jan", custo: 15000 },
  { mes: "Fev", custo: 16200 },
  { mes: "Mar", custo: 15800 },
  { mes: "Abr", custo: 17100 },
  { mes: "Mai", custo: 16500 },
]

const estoqueData = [
  { name: "Arroz", value: 85, color: "#22c55e" },
  { name: "Feijão", value: 45, color: "#f59e0b" },
  { name: "Carne", value: 25, color: "#ef4444" },
  { name: "Verduras", value: 70, color: "#3b82f6" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de gestão alimentar escolar</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">8 itens com estoque baixo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 16.500</div>
            <p className="text-xs text-muted-foreground">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Itens precisam de atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Consumo Semanal por Faixa Etária</CardTitle>
            <CardDescription>Número de refeições servidas por dia</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                creche: {
                  label: "Creche",
                  color: "#22c55e",
                },
                fundamental: {
                  label: "Fundamental",
                  color: "#3b82f6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="creche" fill="#22c55e" />
                  <Bar dataKey="fundamental" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status do Estoque</CardTitle>
            <CardDescription>Níveis atuais dos principais itens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estoqueData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                  {item.value < 30 && (
                    <Badge variant="destructive" className="text-xs">
                      Estoque Baixo
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Custos</CardTitle>
            <CardDescription>Custos mensais dos últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                custo: {
                  label: "Custo (R$)",
                  color: "#f59e0b",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={custoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="custo" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Estoque de Carne Baixo</p>
                  <p className="text-xs text-muted-foreground">Apenas 25% do estoque disponível</p>
                </div>
                <Badge variant="destructive">Urgente</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Cardápio Pendente</p>
                  <p className="text-xs text-muted-foreground">Cardápio da próxima semana precisa de aprovação</p>
                </div>
                <Badge variant="secondary">Pendente</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Relatório Mensal</p>
                  <p className="text-xs text-muted-foreground">Relatório nutricional disponível para download</p>
                </div>
                <Badge variant="outline">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
