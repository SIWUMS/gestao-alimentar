"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  AlertCircle,
  ChefHat,
  Clock,
  DollarSign,
  Users,
  UserCheck,
  UserX,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { generateCardapioPDF } from "@/utils/pdf-generator"

interface Refeicao {
  dia: string
  prato: string
  calorias: number
  ingredientes?: string[]
  custo?: number
}

interface Cardapio {
  id: number
  nome: string
  periodo: string
  status: "Rascunho" | "Pendente" | "Aprovado"
  tipo: "diario" | "semanal" | "mensal"
  refeicoes: Refeicao[]
  observacoes?: string
  dataInicio: string
  dataFim: string
  criadoEm: string
  criadoPor: string
}

interface FichaTecnica {
  id: number
  nome: string
  categoria: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
  fibras: number
  custo: number
  rendimento: string
  tempoPreparo: string
  ingredientes: string[]
  modoPreparo: string[]
  observacoes?: string
}

interface Usuario {
  id: number
  nome: string
  email: string
  perfil: "Admin" | "Nutricionista" | "Cozinheiro" | "Visualizador"
  status: "Ativo" | "Inativo"
  ultimoAcesso: string
  criadoEm: string
  telefone?: string
  departamento?: string
}

const cardapiosIniciais: Cardapio[] = [
  {
    id: 1,
    nome: "Cardápio Semana 1 - Maio",
    periodo: "01/05 a 05/05/2024",
    status: "Aprovado",
    tipo: "semanal",
    dataInicio: "2024-05-01",
    dataFim: "2024-05-05",
    criadoEm: "2024-04-25",
    criadoPor: "Admin",
    observacoes: "Cardápio balanceado com foco em proteínas",
    refeicoes: [
      { dia: "Segunda", prato: "Arroz, Feijão, Frango Grelhado, Salada", calorias: 450, custo: 8.5 },
      { dia: "Terça", prato: "Macarrão, Carne Moída, Legumes", calorias: 420, custo: 7.8 },
      { dia: "Quarta", prato: "Arroz, Feijão, Peixe, Verduras", calorias: 380, custo: 9.2 },
      { dia: "Quinta", prato: "Risoto, Frango, Brócolis", calorias: 410, custo: 8.9 },
      { dia: "Sexta", prato: "Arroz, Feijão, Carne, Salada Mista", calorias: 460, custo: 8.7 },
    ],
  },
  {
    id: 2,
    nome: "Cardápio Semana 2 - Maio",
    periodo: "08/05 a 12/05/2024",
    status: "Pendente",
    tipo: "semanal",
    dataInicio: "2024-05-08",
    dataFim: "2024-05-12",
    criadoEm: "2024-05-01",
    criadoPor: "Nutricionista",
    refeicoes: [
      { dia: "Segunda", prato: "Arroz Integral, Feijão Preto, Peixe Assado", calorias: 420, custo: 9.0 },
      { dia: "Terça", prato: "Quinoa, Lentilha, Frango Desfiado", calorias: 390, custo: 8.2 },
    ],
  },
  {
    id: 3,
    nome: "Cardápio Mensal - Junho",
    periodo: "01/06 a 30/06/2024",
    status: "Rascunho",
    tipo: "mensal",
    dataInicio: "2024-06-01",
    dataFim: "2024-06-30",
    criadoEm: "2024-05-15",
    criadoPor: "Admin",
    refeicoes: [],
  },
]

