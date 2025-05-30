"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, Minus, AlertTriangle, TrendingUp, TrendingDown, Search } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"

// Dados simulados do estoque incluindo gás de cozinha
const itensEstoque = [
  {
    id: 1,
    nome: "Arroz Branco",
    categoria: "Cereais",
    quantidade: 50,
    unidade: "KG",
    valorUnitario: 4.5,
    valorTotal: 225,
    nivelMinimo: 20,
    nivelMaximo: 100,
    dataVencimento: "2024-12-31",
    fornecedor: "Distribuidora ABC",
    status: "Normal",
  },
  {
    id: 2,
    nome: "Feijão Preto",
    categoria: "Leguminosas",
    quantidade: 15,
    unidade: "KG",
    valorUnitario: 6.8,
    valorTotal: 102,
    nivelMinimo: 20,
    nivelMaximo: 80,
    dataVencimento: "2024-11-30",
    fornecedor: "Distribuidora ABC",
    status: "Baixo",
  },
  {
    id: 3,
    nome: "Óleo de Soja",
    categoria: "Óleos",
    quantidade: 8,
    unidade: "LT",
    valorUnitario: 8.9,
    valorTotal: 71.2,
    nivelMinimo: 10,
    nivelMaximo: 50,
    dataVencimento: "2025-06-30",
    fornecedor: "Óleos Unidos",
    status: "Baixo",
  },
  {
    id: 4,
    nome: "Gás de Cozinha P45",
    categoria: "Combustível",
    quantidade: 2,
    unidade: "UN",
    valorUnitario: 120.0,
    valorTotal: 240,
    nivelMinimo: 1,
    nivelMaximo: 5,
    dataVencimento: "2025-12-31",
    fornecedor: "Gás Brasilgás",
    status: "Normal",
  },
  {
    id: 5,
    nome: "Carne Bovina",
    categoria: "Carnes",
    quantidade: 3,
    unidade: "KG",
    valorUnitario: 28.5,
    valorTotal: 85.5,
    nivelMinimo: 10,
    nivelMaximo: 30,
    dataVencimento: "2024-06-15",
    fornecedor: "Frigorífico Central",
    status: "Crítico",
  },
]

const movimentacoes = [
  {
    id: 1,
    tipo: "Entrada",
    item: "Arroz Branco",
    quantidade: 25,
    unidade: "KG",
    valorUnitario: 4.5,
    valorTotal: 112.5,
    data: "2024-05-15",
    fornecedor: "Distribuidora ABC",
    observacao: "Compra mensal",
  },
  {
    id: 2,
    tipo: "Saída",
    item: "Feijão Preto",
    quantidade: 5,
    unidade: "KG",
    valorUnitario: 6.8,
    valorTotal: 34,
    data: "2024-05-18",
    observacao: "Preparo cardápio semanal",
  },
  {
    id: 3,
    tipo: "Entrada",
    item: "Gás de Cozinha P45",
    quantidade: 1,
    unidade: "UN",
    valorUnitario: 120.0,
    valorTotal: 120,
    data: "2024-05-10",
    fornecedor: "Gás Brasilgás",
    observacao: "Reposição mensal",
  },
]

