"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingDown, Calculator, PieChart, Plus, Edit, Trash2, Settings } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"

const custoPreparacoes = [
  {
    id: 1,
    nome: "Arroz com Feijão",
    custoIngredientes: 2.5,
    custoMaoObra: 0.8,
    custoEnergia: 0.3,
    custoTotal: 3.6,
    porcoes: 100,
    custoPorPorcao: 0.036,
  },
  {
    id: 2,
    nome: "Frango Grelhado",
    custoIngredientes: 8.5,
    custoMaoObra: 1.2,
    custoEnergia: 0.45,
    custoTotal: 10.15,
    porcoes: 50,
    custoPorPorcao: 0.203,
  },
  {
    id: 3,
    nome: "Salada Mista",
    custoIngredientes: 3.2,
    custoMaoObra: 0.6,
    custoEnergia: 0.1,
    custoTotal: 3.9,
    porcoes: 80,
    custoPorPorcao: 0.049,
  },
]

const custoMensalData = [
  { mes: "Jan", ingredientes: 12000, maoObra: 2500, energia: 800, total: 15300, alunos: 290 },
  { mes: "Fev", ingredientes: 13200, maoObra: 2600, energia: 850, total: 16650, alunos: 295 },
  { mes: "Mar", ingredientes: 12800, maoObra: 2550, energia: 820, total: 16170, alunos: 288 },
  { mes: "Abr", ingredientes: 14100, maoObra: 2700, energia: 900, total: 17700, alunos: 302 },
  { mes: "Mai", ingredientes: 13500, maoObra: 2650, energia: 875, total: 17025, alunos: 298 },
]

const custoPorAlunoData = [
  { faixaEtaria: "Creche (0-2)", alunos: 55, custoMedio: 45.2, custoTotal: 2486, calorias: 320, refeicoesDia: 2 },
  { faixaEtaria: "Creche (2-3)", alunos: 60, custoMedio: 48.5, custoTotal: 2910, calorias: 380, refeicoesDia: 2 },
  { faixaEtaria: "Pré (4-5)", alunos: 90, custoMedio: 52.3, custoTotal: 4707, calorias: 450, refeicoesDia: 2 },
  { faixaEtaria: "Fund. (6-10)", alunos: 155, custoMedio: 58.8, custoTotal: 9114, calorias: 520, refeicoesDia: 3 },
]

const orcamentoData = [
  { categoria: "Ingredientes", orcado: 15000, realizado: 13500, variacao: -10 },
  { categoria: "Mão de Obra", orcado: 3000, realizado: 2650, variacao: -11.7 },
  { categoria: "Energia", orcado: 1000, realizado: 875, variacao: -12.5 },
  { categoria: "Equipamentos", orcado: 500, realizado: 320, variacao: -36 },
  { categoria: "Outros", orcado: 800, realizado: 650, variacao: -18.8 },
]

