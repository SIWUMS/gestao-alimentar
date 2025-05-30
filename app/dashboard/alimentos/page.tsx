"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, AlertTriangle, Eye, Download } from "lucide-react"
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

const alimentosIniciais = [
  {
    id: 1,
    nome: "Arroz Branco Cozido",
    categoria: "Cereais",
    calorias: 128,
    proteinas: 2.5,
    carboidratos: 28.1,
    gorduras: 0.1,
    fibras: 1.6,
    calcio: 4,
    ferro: 0.3,
    restricoes: [],
    fonte: "TACO",
  },
  {
    id: 2,
    nome: "Feijão Preto Cozido",
    categoria: "Leguminosas",
    calorias: 77,
    proteinas: 4.5,
    carboidratos: 14.0,
    gorduras: 0.5,
    fibras: 8.4,
    calcio: 29,
    ferro: 1.5,
    restricoes: [],
    fonte: "TACO",
  },
  {
    id: 3,
    nome: "Frango Peito Grelhado",
    categoria: "Carnes",
    calorias: 165,
    proteinas: 31.0,
    carboidratos: 0,
    gorduras: 3.6,
    fibras: 0,
    calcio: 14,
    ferro: 0.9,
    restricoes: [],
    fonte: "TACO",
  },
  {
    id: 4,
    nome: "Amendoim",
    categoria: "Oleaginosas",
    calorias: 567,
    proteinas: 26.2,
    carboidratos: 20.3,
    gorduras: 43.9,
    fibras: 8.0,
    calcio: 54,
    ferro: 2.2,
    restricoes: ["Alergia a Amendoim"],
    fonte: "TACO",
  },
  {
    id: 5,
    nome: "Leite Integral",
    categoria: "Laticínios",
    calorias: 61,
    proteinas: 2.9,
    carboidratos: 4.3,
    gorduras: 3.2,
    fibras: 0,
    calcio: 113,
    ferro: 0.1,
    restricoes: ["Intolerância à Lactose"],
    fonte: "TACO",
  },
]

const categorias = ["Todos", "Cereais", "Leguminosas", "Carnes", "Verduras", "Frutas", "Laticínios", "Oleaginosas"]

export default function AlimentosPage() {
  const [alimentos, setAlimentos] = useState(alimentosIniciais)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    calorias: "",
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    fibras: "",
    calcio: "",
  })

  const filteredAlimentos = alimentos.filter((alimento) => {
    const matchesSearch = alimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || alimento.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleViewAlimento = (id: number) => {
    const alimento = alimentos.find((a) => a.id === id)
    alert(`Visualizar: ${alimento?.nome}\nCalorias: ${alimento?.calorias}kcal\nProteínas: ${alimento?.proteinas}g`)
  }

  const handleEditAlimento = (id: number) => {
    console.log("Editar alimento:", id)
  }

  const handleDownloadAlimento = (id: number) => {
    console.log("Baixar ficha técnica:", id)
  }

  const handleDeleteAlimento = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este alimento?")) {
      setAlimentos(alimentos.filter((a) => a.id !== id))
    }
  }

  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`Arquivo selecionado: ${file.name}`)
        // Aqui implementaremos a importação
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base de Alimentos</h1>
          <p className="text-muted-foreground">
            Tabela nutricional baseada na TACO (Tabela de Composição de Alimentos)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Alimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Alimento</DialogTitle>
              <DialogDescription>Adicione um novo alimento à base de dados</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Alimento</Label>
                  <Input id="nome" placeholder="Ex: Batata Doce Cozida" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calorias">Calorias (kcal/100g)</Label>
                  <Input id="calorias" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proteinas">Proteínas (g/100g)</Label>
                  <Input id="proteinas" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carboidratos">Carboidratos (g/100g)</Label>
                  <Input id="carboidratos" type="number" step="0.1" placeholder="0.0" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gorduras">Gorduras (g/100g)</Label>
                  <Input id="gorduras" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fibras">Fibras (g/100g)</Label>
                  <Input id="fibras" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calcio">Cálcio (mg/100g)</Label>
                  <Input id="calcio" type="number" step="0.1" placeholder="0.0" />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">Cadastrar Alimento</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Alimentos</TabsTrigger>
          <TabsTrigger value="restricoes">Restrições Alimentares</TabsTrigger>
          <TabsTrigger value="importar">Importar TACO</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alimento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Calorias</TableHead>
                    <TableHead>Proteínas</TableHead>
                    <TableHead>Carboidratos</TableHead>
                    <TableHead>Restrições</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlimentos.map((alimento) => (
                    <TableRow key={alimento.id}>
                      <TableCell className="font-medium">{alimento.nome}</TableCell>
                      <TableCell>{alimento.categoria}</TableCell>
                      <TableCell>{alimento.calorias} kcal</TableCell>
                      <TableCell>{alimento.proteinas}g</TableCell>
                      <TableCell>{alimento.carboidratos}g</TableCell>
                      <TableCell>
                        {alimento.restricoes.length > 0 ? (
                          <div className="flex gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive" className="text-xs">
                              {alimento.restricoes.length}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Nenhuma
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewAlimento(alimento.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditAlimento(alimento.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadAlimento(alimento.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDeleteAlimento(alimento.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restricoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alimentos com Restrições</CardTitle>
              <CardDescription>Alimentos que possuem restrições alimentares ou são proibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alimentos
                  .filter((a) => a.restricoes.length > 0)
                  .map((alimento) => (
                    <div key={alimento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{alimento.nome}</h3>
                        <p className="text-sm text-muted-foreground">{alimento.categoria}</p>
                      </div>
                      <div className="flex gap-2">
                        {alimento.restricoes.map((restricao, index) => (
                          <Badge key={index} variant="destructive">
                            {restricao}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Dados TACO</CardTitle>
              <CardDescription>Importe dados da Tabela de Composição de Alimentos (TACO)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="space-y-2">
                  <div className="text-lg font-medium">Arraste o arquivo TACO aqui</div>
                  <div className="text-sm text-muted-foreground">Ou clique para selecionar um arquivo CSV ou Excel</div>
                  <Button variant="outline" className="mt-4" onClick={handleFileSelect}>
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Instruções:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• O arquivo deve estar no formato CSV ou Excel</li>
                  <li>• Deve conter as colunas: Nome, Categoria, Calorias, Proteínas, Carboidratos, etc.</li>
                  <li>• Os dados serão validados antes da importação</li>
                  <li>• Alimentos duplicados serão ignorados</li>
                </ul>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Iniciar Importação</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