const fichasTecnicas: FichaTecnica[] = [
  {
    id: 1,
    nome: "Arroz com Feijão",
    categoria: "Prato Principal",
    calorias: 280,
    proteinas: 12,
    carboidratos: 45,
    gorduras: 8,
    fibras: 6,
    custo: 2.5,
    rendimento: "10 porções",
    tempoPreparo: "45 minutos",
    ingredientes: [
      "2 xícaras de arroz",
      "1 xícara de feijão",
      "1 cebola média",
      "2 dentes de alho",
      "Óleo, sal e temperos",
    ],
    modoPreparo: [
      "Deixe o feijão de molho na véspera",
      "Cozinhe o feijão na panela de pressão por 20 minutos",
      "Refogue a cebola e alho no óleo",
      "Adicione o arroz e refogue por 2 minutos",
      "Adicione água quente e cozinhe por 18 minutos",
      "Tempere o feijão e sirva junto com o arroz",
    ],
    observacoes: "Rico em proteínas vegetais e fibras",
  },
  {
    id: 2,
    nome: "Frango Grelhado",
    categoria: "Proteína",
    calorias: 165,
    proteinas: 31,
    carboidratos: 0,
    gorduras: 4,
    fibras: 0,
    custo: 3.8,
    rendimento: "8 porções",
    tempoPreparo: "30 minutos",
    ingredientes: ["1kg de peito de frango", "Suco de 2 limões", "2 dentes de alho", "Sal, pimenta e ervas"],
    modoPreparo: [
      "Tempere o frango com sal, alho e limão",
      "Deixe marinar por 30 minutos",
      "Aqueça a grelha ou frigideira",
      "Grelhe por 6-8 minutos de cada lado",
      "Verifique se está bem cozido",
    ],
    observacoes: "Excelente fonte de proteína magra",
  },
  {
    id: 3,
    nome: "Salada Mista",
    categoria: "Acompanhamento",
    calorias: 25,
    proteinas: 2,
    carboidratos: 5,
    gorduras: 0,
    fibras: 3,
    custo: 1.2,
    rendimento: "12 porções",
    tempoPreparo: "15 minutos",
    ingredientes: ["2 pés de alface", "2 tomates", "1 cenoura", "1 pepino", "Azeite e vinagre"],
    modoPreparo: [
      "Lave bem todos os vegetais",
      "Corte a alface em pedaços",
      "Corte os tomates em fatias",
      "Rale a cenoura",
      "Corte o pepino em rodelas",
      "Tempere com azeite e vinagre",
    ],
    observacoes: "Rica em vitaminas e minerais",
  },
]

const usuariosIniciais: Usuario[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@escola.com",
    perfil: "Admin",
    status: "Ativo",
    ultimoAcesso: "2024-05-28",
    criadoEm: "2024-01-15",
    telefone: "(11) 99999-1111",
    departamento: "Administração",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@escola.com",
    perfil: "Nutricionista",
    status: "Ativo",
    ultimoAcesso: "2024-05-27",
    criadoEm: "2024-02-10",
    telefone: "(11) 99999-2222",
    departamento: "Nutrição",
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro.costa@escola.com",
    perfil: "Cozinheiro",
    status: "Ativo",
    ultimoAcesso: "2024-05-26",
    criadoEm: "2024-03-05",
    telefone: "(11) 99999-3333",
    departamento: "Cozinha",
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana.oliveira@escola.com",
    perfil: "Visualizador",
    status: "Inativo",
    ultimoAcesso: "2024-05-20",
    criadoEm: "2024-04-12",
    telefone: "(11) 99999-4444",
    departamento: "Secretaria",
  },
]

