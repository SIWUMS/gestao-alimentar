"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"

const consumoSemanalData = [
  { dia: "Seg", creche: 120, fundamental: 280, total: 400 },
  { dia: "Ter", creche: 115, fundamental: 275, total: 390 },
  { dia: "Qua", creche: 125, fundamental: 290, total: 415 },
  { dia: "Qui", creche: 118, fundamental: 285, total: 403 },
  { dia: "Sex", creche: 122, fundamental: 288, total: 410 },
]

const nutricionalData = [
  { nutriente: "Calorias", planejado: 450, servido: 435, meta: 400 },
  { nutriente: "Proteínas", planejado: 25, servido: 23, meta: 20 },
  { nutriente: "Carboidratos", planejado: 65, servido: 62, meta: 60 },
  { nutriente: "Fibras", planejado: 12, servido: 11, meta: 10 },
]

const custoMensalData = [
  { mes: "Jan", custo: 15000, alunos: 290 },
  { mes: "Fev", custo: 16200, alunos: 295 },
  { mes: "Mar", custo: 15800, alunos: 288 },
  { mes: "Abr", custo: 17100, alunos: 302 },
  { mes: "Mai", custo: 16500, alunos: 298 },
]

const distribuicaoTurmasData = [
  { name: "Creche", value: 85, color: "#22c55e" },
  { name: "Pré-escola", value: 120, color: "#3b82f6" },
  { name: "Fundamental I", value: 155, color: "#f59e0b" },
]

