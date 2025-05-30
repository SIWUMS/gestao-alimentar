"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Users, BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const turmas = [
  { id: 1, nome: "Creche I", faixaEtaria: "0-2 anos", alunos: 25 },
  { id: 2, nome: "Creche II", faixaEtaria: "2-3 anos", alunos: 30 },
  { id: 3, nome: "Pré I", faixaEtaria: "4 anos", alunos: 28 },
  { id: 4, nome: "Pré II", faixaEtaria: "5 anos", alunos: 32 },
  { id: 5, nome: "1º Ano", faixaEtaria: "6 anos", alunos: 35 },
  { id: 6, nome: "2º Ano", faixaEtaria: "7 anos", alunos: 33 },
  { id: 7, nome: "3º Ano", faixaEtaria: "8 anos", alunos: 31 },
  { id: 8, nome: "4º Ano", faixaEtaria: "9 anos", alunos: 29 },
  { id: 9, nome: "5º Ano", faixaEtaria: "10 anos", alunos: 27 },
]

const cardapios = [
  {
    value: "cardapio1",
    label: "Arroz, Feijão, Frango Grelhado",
    calorias: 450,
    proteinas: 30,
    carboidratos: 60,
  },
  {
    value: "cardapio2",
    label: "Macarrão, Carne Moída, Legumes",
    calorias: 500,
    proteinas: 35,
    carboidratos: 55,
  },
  {
    value: "cardapio3",
    label: "Arroz, Feijão, Peixe, Verduras",
    calorias: 420,
    proteinas: 28,
    carboidratos: 58,
  },
]

const consumoRegistrosInicial = [
  {
    id: 1,
    data: "2024-05-20",
    turma: "Creche I",
    alunosPresentes: 23,
    refeicoesServidas: 23,
    cardapio: "cardapio1",
    observacoes: "Boa aceitação",
  },
  {
    id: 2,
    data: "2024-05-20",
    turma: "Pré I",
    alunosPresentes: 26,
    refeicoesServidas: 25,
    cardapio: "cardapio1",
    observacoes: "1 aluno não quis comer",
  },
  {
    id: 3,
    data: "2024-05-19",
    turma: "Creche I",
    alunosPresentes: 24,
    refeicoesServidas: 24,
    cardapio: "cardapio2",
    observacoes: "Excelente aceitação",
  },
]