export default function CardapiosPage() {
  const [cardapios, setCardapios] = useState<Cardapio[]>(cardapiosIniciais)
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais)
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  })
  const [selectedCardapio, setSelectedCardapio] = useState<Cardapio | null>(null)
  const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFichaDialogOpen, setIsFichaDialogOpen] = useState(false)
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [isEditUsuarioDialogOpen, setIsEditUsuarioDialogOpen] = useState(false)
  const [editingCardapio, setEditingCardapio] = useState<Cardapio | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Rascunho":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case "Admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "Nutricionista":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cozinheiro":
        return "bg-green-100 text-green-800 border-green-200"
      case "Visualizador":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColorUsuario = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inativo":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }
    if (!formData.tipo) {
      errors.tipo = "Tipo é obrigatório"
    }
    if (!formData.dataInicio) {
      errors.dataInicio = "Data de início é obrigatória"
    }
    if (!formData.dataFim) {
      errors.dataFim = "Data de fim é obrigatória"
    }
    if (formData.dataInicio && formData.dataFim && formData.dataInicio > formData.dataFim) {
      errors.dataFim = "Data de fim deve ser posterior à data de início"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateCardapio = async () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Verifique os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoCardapio: Cardapio = {
        id: cardapios.length + 1,
        nome: formData.nome,
        periodo: `${formData.dataInicio} a ${formData.dataFim}`,
        status: "Rascunho",
        tipo: formData.tipo as "diario" | "semanal" | "mensal",
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        observacoes: formData.observacoes,
        criadoEm: new Date().toISOString().split("T")[0],
        criadoPor: "Usuário Atual",
        refeicoes: [],
      }

      setCardapios([...cardapios, novoCardapio])
      setFormData({ nome: "", tipo: "", dataInicio: "", dataFim: "", observacoes: "" })
      setFormErrors({})
      setIsDialogOpen(false)

      toast({
        title: "Sucesso!",
        description: "Cardápio criado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cardápio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCardapio = (id: number) => {
    const cardapio = cardapios.find((c) => c.id === id)
    if (cardapio) {
      setSelectedCardapio(cardapio)
      setIsViewDialogOpen(true)
    }
  }

  const handleEditCardapio = (id: number) => {
    const cardapio = cardapios.find((c) => c.id === id)
    if (cardapio) {
      setEditingCardapio({ ...cardapio })
      setIsEditDialogOpen(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingCardapio) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      setCardapios(cardapios.map((c) => (c.id === editingCardapio.id ? editingCardapio : c)))
      setIsEditDialogOpen(false)
      setEditingCardapio(null)

      toast({
        title: "Sucesso!",
        description: "Cardápio atualizado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cardápio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCardapio = async (id: number) => {
    const cardapio = cardapios.find((c) => c.id === id)
    if (!cardapio) return

    setIsLoading(true)
    try {
      const configuracaoSalva = localStorage.getItem("configuracoes")
      const configuracao = configuracaoSalva
        ? JSON.parse(configuracaoSalva)
        : {
            nomeEscola: "Escola Municipal Exemplo",
            cnpj: "12.345.678/0001-90",
            endereco: "Rua das Flores, 123",
            telefone: "(11) 1234-5678",
            email: "contato@escola.com",
            anoLetivo: "2024",
            diretor: "João Silva",
            nutricionista: "Maria Santos",
            cozinheiro: "Pedro Costa",
            logoEsquerda: "",
            logoDireita: "",
          }

      // Gerar PDF real
      const pdfBlob = await generateCardapioPDF(cardapio, configuracao)

      // Criar link para download
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cardapio-${cardapio.nome.toLowerCase().replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(a)
      a.click()

      // Limpar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download concluído!",
        description: "PDF do cardápio foi baixado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF do cardápio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicateCardapio = async (id: number) => {
    const cardapio = cardapios.find((c) => c.id === id)
    if (!cardapio) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const novoCardapio: Cardapio = {
        ...cardapio,
        id: cardapios.length + 1,
        nome: `${cardapio.nome} (Cópia)`,
        status: "Rascunho",
        criadoEm: new Date().toISOString().split("T")[0],
      }

      setCardapios([...cardapios, novoCardapio])

      toast({
        title: "Sucesso!",
        description: "Cardápio duplicado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao duplicar cardápio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCardapio = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cardápio?")) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCardapios(cardapios.filter((c) => c.id !== id))

      toast({
        title: "Sucesso!",
        description: "Cardápio excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cardápio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: "Rascunho" | "Pendente" | "Aprovado") => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCardapios(cardapios.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))

      toast({
        title: "Status atualizado!",
        description: `Cardápio marcado como ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalendarCardapioClick = (cardapioId: number) => {
    const cardapio = cardapios.find((c) => c.id === cardapioId)
    if (cardapio) {
      setSelectedCardapio(cardapio)
      setIsCalendarDialogOpen(true)
    }
  }

  const handleFichaClick = (fichaId: number) => {
    const ficha = fichasTecnicas.find((f) => f.id === fichaId)
    if (ficha) {
      setSelectedFicha(ficha)
      setIsFichaDialogOpen(true)
    }
  }

  // Funções para gerenciamento de usuários
  const handleEditUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id)
    if (usuario) {
      setEditingUsuario({ ...usuario })
      setIsEditUsuarioDialogOpen(true)
    }
  }

  const handleSaveUsuario = async () => {
    if (!editingUsuario) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      setUsuarios(usuarios.map((u) => (u.id === editingUsuario.id ? editingUsuario : u)))
      setIsEditUsuarioDialogOpen(false)
      setEditingUsuario(null)

      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUsuarioStatus = async (id: number) => {
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) return

    const novoStatus = usuario.status === "Ativo" ? "Inativo" : "Ativo"
    const acao = novoStatus === "Ativo" ? "ativar" : "desativar"

    if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, status: novoStatus } : u)))

      toast({
        title: "Status atualizado!",
        description: `Usuário ${novoStatus === "Ativo" ? "ativado" : "desativado"} com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do usuário",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Cardápios</h1>
          <p className="text-muted-foreground">Crie e gerencie cardápios semanais e mensais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cardápio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Cardápio</DialogTitle>
              <DialogDescription>Preencha as informações para criar um novo cardápio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cardápio *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Cardápio Semana 1"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={formErrors.nome ? "border-red-500" : ""}
                  />
                  {formErrors.nome && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.nome}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger className={formErrors.tipo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.tipo && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.tipo}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inicio">Data Início *</Label>
                  <Input
                    id="inicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    className={formErrors.dataInicio ? "border-red-500" : ""}
                  />
                  {formErrors.dataInicio && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.dataInicio}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fim">Data Fim *</Label>
                  <Input
                    id="fim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                    className={formErrors.dataFim ? "border-red-500" : ""}
                  />
                  {formErrors.dataFim && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.dataFim}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações sobre o cardápio..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateCardapio} disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Cardápio"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedCardapio?.nome}
            </DialogTitle>
            <DialogDescription>Visualização completa do cardápio</DialogDescription>
          </DialogHeader>
          {selectedCardapio && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Período</Label>
                  <p className="text-sm text-muted-foreground">{selectedCardapio.periodo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedCardapio.status)}>{selectedCardapio.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedCardapio.tipo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Criado por</Label>
                  <p className="text-sm text-muted-foreground">{selectedCardapio.criadoPor}</p>
                </div>
              </div>

              {selectedCardapio.observacoes && (
                <div>
                  <Label className="text-sm font-medium">Observações</Label>
                  <p className="text-sm text-muted-foreground">{selectedCardapio.observacoes}</p>
                </div>
              )}

              {selectedCardapio.refeicoes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Refeições</Label>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dia</TableHead>
                          <TableHead>Prato Principal</TableHead>
                          <TableHead>Calorias</TableHead>
                          <TableHead>Custo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCardapio.refeicoes.map((refeicao, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{refeicao.dia}</TableCell>
                            <TableCell>{refeicao.prato}</TableCell>
                            <TableCell>{refeicao.calorias} kcal</TableCell>
                            <TableCell>R$ {refeicao.custo?.toFixed(2) || "0,00"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Cardápio
            </DialogTitle>
          </DialogHeader>
          {editingCardapio && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Cardápio</Label>
                  <Input
                    value={editingCardapio.nome}
                    onChange={(e) =>
                      setEditingCardapio({
                        ...editingCardapio,
                        nome: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingCardapio.status}
                    onValueChange={(value: "Rascunho" | "Pendente" | "Aprovado") =>
                      setEditingCardapio({
                        ...editingCardapio,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rascunho">Rascunho</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={editingCardapio.observacoes || ""}
                  onChange={(e) =>
                    setEditingCardapio({
                      ...editingCardapio,
                      observacoes: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog do Calendário - CORRIGIDO PARA SER RESPONSIVO */}
      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalhes do Cardápio - {selectedCardapio?.nome}
            </DialogTitle>
            <DialogDescription>Informações completas do cardápio selecionado</DialogDescription>
          </DialogHeader>
          {selectedCardapio && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Período</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedCardapio.periodo}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ChefHat className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Tipo</span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{selectedCardapio.tipo}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(selectedCardapio.status)}>{selectedCardapio.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Status atual</p>
                  </CardContent>
                </Card>
              </div>

              {selectedCardapio.observacoes && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground">{selectedCardapio.observacoes}</p>
                  </CardContent>
                </Card>
              )}

              {selectedCardapio.refeicoes.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Refeições Programadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCardapio.refeicoes.map((refeicao, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <h5 className="font-medium text-green-600">{refeicao.dia}</h5>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {refeicao.calorias} kcal
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                R$ {refeicao.custo?.toFixed(2) || "0,00"}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{refeicao.prato}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Nenhuma refeição cadastrada</h4>
                    <p className="text-sm text-muted-foreground">Este cardápio ainda não possui refeições definidas.</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCalendarDialogOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => handleEditCardapio(selectedCardapio.id)}>Editar Cardápio</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog da Ficha Técnica - CORRIGIDO PARA SER RESPONSIVO */}
      <Dialog open={isFichaDialogOpen} onOpenChange={setIsFichaDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Ficha Técnica - {selectedFicha?.nome}
            </DialogTitle>
            <DialogDescription>Informações nutricionais e modo de preparo</DialogDescription>
          </DialogHeader>
          {selectedFicha && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedFicha.calorias}</div>
                    <div className="text-xs text-muted-foreground">Calorias (kcal)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">R$ {selectedFicha.custo.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Custo por porção</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-orange-600">{selectedFicha.rendimento}</div>
                    <div className="text-xs text-muted-foreground">Rendimento</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">{selectedFicha.tempoPreparo}</div>
                    <div className="text-xs text-muted-foreground">Tempo de preparo</div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações Nutricionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Nutricionais (por porção)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedFicha.proteinas}g</div>
                      <div className="text-sm text-muted-foreground">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedFicha.carboidratos}g</div>
                      <div className="text-sm text-muted-foreground">Carboidratos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedFicha.gorduras}g</div>
                      <div className="text-sm text-muted-foreground">Gorduras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedFicha.fibras}g</div>
                      <div className="text-sm text-muted-foreground">Fibras</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ingredientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedFicha.ingredientes.map((ingrediente, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{ingrediente}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Modo de Preparo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modo de Preparo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {selectedFicha.modoPreparo.map((passo, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{passo}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Observações */}
              {selectedFicha.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{selectedFicha.observacoes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsFichaDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição de Usuário */}
      <Dialog open={isEditUsuarioDialogOpen} onOpenChange={setIsEditUsuarioDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Usuário
            </DialogTitle>
            <DialogDescription>Edite as informações do usuário</DialogDescription>
          </DialogHeader>
          {editingUsuario && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={editingUsuario.nome}
                    onChange={(e) =>
                      setEditingUsuario({
                        ...editingUsuario,
                        nome: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingUsuario.email}
                    onChange={(e) =>
                      setEditingUsuario({
                        ...editingUsuario,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Perfil</Label>
                  <Select
                    value={editingUsuario.perfil}
                    onValueChange={(value: "Admin" | "Nutricionista" | "Cozinheiro" | "Visualizador") =>
                      setEditingUsuario({
                        ...editingUsuario,
                        perfil: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Nutricionista">Nutricionista</SelectItem>
                      <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                      <SelectItem value="Visualizador">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingUsuario.status}
                    onValueChange={(value: "Ativo" | "Inativo") =>
                      setEditingUsuario({
                        ...editingUsuario,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={editingUsuario.telefone || ""}
                    onChange={(e) =>
                      setEditingUsuario({
                        ...editingUsuario,
                        telefone: e.target.value,
                      })
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Input
                    value={editingUsuario.departamento || ""}
                    onChange={(e) =>
                      setEditingUsuario({
                        ...editingUsuario,
                        departamento: e.target.value,
                      })
                    }
                    placeholder="Ex: Administração"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={() => setIsEditUsuarioDialogOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveUsuario} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lista">Lista de Cardápios</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="fichas">Fichas Técnicas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {cardapios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cardápio encontrado</h3>
                <p className="text-muted-foreground text-center mb-4">Comece criando seu primeiro cardápio</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Cardápio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {cardapios.map((cardapio) => (
                <Card key={cardapio.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {cardapio.nome}
                        </CardTitle>
                        <CardDescription>
                          Período: {cardapio.periodo} • Tipo: {cardapio.tipo} • Criado por: {cardapio.criadoPor}
                        </CardDescription>
                        {cardapio.refeicoes.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {cardapio.refeicoes.length} refeição(ões) cadastrada(s)
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Select
                          value={cardapio.status}
                          onValueChange={(value: "Rascunho" | "Pendente" | "Aprovado") =>
                            handleStatusChange(cardapio.id, value)
                          }
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <Badge className={getStatusColor(cardapio.status)}>{cardapio.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rascunho">Rascunho</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCardapio(cardapio.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCardapio(cardapio.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicateCardapio(cardapio.id)}
                            title="Duplicar"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadCardapio(cardapio.id)}
                            title="Baixar PDF"
                            disabled={isLoading}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCardapio(cardapio.id)}
                            title="Excluir"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {cardapio.refeicoes.length > 0 && (
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Dia</TableHead>
                              <TableHead>Prato Principal</TableHead>
                              <TableHead>Calorias</TableHead>
                              <TableHead>Custo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cardapio.refeicoes.slice(0, 3).map((refeicao, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{refeicao.dia}</TableCell>
                                <TableCell>{refeicao.prato}</TableCell>
                                <TableCell>{refeicao.calorias} kcal</TableCell>
                                <TableCell>R$ {refeicao.custo?.toFixed(2) || "0,00"}</TableCell>
                              </TableRow>
                            ))}
                            {cardapio.refeicoes.length > 3 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                  +{cardapio.refeicoes.length - 3} refeição(ões) a mais...
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Cardápios</CardTitle>
              <CardDescription>Visualize os cardápios organizados por data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                <div className="font-semibold p-2">Dom</div>
                <div className="font-semibold p-2">Seg</div>
                <div className="font-semibold p-2">Ter</div>
                <div className="font-semibold p-2">Qua</div>
                <div className="font-semibold p-2">Qui</div>
                <div className="font-semibold p-2">Sex</div>
                <div className="font-semibold p-2">Sáb</div>

                {Array.from({ length: 35 }, (_, i) => {
                  const day = (i % 31) + 1
                  // Verificar se há cardápios para este dia
                  const cardapioParaDia = cardapios.find((c) => {
                    const dataInicio = new Date(c.dataInicio)
                    const dataFim = new Date(c.dataFim)
                    const diaAtual = new Date(2024, 4, day) // Maio 2024
                    return diaAtual >= dataInicio && diaAtual <= dataFim
                  })

                  return (
                    <div key={i} className="border rounded p-2 h-20 text-sm hover:bg-gray-50">
                      <div className="font-medium">{day}</div>
                      {cardapioParaDia && (
                        <div
                          className="text-xs text-green-600 mt-1 cursor-pointer hover:underline bg-green-50 rounded px-1 py-0.5 truncate"
                          onClick={() => handleCalendarCardapioClick(cardapioParaDia.id)}
                          title={cardapioParaDia.nome}
                        >
                          {cardapioParaDia.nome.length > 12
                            ? cardapioParaDia.nome.substring(0, 12) + "..."
                            : cardapioParaDia.nome}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fichas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fichas Técnicas</CardTitle>
              <CardDescription>Informações nutricionais e de custos das preparações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fichasTecnicas.map((ficha) => (
                    <Card key={ficha.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ChefHat className="h-5 w-5 text-green-600" />
                          {ficha.nome}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit">
                          {ficha.categoria}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Calorias:</span>
                            <span className="font-medium">{ficha.calorias} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Proteínas:</span>
                            <span className="font-medium">{ficha.proteinas}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carboidratos:</span>
                            <span className="font-medium">{ficha.carboidratos}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Custo por porção:</span>
                            <span className="font-medium text-green-600">R$ {ficha.custo.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tempo de preparo:</span>
                            <span className="font-medium text-blue-600">{ficha.tempoPreparo}</span>
                          </div>
                          <div className="pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => handleFichaClick(ficha.id)}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>Gerencie os usuários do sistema e suas permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{usuario.nome}</div>
                              {usuario.departamento && (
                                <div className="text-sm text-muted-foreground">{usuario.departamento}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <Badge className={getPerfilColor(usuario.perfil)}>{usuario.perfil}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColorUsuario(usuario.status)}>{usuario.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(usuario.ultimoAcesso).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUsuario(usuario.id)}
                                title="Editar usuário"
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={
                                  usuario.status === "Ativo"
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                }
                                onClick={() => handleToggleUsuarioStatus(usuario.id)}
                                title={usuario.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                                disabled={isLoading}
                              >
                                {usuario.status === "Ativo" ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
