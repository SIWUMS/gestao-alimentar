# 🍽️ Sistema de Gestão Alimentar

Sistema completo para gestão de alimentação escolar e institucional.

## 🚀 Deploy Automático

Este projeto possui deploy automático configurado via GitHub Actions.

### 📋 Pré-requisitos

- VPS Ubuntu 20.04+
- Domínio configurado: `gestor.emmvmfc.com.br`
- Secrets configurados no GitHub

### 🔧 Configuração dos Secrets

No GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

\`\`\`
VPS_HOST=SEU_IP_VPS
VPS_USER=gestao
VPS_PATH=/var/www/html/cardapio
VPS_SSH_KEY=SUA_CHAVE_SSH_PRIVADA
SLACK_WEBHOOK=SEU_WEBHOOK_SLACK (opcional)
\`\`\`

### 🌊 Fluxo de Deploy

1. **Push para `main`** → Deploy automático para produção
2. **Pull Request** → Executa testes automaticamente
3. **Schedule diário** → Backup automático

### 📊 Status

[![Deploy](https://github.com/SIWUMS/gestao-alimentar/workflows/Deploy%20para%20VPS/badge.svg)](https://github.com/SIWUMS/gestao-alimentar/actions)
[![Security](https://github.com/SIWUMS/gestao-alimentar/workflows/Verificações%20de%20Segurança/badge.svg)](https://github.com/SIWUMS/gestao-alimentar/actions)

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Clonar repositório
git clone https://github.com/SIWUMS/gestao-alimentar.git
cd gestao-alimentar

# Instalar dependências
composer install
npm install

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Executar migrations
php artisan migrate

# Iniciar servidor
php artisan serve
npm run dev
\`\`\`

## 📚 Documentação

- [Instalação VPS](docs/INSTALACAO_VPS.md)
- [Configuração GitHub](docs/GITHUB_CONFIG.md)
- [API Documentation](docs/API.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🔒 Segurança

- SSL automático via Let's Encrypt
- Firewall configurado
- Fail2Ban ativo
- Backup automático diário
- Monitoramento contínuo

## 📞 Suporte

- 🌐 Site: https://gestor.emmvmfc.com.br
- 📧 Email: admin@emmvmfc.com.br
- 📱 WhatsApp: (XX) XXXXX-XXXX

---

**🎉 Sistema desenvolvido com ❤️ para gestão alimentar eficiente!**
\`\`\`

```shellscript file="scripts/setup_github.sh"
#!/bin/bash

# ========================================
# SCRIPT PARA CONFIGURAR GITHUB
# ========================================

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🐙 CONFIGURAÇÃO DO GITHUB"
echo "=========================================="
echo -e "${NC}"

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado${NC}"
    exit 1
fi

# Configurar Git (se não estiver configurado)
if [ -z "$(git config --global user.name)" ]; then
    read -p "📝 Digite seu nome para o Git: " git_name
    git config --global user.name "$git_name"
fi

if [ -z "$(git config --global user.email)" ]; then
    read -p "📧 Digite seu email para o Git: " git_email
    git config --global user.email "$git_email"
fi

echo -e "${GREEN}✅ Git configurado${NC}"

# Inicializar repositório se não existir
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}🔄 Inicializando repositório Git...${NC}"
    git init
    git branch -M main
fi

# Adicionar arquivos
echo -e "${YELLOW}📁 Adicionando arquivos ao Git...${NC}"
git add .
git commit -m "🚀 Configuração inicial do sistema"

echo -e "${GREEN}✅ Repositório Git configurado${NC}"

# Instruções para GitHub
echo -e "${BLUE}=========================================="
echo "📋 PRÓXIMOS PASSOS NO GITHUB:"
echo "=========================================="
echo -e "${NC}"

echo "1️⃣ Criar repositório no GitHub:"
echo "   • Acesse: https://github.com/new"
echo "   • Nome: gestao-alimentar"
echo "   • Descrição: Sistema de Gestão Alimentar"
echo "   • Público ou Privado (sua escolha)"
echo "   • NÃO inicialize com README"
echo ""

echo "2️⃣ Conectar repositório local:"
echo "   git remote add origin https://github.com/SIWUMS/gestao-alimentar.git"
echo "   git push -u origin main"
echo ""

echo "3️⃣ Configurar Secrets (Settings > Secrets and variables > Actions):"
echo "   • VPS_HOST: $(curl -s ifconfig.me)"
echo "   • VPS_USER: gestao"
echo "   • VPS_PATH: /var/www/html/cardapio"
echo "   • VPS_SSH_KEY: [sua chave SSH privada]"
echo ""