export default function EstoquePage() {
  const [isEntradaOpen, setIsEntradaOpen] = useState(false)
  const [isSaidaOpen, setIsSaidaOpen] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")
  const [entradaData, setEntradaData] = useState({
    item: "Arroz Branco",
    quantidade: "",
    unidade: "KG",
    valorUnitario: "",
    valorTotal: "",
    dataVencimento: "",
    fornecedor: "Distribuidora ABC",
    observacao: "",
  })

  const [saidaData, setSaidaData] = useState({
    item: "Arroz Branco",
    quantidade: "",
    observacao: "",
  })

  const itensFiltrados = itensEstoque.filter((item) => {
    const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = filtroCategoria === "todos" || item.categoria === filtroCategoria
    const matchStatus = filtroStatus === "todos" || item.status === filtroStatus
    return matchBusca && matchCategoria && matchStatus
  })

  const itensAlerta = itensEstoque.filter((item) => item.status === "Baixo" || item.status === "Crítico")

  const valorTotalEstoque = itensEstoque.reduce((total, item) => total + item.valorTotal, 0)

  const handleEntrada = () => {
    const valorTotal = Number(entradaData.quantidade) * Number(entradaData.valorUnitario)
    setEntradaData({ ...entradaData, valorTotal: valorTotal.toFixed(2) })

    toast({
      title: "Entrada registrada!",
      description: `${entradaData.quantidade} ${entradaData.unidade} de ${entradaData.item} adicionados ao estoque`,
    })

    setIsEntradaOpen(false)
    setEntradaData({
      item: "Arroz Branco",
      quantidade: "",
      unidade: "KG",
      valorUnitario: "",
      valorTotal: "",
      dataVencimento: "",
      fornecedor: "Distribuidora ABC",
      observacao: "",
    })
  }

  const handleSaida = () => {
    toast({
      title: "Saída registrada!",
      description: `${saidaData.quantidade} unidades de ${saidaData.item} removidas do estoque`,
    })

    setIsSaidaOpen(false)
    setSaidaData({
      item: "Arroz Branco",
      quantidade: "",
      observacao: "",
    })
  }

  // Calcular valor total automaticamente
  useEffect(() => {
    if (entradaData.quantidade && entradaData.valorUnitario) {
      const total = Number(entradaData.quantidade) * Number(entradaData.valorUnitario)
      setEntradaData((prev) => ({ ...prev, valorTotal: total.toFixed(2) }))
    }
  }, [entradaData.quantidade, entradaData.valorUnitario])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Controle de Estoque</h1>
        <p className="text-muted-foreground">Gerencie ingredientes, suprimentos e gás de cozinha</p>
      </div>

      {/* Alertas de Estoque */}
      {itensAlerta.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque ({itensAlerta.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {itensAlerta.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <p className="text-sm text-muted-foreground">
                      {item.quantidade} {item.unidade} restantes
                    </p>
                  </div>
                  <Badge variant={item.status === "Crítico" ? "destructive" : "secondary"}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensEstoque.length}</div>
            <p className="text-xs text-muted-foreground">Itens cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotalEstoque.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor do estoque</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Alerta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensAlerta.length}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimentacoes.length}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estoque" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estoque">Estoque Atual</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar itens..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as categorias</SelectItem>
                  <SelectItem value="Cereais">Cereais</SelectItem>
                  <SelectItem value="Leguminosas">Leguminosas</SelectItem>
                  <SelectItem value="Carnes">Carnes</SelectItem>
                  <SelectItem value="Óleos">Óleos</SelectItem>
                  <SelectItem value="Combustível">Combustível</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Dialog open={isEntradaOpen} onOpenChange={setIsEntradaOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Entrada</DialogTitle>
                    <DialogDescription>Adicione itens ao estoque</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Item</Label>
                      <Select
                        value={entradaData.item}
                        onValueChange={(value) => setEntradaData({ ...entradaData, item: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arroz Branco">Arroz Branco</SelectItem>
                          <SelectItem value="Feijão Preto">Feijão Preto</SelectItem>
                          <SelectItem value="Óleo de Soja">Óleo de Soja</SelectItem>
                          <SelectItem value="Gás de Cozinha P45">Gás de Cozinha P45</SelectItem>
                          <SelectItem value="Carne Bovina">Carne Bovina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entradaData.quantidade}
                          onChange={(e) => setEntradaData({ ...entradaData, quantidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select
                          value={entradaData.unidade}
                          onValueChange={(value) => setEntradaData({ ...entradaData, unidade: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="KG">KG</SelectItem>
                            <SelectItem value="UN">UN</SelectItem>
                            <SelectItem value="LT">LT</SelectItem>
                            <SelectItem value="G">G</SelectItem>
                            <SelectItem value="ML">ML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor Unitário (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entradaData.valorUnitario}
                          onChange={(e) => setEntradaData({ ...entradaData, valorUnitario: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Total (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entradaData.valorTotal}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Vencimento</Label>
                      <Input
                        type="date"
                        value={entradaData.dataVencimento}
                        onChange={(e) => setEntradaData({ ...entradaData, dataVencimento: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fornecedor</Label>
                      <Input
                        value={entradaData.fornecedor}
                        onChange={(e) => setEntradaData({ ...entradaData, fornecedor: e.target.value })}
                        placeholder="Nome do fornecedor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observação</Label>
                      <Input
                        value={entradaData.observacao}
                        onChange={(e) => setEntradaData({ ...entradaData, observacao: e.target.value })}
                        placeholder="Observações sobre a entrada"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEntradaOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleEntrada} className="bg-green-600 hover:bg-green-700">
                        Registrar Entrada
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isSaidaOpen} onOpenChange={setIsSaidaOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Minus className="h-4 w-4 mr-2" />
                    Saída
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Saída</DialogTitle>
                    <DialogDescription>Remover itens do estoque</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Item</Label>
                      <Select
                        value={saidaData.item}
                        onValueChange={(value) => setSaidaData({ ...saidaData, item: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o item" />
                        </SelectTrigger>
                        <SelectContent>
                          {itensEstoque.map((item) => (
                            <SelectItem key={item.id} value={item.nome}>
                              {item.nome} ({item.quantidade} {item.unidade})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={saidaData.quantidade}
                        onChange={(e) => setSaidaData({ ...saidaData, quantidade: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observação</Label>
                      <Input
                        value={saidaData.observacao}
                        onChange={(e) => setSaidaData({ ...saidaData, observacao: e.target.value })}
                        placeholder="Ex: Preparo cardápio semanal"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsSaidaOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaida} variant="destructive">
                        Registrar Saída
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensFiltrados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.quantidade} {item.unidade}
                      </TableCell>
                      <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
                      <TableCell>R$ {item.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>{new Date(item.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "Normal" ? "default" : item.status === "Baixo" ? "secondary" : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimentacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
              <CardDescription>Registro de entradas e saídas do estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Fornecedor/Obs.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Badge variant={mov.tipo === "Entrada" ? "default" : "secondary"}>{mov.tipo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{mov.item}</TableCell>
                      <TableCell>
                        {mov.quantidade} {mov.unidade}
                      </TableCell>
                      <TableCell>R$ {mov.valorUnitario.toFixed(2)}</TableCell>
                      <TableCell>R$ {mov.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>{new Date(mov.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{mov.fornecedor || mov.observacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
