"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, School, Mail, Palette, User, ChefHat, UserCheck, Upload, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

const usuarios = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@escola.com",
    cargo: "Diretor",
    status: "Ativo",
    ultimoAcesso: "2024-05-20",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@escola.com",
    cargo: "Nutricionista",
    status: "Ativo",
    ultimoAcesso: "2024-05-20",
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro@escola.com",
    cargo: "Cozinheiro",
    status: "Ativo",
    ultimoAcesso: "2024-05-19",
  },
]

export default function ConfiguracoesPage() {
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [configuracoes, setConfiguracoes] = useState({
    nomeEscola: "Escola Municipal Exemplo",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123",
    telefone: "(11) 1234-5678",
    email: "contato@escola.com",
    anoLetivo: "2024",
    corPrimaria: "#22c55e",
    corSecundaria: "#3b82f6",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    diretor: "João Silva",
    nutricionista: "Maria Santos",
    cozinheiro: "Pedro Costa",
    logoEsquerda: "",
    logoDireita: "",
    logoLogin: "",
    // Custos fixos - apenas salários
    salarioCozinheira: "2500.00",
    salarioAuxiliar1: "1800.00",
    salarioAuxiliar2: "1800.00",
    salarioAuxiliar3: "1800.00",
    salarioAuxiliar4: "1800.00",
  })

  const handleSaveConfig = () => {
    // Salvar configurações no localStorage
    localStorage.setItem("configuracoes", JSON.stringify(configuracoes))

    toast({
      title: "Configurações salvas!",
      description: "As configurações foram salvas com sucesso",
    })
  }

  const handleCreateUser = () => {
    alert("Usuário criado com sucesso!")
    setIsUserDialogOpen(false)
  }

  useEffect(() => {
    // Carregar configurações do localStorage
    const configSalva = localStorage.getItem("configuracoes")
    if (configSalva) {
      setConfiguracoes(JSON.parse(configSalva))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie usuários e configurações gerais do sistema</p>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="usuarios">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="escola">
            <School className="h-4 w-4 mr-2" />
            Dados da Escola
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Settings className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="equipe">
            <UserCheck className="h-4 w-4 mr-2" />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="custos">
            <DollarSign className="h-4 w-4 mr-2" />
            Custos Fixos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
              <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
            </div>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Users className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Ex: João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="joao@escola.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diretor">Diretor</SelectItem>
                          <SelectItem value="nutricionista">Nutricionista</SelectItem>
                          <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                          <SelectItem value="secretario">Secretário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha Temporária</Label>
                      <Input id="senha" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateUser}>
                      Criar Usuário
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/placeholder-icon.png?height=32&width=32&text=${usuario.nome.charAt(0)}`}
                            />
                            <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{usuario.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{usuario.cargo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{usuario.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(usuario.ultimoAcesso).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Desativar
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

        <TabsContent value="escola" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Escola</CardTitle>
              <CardDescription>Informações básicas da instituição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEscola">Nome da Escola</Label>
                  <Input
                    id="nomeEscola"
                    value={configuracoes.nomeEscola}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, nomeEscola: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={configuracoes.cnpj}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, cnpj: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={configuracoes.endereco}
                  onChange={(e) => setConfiguracoes({ ...configuracoes, endereco: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configuracoes.telefone}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, telefone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuracoes.email}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anoLetivo">Ano Letivo</Label>
                <Select
                  value={configuracoes.anoLetivo}
                  onValueChange={(value) => setConfiguracoes({ ...configuracoes, anoLetivo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>Personalize as cores do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="corPrimaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="corPrimaria"
                      type="color"
                      value={configuracoes.corPrimaria}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, corPrimaria: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={configuracoes.corPrimaria}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, corPrimaria: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corSecundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="corSecundaria"
                      type="color"
                      value={configuracoes.corSecundaria}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, corSecundaria: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={configuracoes.corSecundaria}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, corSecundaria: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configurações de Email
                </CardTitle>
                <CardDescription>Configure o SMTP para envio de emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={configuracoes.smtpHost}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta</Label>
                    <Input
                      id="smtpPort"
                      value={configuracoes.smtpPort}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, smtpPort: e.target.value })}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuário</Label>
                  <Input
                    id="smtpUser"
                    value={configuracoes.smtpUser}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, smtpUser: e.target.value })}
                    placeholder="seu-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={configuracoes.smtpPassword}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Logos do Sistema
              </CardTitle>
              <CardDescription>Configure os logos para relatórios e tela de login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoEsquerda">Logo Esquerda (Relatórios)</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoEsquerda"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setConfiguracoes({ ...configuracoes, logoEsquerda: e.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="flex-1"
                  />
                  {configuracoes.logoEsquerda && (
                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-50">
                      <img
                        src={configuracoes.logoEsquerda || "/placeholder.svg"}
                        alt="Logo Esquerda"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoDireita">Logo Direita (Relatórios)</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoDireita"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setConfiguracoes({ ...configuracoes, logoDireita: e.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="flex-1"
                  />
                  {configuracoes.logoDireita && (
                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-50">
                      <img
                        src={configuracoes.logoDireita || "/placeholder.svg"}
                        alt="Logo Direita"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoLogin">Logo Login</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoLogin"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setConfiguracoes({ ...configuracoes, logoLogin: e.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="flex-1"
                  />
                  {configuracoes.logoLogin && (
                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-50">
                      <img
                        src={configuracoes.logoLogin || "/placeholder.svg"}
                        alt="Logo Login"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Equipe</CardTitle>
              <CardDescription>Informações dos responsáveis pelo programa alimentar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <h3 className="font-semibold">Diretor</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diretor">Nome do Diretor</Label>
                    <Input
                      id="diretor"
                      value={configuracoes.diretor}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, diretor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    <h3 className="font-semibold">Nutricionista</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nutricionista">Nome do Nutricionista</Label>
                    <Input
                      id="nutricionista"
                      value={configuracoes.nutricionista}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, nutricionista: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    <h3 className="font-semibold">Cozinheiro</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cozinheiro">Nome do Cozinheiro</Label>
                    <Input
                      id="cozinheiro"
                      value={configuracoes.cozinheiro}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, cozinheiro: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Custos Fixos</CardTitle>
              <CardDescription>Configure os salários mensais da equipe de cozinha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    <h3 className="font-semibold">Cozinheiro Principal</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioCozinheira">Salário do Cozinheiro (R$)</Label>
                    <Input
                      id="salarioCozinheira"
                      type="number"
                      step="0.01"
                      value={configuracoes.salarioCozinheira}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, salarioCozinheira: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioAuxiliar1">Salário do Auxiliar 1 (R$)</Label>
                    <Input
                      id="salarioAuxiliar1"
                      type="number"
                      step="0.01"
                      value={configuracoes.salarioAuxiliar1 || "1800.00"}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, salarioAuxiliar1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioAuxiliar2">Salário do Auxiliar 2 (R$)</Label>
                    <Input
                      id="salarioAuxiliar2"
                      type="number"
                      step="0.01"
                      value={configuracoes.salarioAuxiliar2 || "1800.00"}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, salarioAuxiliar2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h3 className="font-semibold">Auxiliares de Cozinha</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioAuxiliar3">Salário do Auxiliar 3 (R$)</Label>
                    <Input
                      id="salarioAuxiliar3"
                      type="number"
                      step="0.01"
                      value={configuracoes.salarioAuxiliar3 || "1800.00"}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, salarioAuxiliar3: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioAuxiliar4">Salário do Auxiliar 4 (R$)</Label>
                    <Input
                      id="salarioAuxiliar4"
                      type="number"
                      step="0.01"
                      value={configuracoes.salarioAuxiliar4 || "1800.00"}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, salarioAuxiliar4: e.target.value })}
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Nota:</strong> O gás de cozinha deve ser registrado no módulo de Estoque como
                      entrada/consumo para cálculo preciso dos custos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Resumo de Custos Fixos Mensais (Salários)</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cozinheiro:</span>
                    <span>R$ {Number(configuracoes.salarioCozinheira || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliar 1:</span>
                    <span>R$ {Number(configuracoes.salarioAuxiliar1 || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliar 2:</span>
                    <span>R$ {Number(configuracoes.salarioAuxiliar2 || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliar 3:</span>
                    <span>R$ {Number(configuracoes.salarioAuxiliar3 || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliar 4:</span>
                    <span>R$ {Number(configuracoes.salarioAuxiliar4 || 0).toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Salários:</span>
                    <span>
                      R${" "}
                      {(
                        Number(configuracoes.salarioCozinheira || 0) +
                        Number(configuracoes.salarioAuxiliar1 || 0) +
                        Number(configuracoes.salarioAuxiliar2 || 0) +
                        Number(configuracoes.salarioAuxiliar3 || 0) +
                        Number(configuracoes.salarioAuxiliar4 || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    * Gás de cozinha será computado via consumo no estoque
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-700">
          <Settings className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
