"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ChefHat, Users, BarChart3 } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "" })
  const router = useRouter()

  useEffect(() => {
    // Carregar configurações para o logo
    const configSalva = localStorage.getItem("configuracoes")
    if (configSalva) {
      const config = JSON.parse(configSalva)
      if (config.logoLogin) {
        setLogoLogin(config.logoLogin)
      }
      if (config.nomeEscola) {
        setNomeEscola(config.nomeEscola)
      }
    }
  }, [])

  // Adicionar estados para logo e nome da escola
  const [logoLogin, setLogoLogin] = useState("")
  const [nomeEscola, setNomeEscola] = useState("Sistema de Gestão Alimentar")

  const handleLogin = () => {
    // Simulação de login - em produção seria validado no backend
    if (credentials.email && credentials.password && credentials.role) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Usuário Sistema",
          email: credentials.email,
          role: credentials.role,
        }),
      )
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {logoLogin ? (
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
                <img
                  src={logoLogin || "/placeholder.svg"}
                  alt="Logo da Escola"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="bg-green-600 p-3 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{nomeEscola}</h1>
          <p className="text-gray-600 mt-2">Controle completo de refeições escolares</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Nível de Acesso</Label>
              <Select
                value={credentials.role}
                onValueChange={(value) => setCredentials({ ...credentials, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nível de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="nutricionista">Nutricionista</SelectItem>
                  <SelectItem value="estoquista">Estoquista</SelectItem>
                  <SelectItem value="servidor">Servidor de Apoio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
              Entrar no Sistema
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Gestão de Usuários</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Relatórios Avançados</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            <strong>Criado Por CB. Walison</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
