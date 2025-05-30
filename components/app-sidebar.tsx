"use client"

import { Calendar, ChefHat, Package, BarChart3, Settings, Users, DollarSign, Home, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cardápios",
    url: "/dashboard/cardapios",
    icon: Calendar,
  },
  {
    title: "Alimentos",
    url: "/dashboard/alimentos",
    icon: ChefHat,
  },
  {
    title: "Estoque",
    url: "/dashboard/estoque",
    icon: Package,
  },
  {
    title: "Consumo",
    url: "/dashboard/consumo",
    icon: Users,
  },
  {
    title: "Relatórios",
    url: "/dashboard/relatorios",
    icon: BarChart3,
  },
  {
    title: "Custos",
    url: "/dashboard/custos",
    icon: DollarSign,
  },
  {
    title: "Configurações",
    url: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Gestão Alimentar</h2>
            <p className="text-sm text-gray-600">Sistema Escolar</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sair do Sistema
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