echo "4️⃣ Gerar chave SSH (se não tiver):"
echo "   ssh-keygen -t rsa -b 4096 -C 'deploy@gestao-alimentar'"
echo "   cat ~/.ssh/id_rsa.pub  # Adicionar ao servidor"
echo "   cat ~/.ssh/id_rsa      # Adicionar como VPS_SSH_KEY"
echo ""

echo "5️⃣ Configurar branch protection (Settings > Branches):"
echo "   • Proteger branch 'main'"
echo "   • Require pull request reviews"
echo "   • Require status checks"
echo ""

echo -e "${GREEN}🎉 Configuração do GitHub concluída!${NC}"


SISTEMA DE GESTÃO DE ALIMENTAÇÃO ESCOLAR


## 💡 **Estrutura**

### **🎨 Frontend - TypeScript React**

- ✅ **Tipagem forte** - Menos erros
- ✅ **Componentes reutilizáveis** - Código limpo
- ✅ **Performance** - Renderização otimizada
- ✅ **Experiência do usuário** - Interface moderna


### **⚙️ Backend - PHP Laravel**

- ✅ **Maturidade** - Framework estável
- ✅ **Ecosystem** - Muitas bibliotecas
- ✅ **ORM Eloquent** - Fácil manipulação de dados
- ✅ **Segurança** - Proteções built-in


### **🗄️ Banco - MySQL**

- ✅ **Confiabilidade** - Amplamente usado
- ✅ **Performance** - Otimizado para aplicações web
- ✅ **Suporte** - Documentação extensa

📱 Frontend (TypeScript React)
app/
├── dashboard/
│   ├── page.tsx                 # TypeScript React
│   ├── alimentos/page.tsx       # TypeScript React
│   ├── estoque/page.tsx         # TypeScript React
│   ├── cardapios/page.tsx       # TypeScript React
│   ├── custos/page.tsx          # TypeScript React
│   ├── relatorios/page.tsx      # TypeScript React
│   └── configuracoes/page.tsx   # TypeScript React
├── layout.tsx                   # TypeScript React
└── page.tsx                     # TypeScript React

components/
├── app-sidebar.tsx              # TypeScript React
└── ui/                          # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── table.tsx
    └── ...

utils/
├── pdf-generator.ts             # TypeScript
└── custo-calculator.ts          # TypeScript

🔧 Backend (PHP Laravel)
app/
├── Http/Controllers/
│   ├── DashboardController.php      # PHP
│   ├── AlimentoController.php       # PHP
│   ├── EstoqueController.php        # PHP
│   ├── CardapioController.php       # PHP
│   └── RelatorioController.php      # PHP
├── Models/
│   ├── User.php                     # PHP
│   ├── Alimento.php                 # PHP
│   ├── Estoque.php                  # PHP
│   └── Consumo.php                  # PHP
└── Mail/
    └── EstoqueAlerta.php            # PHP

database/migrations/
├── create_users_table.php           # PHP
├── create_alimentos_table.php       # PHP
├── create_estoque_table.php         # PHP
└── ...

resources/views/
├── layouts/app.blade.php            # Blade (PHP)
├── dashboard/index.blade.php        # Blade (PHP)
└── emails/estoque-alerta.blade.php  # Blade (PHP)

routes/
└── web.php                          # PHP

🗄️ Banco de Dados
database/
├── migrations/                      # PHP (Laravel Migrations)
└── seeders/                         # PHP (Laravel Seeders)

⚙️ Configuração e Scripts
scripts/
├── install_contabo_vps.sh          # Shell Script (Bash)
├── deploy_sistema.sh               # Shell Script (Bash)
├── ssl_setup.sh                    # Shell Script (Bash)
└── verificar_sistema.php           # PHP

config/
├── app.php                         # PHP
├── database.php                    # PHP
└── mail.php                        # PHP
.env                                # Environment Variables
composer.json                       # PHP Dependencies
package.json                        # Node.js Dependencies (se houver)

🎯 **Resumo das Tecnologias**
| Componente | Linguagem | Framework/Biblioteca
|-----|-----|-----
| **Interface do Usuário** | TypeScript React | Next.js + shadcn/ui
| **API/Backend** | PHP | Laravel
| **Banco de Dados** | SQL | MySQL
| **Estilização** | CSS | Tailwind CSS
| **Scripts de Deploy** | Shell Script | Bash
| **Configuração** | YAML/ENV | Docker/Environment


🌐 URL: https://gestor.emmvmfc.com.br
👤 Email: admin@emmvmfc.com.br
🔑 Senha: Admin123!@#