export default function CustosPage() {
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false)
  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(false)
  const [calculadoraData, setCalculadoraData] = useState({
    nome: "",
    ingredientes: "",
    maoObra: "",
    energia: "",
    porcoes: "",
  })

  const [custosFixos, setCustosFixos] = useState({
    salarioCozinheira: 2500,
    salarioAuxiliares: 3600, // 2 auxiliares x R$ 1800
    custoGas: 350,
  })

  useEffect(() => {
    // Carregar configurações do localStorage
    const configSalva = localStorage.getItem("configuracoes")
    if (configSalva) {
      const config = JSON.parse(configSalva)
      // Atualizar custos fixos baseado nas configurações
      setCustosFixos({
        salarioCozinheira: Number(config.salarioCozinheira || 0),
        salarioAuxiliares: Number(config.salarioAuxiliares || 0) * Number(config.numeroAuxiliares || 0),
        custoGas: Number(config.custoGasMensal || 0),
      })
    }
  }, [])

  const custoFixoMensal = custosFixos.salarioCozinheira + custosFixos.salarioAuxiliares + custosFixos.custoGas
  const custoIngredientesMes = custoMensalData[custoMensalData.length - 1].ingredientes
  const custoTotalMes = custoIngredientesMes + custoFixoMensal
  const totalAlunos = custoPorAlunoData.reduce((sum, item) => sum + item.alunos, 0)
  const custoPorAluno = custoTotalMes / totalAlunos
  const totalRefeicoesMes = totalAlunos * 22 // 22 dias letivos
  const custoPorRefeicao = custoTotalMes / totalRefeicoesMes

  const handleCalcularCusto = () => {
    const ingredientes = Number.parseFloat(calculadoraData.ingredientes) || 0
    const porcoes = Number.parseInt(calculadoraData.porcoes) || 1

    // Calcular custo proporcional dos fixos por porção
    const custoFixoPorPorcao = custoFixoMensal / (totalAlunos * 22) // 22 dias letivos

    const custoTotal = ingredientes + custoFixoPorPorcao * porcoes
    const custoPorPorcao = custoTotal / porcoes

    alert(
      `Custo dos Ingredientes: R$ ${ingredientes.toFixed(2)}\nCusto Fixo Proporcional: R$ ${(custoFixoPorPorcao * porcoes).toFixed(2)}\nCusto Total: R$ ${custoTotal.toFixed(2)}\nCusto por Porção: R$ ${custoPorPorcao.toFixed(3)}`,
    )
  }

  const handleSalvarOrcamento = () => {
    alert("Orçamento salvo com sucesso!")
    setIsOrcamentoOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Custos</h1>
        <p className="text-muted-foreground">Controle financeiro e análise de custos do programa alimentar</p>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {custoTotalMes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+3.8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Aluno</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {custoPorAluno.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Base: {totalAlunos} alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Refeição</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {custoPorRefeicao.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{totalRefeicoesMes.toLocaleString()} refeições/mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Projetada</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 1.250</div>
            <p className="text-xs text-muted-foreground">Otimização de compras</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Fixos Mensais</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {custoFixoMensal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Salários + Gás de cozinha</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preparacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preparacoes">Custo por Preparação</TabsTrigger>
          <TabsTrigger value="mensal">Análise Mensal</TabsTrigger>
          <TabsTrigger value="aluno">Custo por Aluno</TabsTrigger>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
        </TabsList>

        <TabsContent value="preparacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custo Detalhado por Preparação</CardTitle>
              <CardDescription>Análise de custos de ingredientes, mão de obra e energia</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preparação</TableHead>
                    <TableHead>Ingredientes</TableHead>
                    <TableHead>Mão de Obra</TableHead>
                    <TableHead>Energia</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Porções</TableHead>
                    <TableHead>Custo/Porção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {custoPreparacoes.map((prep) => (
                    <TableRow key={prep.id}>
                      <TableCell className="font-medium">{prep.nome}</TableCell>
                      <TableCell>R$ {prep.custoIngredientes.toFixed(2)}</TableCell>
                      <TableCell>R$ {prep.custoMaoObra.toFixed(2)}</TableCell>
                      <TableCell>R$ {prep.custoEnergia.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">R$ {prep.custoTotal.toFixed(2)}</TableCell>
                      <TableCell>{prep.porcoes}</TableCell>
                      <TableCell>
                        <Badge variant="outline">R$ {prep.custoPorPorcao.toFixed(3)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calculadora de Custos</CardTitle>
                <CardDescription>Calcule o custo de uma nova preparação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomePrep">Nome da Preparação</Label>
                  <Input
                    id="nomePrep"
                    placeholder="Ex: Lasanha de Frango"
                    value={calculadoraData.nome}
                    onChange={(e) => setCalculadoraData({ ...calculadoraData, nome: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredientes">Custo Ingredientes (R$)</Label>
                    <Input
                      id="ingredientes"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={calculadoraData.ingredientes}
                      onChange={(e) => setCalculadoraData({ ...calculadoraData, ingredientes: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="porcoes">Número de Porções</Label>
                    <Input
                      id="porcoes"
                      type="number"
                      placeholder="0"
                      value={calculadoraData.porcoes}
                      onChange={(e) => setCalculadoraData({ ...calculadoraData, porcoes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maoObra">Mão de Obra (R$)</Label>
                    <Input
                      id="maoObra"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={calculadoraData.maoObra}
                      onChange={(e) => setCalculadoraData({ ...calculadoraData, maoObra: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="energia">Energia (R$)</Label>
                    <Input
                      id="energia"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={calculadoraData.energia}
                      onChange={(e) => setCalculadoraData({ ...calculadoraData, energia: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCalcularCusto}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Custo Total
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado do Cálculo</CardTitle>
                <CardDescription>Resumo dos custos calculados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Custo dos Ingredientes:</span>
                    <span className="font-medium">
                      R$ {(Number.parseFloat(calculadoraData.ingredientes) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo da Mão de Obra:</span>
                    <span className="font-medium">
                      R$ {(Number.parseFloat(calculadoraData.maoObra) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo da Energia:</span>
                    <span className="font-medium">
                      R$ {(Number.parseFloat(calculadoraData.energia) || 0).toFixed(2)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Custo Total:</span>
                    <span>
                      R${" "}
                      {(
                        (Number.parseFloat(calculadoraData.ingredientes) || 0) +
                        (Number.parseFloat(calculadoraData.maoObra) || 0) +
                        (Number.parseFloat(calculadoraData.energia) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo por Porção:</span>
                    <span className="font-medium">
                      R${" "}
                      {(
                        ((Number.parseFloat(calculadoraData.ingredientes) || 0) +
                          (Number.parseFloat(calculadoraData.maoObra) || 0) +
                          (Number.parseFloat(calculadoraData.energia) || 0)) /
                        (Number.parseInt(calculadoraData.porcoes) || 1)
                      ).toFixed(3)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mensal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Custos Mensais</CardTitle>
              <CardDescription>Análise detalhada dos custos por categoria nos últimos 5 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  ingredientes: { label: "Ingredientes", color: "#22c55e" },
                  maoObra: { label: "Mão de Obra", color: "#3b82f6" },
                  energia: { label: "Energia", color: "#f59e0b" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={custoMensalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ingredientes" fill="#22c55e" />
                    <Bar dataKey="maoObra" fill="#3b82f6" />
                    <Bar dataKey="energia" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise Comparativa</CardTitle>
                <CardDescription>Comparação mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Variação</TableHead>
                      <TableHead>Por Aluno</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {custoMensalData.map((item, index) => {
                      const variacao =
                        index > 0
                          ? ((item.total - custoMensalData[index - 1].total) / custoMensalData[index - 1].total) * 100
                          : 0
                      return (
                        <TableRow key={item.mes}>
                          <TableCell className="font-medium">{item.mes}</TableCell>
                          <TableCell>R$ {item.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={variacao > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                              {variacao > 0 ? "+" : ""}
                              {variacao.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>R$ {(item.total / item.alunos).toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Custos</CardTitle>
                <CardDescription>Projeção baseada nos últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    total: { label: "Custo Total", color: "#8b5cf6" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={custoMensalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aluno" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custo Detalhado por Faixa Etária</CardTitle>
              <CardDescription>Análise de custos considerando necessidades nutricionais específicas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Custo Médio</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead>Calorias/Dia</TableHead>
                    <TableHead>Refeições/Dia</TableHead>
                    <TableHead>Custo/Refeição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {custoPorAlunoData.map((item) => (
                    <TableRow key={item.faixaEtaria}>
                      <TableCell className="font-medium">{item.faixaEtaria}</TableCell>
                      <TableCell>{item.alunos}</TableCell>
                      <TableCell>R$ {item.custoMedio.toFixed(2)}</TableCell>
                      <TableCell>R$ {item.custoTotal.toLocaleString()}</TableCell>
                      <TableCell>{item.calorias} kcal</TableCell>
                      <TableCell>{item.refeicoesDia}</TableCell>
                      <TableCell>R$ {(item.custoMedio / (item.refeicoesDia * 22)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Custos por Faixa</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    custoTotal: { label: "Custo Total", color: "#3b82f6" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={custoPorAlunoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="faixaEtaria" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="custoTotal" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eficiência Nutricional</CardTitle>
                <CardDescription>Custo por caloria fornecida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {custoPorAlunoData.map((item) => {
                  const custoPorCaloria = (item.custoMedio / (item.calorias * 22)).toFixed(4)
                  return (
                    <div key={item.faixaEtaria} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.faixaEtaria}</span>
                        <p className="text-sm text-muted-foreground">{item.calorias} kcal/dia</p>
                      </div>
                      <Badge variant="outline">R$ {custoPorCaloria}/kcal</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orcamento" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Orçamento Anual 2024</h3>
              <p className="text-muted-foreground">Planejamento e controle orçamentário</p>
            </div>
            <Dialog open={isOrcamentoOpen} onOpenChange={setIsOrcamentoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Orçamento</DialogTitle>
                  <DialogDescription>Defina o orçamento para o próximo período</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">Ano 2024</SelectItem>
                          <SelectItem value="2025">Ano 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de orçamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anual">Anual</SelectItem>
                          <SelectItem value="semestral">Semestral</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Orçamento Total (R$)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsOrcamentoOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarOrcamento}>Salvar Orçamento</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Execução Orçamentária</CardTitle>
              <CardDescription>Comparativo entre orçado e realizado</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Orçado</TableHead>
                    <TableHead>Realizado</TableHead>
                    <TableHead>Variação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentoData.map((item) => (
                    <TableRow key={item.categoria}>
                      <TableCell className="font-medium">{item.categoria}</TableCell>
                      <TableCell>R$ {item.orcado.toLocaleString()}</TableCell>
                      <TableCell>R$ {item.realizado.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={item.variacao < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {item.variacao > 0 ? "+" : ""}
                          {item.variacao.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.variacao < -5 ? "default" : item.variacao > 5 ? "destructive" : "secondary"}
                        >
                          {item.variacao < -5 ? "Economia" : item.variacao > 5 ? "Excesso" : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Orçamentário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Orçamento Total:</span>
                  <span className="font-bold">
                    R$ {orcamentoData.reduce((sum, item) => sum + item.orcado, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Realizado:</span>
                  <span className="font-bold">
                    R$ {orcamentoData.reduce((sum, item) => sum + item.realizado, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Economia:</span>
                  <span className="font-bold text-green-600">
                    R${" "}
                    {(
                      orcamentoData.reduce((sum, item) => sum + item.orcado, 0) -
                      orcamentoData.reduce((sum, item) => sum + item.realizado, 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>% Executado:</span>
                  <span className="font-bold">
                    {(
                      (orcamentoData.reduce((sum, item) => sum + item.realizado, 0) /
                        orcamentoData.reduce((sum, item) => sum + item.orcado, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projeção para o Ano</CardTitle>
                <CardDescription>Baseado na execução atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Meses Executados:</span>
                  <span className="font-medium">5 de 12</span>
                </div>
                <div className="flex justify-between">
                  <span>Projeção Anual:</span>
                  <span className="font-bold">
                    R$ {((orcamentoData.reduce((sum, item) => sum + item.realizado, 0) * 12) / 5).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Economia Projetada:</span>
                  <span className="font-bold text-green-600">
                    R${" "}
                    {(
                      (orcamentoData.reduce((sum, item) => sum + item.orcado, 0) * 12) / 5 -
                      (orcamentoData.reduce((sum, item) => sum + item.realizado, 0) * 12) / 5
                    ).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