export default function ConsumoPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [consumoRegistros, setConsumoRegistros] = useState(consumoRegistrosInicial)
  const [formData, setFormData] = useState({
    data: selectedDate,
    turma: "",
    alunosPresentes: 0,
    refeicoesServidas: 0,
    cardapio: "",
    observacoes: "",
  })

  const getTotalAlunos = () => turmas.reduce((total, turma) => total + turma.alunos, 0)
  const getTotalRefeicoes = () =>
    consumoRegistros
      .filter((registro) => registro.data === selectedDate)
      .reduce((total, registro) => total + registro.refeicoesServidas, 0)

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (id, value) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleRegistrarConsumo = () => {
    if (
      !formData.data ||
      !formData.turma ||
      formData.alunosPresentes <= 0 ||
      formData.refeicoesServidas <= 0 ||
      !formData.cardapio
    ) {
      alert("Por favor, preencha todos os campos corretamente.")
      return
    }

    const newRegistro = {
      id: consumoRegistros.length + 1,
      data: formData.data,
      turma: formData.turma,
      alunosPresentes: Number.parseInt(formData.alunosPresentes),
      refeicoesServidas: Number.parseInt(formData.refeicoesServidas),
      cardapio: formData.cardapio,
      observacoes: formData.observacoes,
    }

    setConsumoRegistros([...consumoRegistros, newRegistro])
    setIsDialogOpen(false)

    setFormData({
      data: selectedDate,
      turma: "",
      alunosPresentes: 0,
      refeicoesServidas: 0,
      cardapio: "",
      observacoes: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Consumo</h1>
          <p className="text-muted-foreground">Registre o consumo diário de refeições por turma</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Consumo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Consumo de Refeições</DialogTitle>
              <DialogDescription>Registre a quantidade de refeições servidas por turma</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="date" defaultValue={selectedDate} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turma">Turma</Label>
                  <Select onValueChange={(value) => handleSelectChange("turma", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmas.map((turma) => (
                        <SelectItem key={turma.id} value={turma.nome}>
                          {turma.nome} ({turma.alunos} alunos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alunosPresentes">Alunos Presentes</Label>
                  <Input id="alunosPresentes" type="number" placeholder="0" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refeicoesServidas">Refeições Servidas</Label>
                  <Input id="refeicoesServidas" type="number" placeholder="0" onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardapio">Cardápio do Dia</Label>
                <Select onValueChange={(value) => handleSelectChange("cardapio", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cardápio" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardapios.map((cardapio) => (
                      <SelectItem key={cardapio.value} value={cardapio.value}>
                        {cardapio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  placeholder="Ex: Boa aceitação, sobrou comida..."
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleRegistrarConsumo}>
                  Registrar Consumo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalAlunos()}</div>
            <p className="text-xs text-muted-foreground">Distribuídos em {turmas.length} turmas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalRefeicoes()}</div>
            <p className="text-xs text-muted-foreground">Data: {new Date(selectedDate).toLocaleDateString("pt-BR")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Adesão</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Média dos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas Registradas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumoRegistros.filter((r) => r.data === selectedDate).length}</div>
            <p className="text-xs text-muted-foreground">de {turmas.length} turmas hoje</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="diario" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diario">Consumo Diário</TabsTrigger>
          <TabsTrigger value="turmas">Por Turma</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="diario" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="dataFiltro">Selecionar Data</Label>
              <Input
                id="dataFiltro"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consumo do Dia {new Date(selectedDate).toLocaleDateString("pt-BR")}</CardTitle>
              <CardDescription>Registro de refeições servidas por turma</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Alunos Presentes</TableHead>
                    <TableHead>Refeições Servidas</TableHead>
                    <TableHead>Taxa de Adesão</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumoRegistros
                    .filter((registro) => registro.data === selectedDate)
                    .map((registro) => {
                      const turma = turmas.find((t) => t.nome === registro.turma)
                      const taxaAdesao = Math.round((registro.refeicoesServidas / registro.alunosPresentes) * 100)

                      return (
                        <TableRow key={registro.id}>
                          <TableCell className="font-medium">{registro.turma}</TableCell>
                          <TableCell>{turma?.faixaEtaria}</TableCell>
                          <TableCell>{registro.alunosPresentes}</TableCell>
                          <TableCell>{registro.refeicoesServidas}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                taxaAdesao >= 90
                                  ? "bg-green-100 text-green-800"
                                  : taxaAdesao >= 70
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {taxaAdesao}%
                            </Badge>
                          </TableCell>
                          <TableCell>{registro.observacoes}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>

              {consumoRegistros.filter((r) => r.data === selectedDate).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum registro de consumo encontrado para esta data.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turmas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações das Turmas</CardTitle>
              <CardDescription>Dados gerais sobre as turmas da escola</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Total de Alunos</TableHead>
                    <TableHead>Média de Presença</TableHead>
                    <TableHead>Taxa de Adesão Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turmas.map((turma) => (
                    <TableRow key={turma.id}>
                      <TableCell className="font-medium">{turma.nome}</TableCell>
                      <TableCell>{turma.faixaEtaria}</TableCell>
                      <TableCell>{turma.alunos}</TableCell>
                      <TableCell>{Math.round(turma.alunos * 0.92)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{Math.round(85 + Math.random() * 10)}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consumo</CardTitle>
              <CardDescription>Registros anteriores de consumo de refeições</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Presentes</TableHead>
                    <TableHead>Servidas</TableHead>
                    <TableHead>Cardápio</TableHead>
                    <TableHead>Calorias</TableHead>
                    <TableHead>Proteínas</TableHead>
                    <TableHead>Carboidratos</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumoRegistros
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((registro) => {
                      const cardapio = cardapios.find((c) => c.value === registro.cardapio)

                      return (
                        <TableRow key={registro.id}>
                          <TableCell>{new Date(registro.data).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell className="font-medium">{registro.turma}</TableCell>
                          <TableCell>{registro.alunosPresentes}</TableCell>
                          <TableCell>{registro.refeicoesServidas}</TableCell>
                          <TableCell>{cardapio?.label}</TableCell>
                          <TableCell>{cardapio?.calorias}</TableCell>
                          <TableCell>{cardapio?.proteinas}</TableCell>
                          <TableCell>{cardapio?.carboidratos}</TableCell>
                          <TableCell>{registro.observacoes}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