export default function RelatoriosPage() {
  const [nutricionalPeriodoInicio, setNutricionalPeriodoInicio] = useState<string | undefined>(undefined)
  const [nutricionalPeriodoFim, setNutricionalPeriodoFim] = useState<string | undefined>(undefined)
  const [nutricionalFaixaEtaria, setNutricionalFaixaEtaria] = useState<string>("todas")

  const [consumoPeriodoInicio, setConsumoPeriodoInicio] = useState<string | undefined>(undefined)
  const [consumoPeriodoFim, setConsumoPeriodoFim] = useState<string | undefined>(undefined)
  const [consumoTurma, setConsumoTurma] = useState<string>("todas")

  const [financeiroPeriodoInicio, setFinanceiroPeriodoInicio] = useState<string | undefined>(undefined)
  const [financeiroPeriodoFim, setFinanceiroPeriodoFim] = useState<string | undefined>(undefined)
  const [financeiroTipoRelatorio, setFinanceiroTipoRelatorio] = useState<string>("completo")

  const [relatorioPersonalizadoNome, setRelatorioPersonalizadoNome] = useState<string>("")
  const [incluirDadosNutricionais, setIncluirDadosNutricionais] = useState<boolean>(true)
  const [incluirConsumoPorTurma, setIncluirConsumoPorTurma] = useState<boolean>(true)
  const [incluirAnaliseDeCustos, setIncluirAnaliseDeCustos] = useState<boolean>(false)
  const [incluirGraficosComparativos, setIncluirGraficosComparativos] = useState<boolean>(false)

  const handleExportarNutricionalPDF = () => {
    if (!nutricionalPeriodoInicio || !nutricionalPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório nutricional.")
      return
    }

    // Simulação de geração de PDF
    console.log("Gerando relatório nutricional em PDF...")
    console.log("Período:", nutricionalPeriodoInicio, " - ", nutricionalPeriodoFim)
    console.log("Faixa Etária:", nutricionalFaixaEtaria)
    simulateDownload("relatorio_nutricional.pdf", "PDF Content")
  }

  const handleExportarNutricionalExcel = () => {
    if (!nutricionalPeriodoInicio || !nutricionalPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório nutricional.")
      return
    }

    // Simulação de geração de Excel
    console.log("Gerando relatório nutricional em Excel...")
    console.log("Período:", nutricionalPeriodoInicio, " - ", nutricionalPeriodoFim)
    console.log("Faixa Etária:", nutricionalFaixaEtaria)
    simulateDownload("relatorio_nutricional.xlsx", "Excel Content")
  }

  const handleExportarConsumoPDF = () => {
    if (!consumoPeriodoInicio || !consumoPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório de consumo.")
      return
    }

    // Simulação de geração de PDF
    console.log("Gerando relatório de consumo em PDF...")
    console.log("Período:", consumoPeriodoInicio, " - ", consumoPeriodoFim)
    console.log("Turma:", consumoTurma)
    simulateDownload("relatorio_consumo.pdf", "PDF Content")
  }

  const handleExportarConsumoExcel = () => {
    if (!consumoPeriodoInicio || !consumoPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório de consumo.")
      return
    }

    // Simulação de geração de Excel
    console.log("Gerando relatório de consumo em Excel...")
    console.log("Período:", consumoPeriodoInicio, " - ", consumoPeriodoFim)
    console.log("Turma:", consumoTurma)
    simulateDownload("relatorio_consumo.xlsx", "Excel Content")
  }

  const handleExportarFinanceiroPDF = () => {
    if (!financeiroPeriodoInicio || !financeiroPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório financeiro.")
      return
    }

    // Simulação de geração de PDF
    console.log("Gerando relatório financeiro em PDF...")
    console.log("Período:", financeiroPeriodoInicio, " - ", financeiroPeriodoFim)
    console.log("Tipo de Relatório:", financeiroTipoRelatorio)
    simulateDownload("relatorio_financeiro.pdf", "PDF Content")
  }

  const handleExportarFinanceiroExcel = () => {
    if (!financeiroPeriodoInicio || !financeiroPeriodoFim) {
      alert("Por favor, selecione o período para exportar o relatório financeiro.")
      return
    }

    // Simulação de geração de Excel
    console.log("Gerando relatório financeiro em Excel...")
    console.log("Período:", financeiroPeriodoInicio, " - ", financeiroPeriodoFim)
    console.log("Tipo de Relatório:", financeiroTipoRelatorio)
    simulateDownload("relatorio_financeiro.xlsx", "Excel Content")
  }

  const handleGerarRelatorioPersonalizado = () => {
    if (!relatorioPersonalizadoNome) {
      alert("Por favor, insira um nome para o relatório personalizado.")
      return
    }

    // Simulação de geração de relatório personalizado
    console.log("Gerando relatório personalizado...")
    console.log("Nome do Relatório:", relatorioPersonalizadoNome)
    console.log("Incluir Dados Nutricionais:", incluirDadosNutricionais)
    console.log("Incluir Consumo por Turma:", incluirConsumoPorTurma)
    console.log("Incluir Análise de Custos:", incluirAnaliseDeCustos)
    console.log("Incluir Gráficos Comparativos:", incluirGraficosComparativos)
    simulateDownload("relatorio_personalizado.pdf", "Custom Report Content")
  }

  const simulateDownload = (filename: string, content: string) => {
    const element = document.createElement("a")
    const blob = new Blob([content], { type: "text/plain" })
    const fileUrl = URL.createObjectURL(blob)
    element.setAttribute("href", fileUrl)
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(fileUrl)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
        <p className="text-muted-foreground">Relatórios nutricionais, de consumo e análises detalhadas</p>
      </div>

      <Tabs defaultValue="nutricional" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nutricional">Nutricional</TabsTrigger>
          <TabsTrigger value="consumo">Consumo</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="exportar">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="nutricional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise Nutricional Semanal</CardTitle>
                <CardDescription>Comparativo entre planejado e servido</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    planejado: {
                      label: "Planejado",
                      color: "#3b82f6",
                    },
                    servido: {
                      label: "Servido",
                      color: "#22c55e",
                    },
                    meta: {
                      label: "Meta",
                      color: "#f59e0b",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutricionalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nutriente" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="planejado" fill="#3b82f6" />
                      <Bar dataKey="servido" fill="#22c55e" />
                      <Bar dataKey="meta" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Faixa Etária</CardTitle>
                <CardDescription>Número de alunos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    creche: { label: "Creche", color: "#22c55e" },
                    preescola: { label: "Pré-escola", color: "#3b82f6" },
                    fundamental: { label: "Fundamental", color: "#f59e0b" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={distribuicaoTurmasData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribuicaoTurmasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relatório Nutricional Detalhado</CardTitle>
              <CardDescription>Médias nutricionais por faixa etária (últimos 7 dias)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Creche (0-3 anos)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calorias médias:</span>
                      <span className="font-medium">320 kcal/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proteínas:</span>
                      <span className="font-medium">18g/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carboidratos:</span>
                      <span className="font-medium">45g/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fibras:</span>
                      <span className="font-medium">8g/dia</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Fundamental &gt;3 anos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calorias médias:</span>
                      <span className="font-medium">450 kcal/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proteínas:</span>
                      <span className="font-medium">25g/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carboidratos:</span>
                      <span className="font-medium">65g/dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fibras:</span>
                      <span className="font-medium">12g/dia</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo Semanal por Faixa Etária</CardTitle>
              <CardDescription>Número de refeições servidas nos últimos 5 dias</CardDescription>
            </CardHeader>
            <CardContent>
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
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consumoSemanalData}>
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa de Adesão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">92%</div>
                <p className="text-sm text-muted-foreground">Média semanal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total de Refeições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2,018</div>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desperdício</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">3.2%</div>
                <p className="text-sm text-muted-foreground">Abaixo da meta</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Custos Mensais</CardTitle>
              <CardDescription>Custo total e por aluno nos últimos 5 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  custo: {
                    label: "Custo Total (R$)",
                    color: "#f59e0b",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={custoMensalData}>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Custos - Maio 2024</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Custo total do mês:</span>
                  <span className="font-bold">R$ 16.500,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Custo por aluno:</span>
                  <span className="font-bold">R$ 55,37</span>
                </div>
                <div className="flex justify-between">
                  <span>Custo por refeição:</span>
                  <span className="font-bold">R$ 2,75</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de refeições:</span>
                  <span className="font-bold">6.000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparativo com Mês Anterior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Variação do custo total:</span>
                  <div className="flex items-center text-red-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-bold">+3.5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Variação por aluno:</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-bold">-1.2%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Economia estimada:</span>
                  <span className="font-bold text-green-600">R$ 180,00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exportar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Nutricional</CardTitle>
                <CardDescription>Exporte relatórios nutricionais detalhados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={nutricionalPeriodoInicio}
                      onChange={(e) => setNutricionalPeriodoInicio(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={nutricionalPeriodoFim}
                      onChange={(e) => setNutricionalPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Faixa Etária</Label>
                  <Select value={nutricionalFaixaEtaria} onValueChange={setNutricionalFaixaEtaria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as faixas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as faixas</SelectItem>
                      <SelectItem value="creche">Creche (0-3 anos)</SelectItem>
                      <SelectItem value="fundamental">Fundamental &gt;3 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleExportarNutricionalPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleExportarNutricionalExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório de Consumo</CardTitle>
                <CardDescription>Exporte dados de consumo e frequência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={consumoPeriodoInicio}
                      onChange={(e) => setConsumoPeriodoInicio(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={consumoPeriodoFim}
                      onChange={(e) => setConsumoPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Turma</Label>
                  <Select value={consumoTurma} onValueChange={setConsumoTurma}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as turmas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as turmas</SelectItem>
                      <SelectItem value="creche1">Creche I</SelectItem>
                      <SelectItem value="creche2">Creche II</SelectItem>
                      <SelectItem value="pre1">Pré I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleExportarConsumoPDF}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleExportarConsumoExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Financeiro</CardTitle>
                <CardDescription>Exporte análises de custos e orçamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={financeiroPeriodoInicio}
                      onChange={(e) => setFinanceiroPeriodoInicio(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={financeiroPeriodoFim}
                      onChange={(e) => setFinanceiroPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Relatório</Label>
                  <Select value={financeiroTipoRelatorio} onValueChange={setFinanceiroTipoRelatorio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completo">Relatório Completo</SelectItem>
                      <SelectItem value="custos">Apenas Custos</SelectItem>
                      <SelectItem value="comparativo">Comparativo Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleExportarFinanceiroPDF}>
                    <PieChart className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleExportarFinanceiroExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Personalizado</CardTitle>
                <CardDescription>Crie relatórios customizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Relatório</Label>
                  <Input
                    placeholder="Ex: Relatório Mensal Maio"
                    value={relatorioPersonalizadoNome}
                    onChange={(e) => setRelatorioPersonalizadoNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Incluir Dados</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={incluirDadosNutricionais}
                        onChange={(e) => setIncluirDadosNutricionais(e.target.checked)}
                      />
                      <span className="text-sm">Dados nutricionais</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={incluirConsumoPorTurma}
                        onChange={(e) => setIncluirConsumoPorTurma(e.target.checked)}
                      />
                      <span className="text-sm">Consumo por turma</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={incluirAnaliseDeCustos}
                        onChange={(e) => setIncluirAnaliseDeCustos(e.target.checked)}
                      />
                      <span className="text-sm">Análise de custos</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={incluirGraficosComparativos}
                        onChange={(e) => setIncluirGraficosComparativos(e.target.checked)}
                      />
                      <span className="text-sm">Gráficos comparativos</span>
                    </label>
                  </div>
                </div>
                <Button className="w-full" onClick={handleGerarRelatorioPersonalizado}>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
