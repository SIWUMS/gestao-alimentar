#!/bin/bash
# Script para verificar e criar estrutura necessária do Laravel

echo "🔍 VERIFICAÇÃO DA ESTRUTURA DO PROJETO"
echo "====================================="

# Verificar diretório atual
echo "📁 Diretório atual: $(pwd)"
echo ""

# Função para criar diretório se não existir
criar_diretorio() {
    if [ ! -d "$1" ]; then
        echo "📁 Criando diretório: $1"
        mkdir -p "$1"
        if [ $? -eq 0 ]; then
            echo "✅ Diretório $1 criado com sucesso"
        else
            echo "❌ Erro ao criar diretório $1"
        fi
    else
        echo "✅ Diretório $1 já existe"
    fi
}

# Verificar e criar diretórios essenciais
echo "🏗️ VERIFICANDO ESTRUTURA DE DIRETÓRIOS:"
echo "--------------------------------------"

# Diretórios principais do Laravel
diretorios=(
    "storage"
    "storage/app"
    "storage/app/public"
    "storage/framework"
    "storage/framework/cache"
    "storage/framework/cache/data"
    "storage/framework/sessions"
    "storage/framework/views"
    "storage/logs"
    "bootstrap"
    "bootstrap/cache"
    "public"
    "app"
    "config"
    "database"
    "resources"
    "routes"
    "vendor"
)

for dir in "${diretorios[@]}"; do
    criar_diretorio "$dir"
done

echo ""
echo "🔐 CONFIGURANDO PERMISSÕES:"
echo "--------------------------"

# Configurar permissões
chmod -R 755 storage/ 2>/dev/null && echo "✅ Permissões do storage configuradas (755)" || echo "❌ Erro ao configurar permissões do storage"
chmod -R 755 bootstrap/cache/ 2>/dev/null && echo "✅ Permissões do bootstrap/cache configuradas (755)" || echo "❌ Erro ao configurar permissões do bootstrap/cache"

# Permissões específicas para logs e cache
chmod -R 777 storage/logs/ 2>/dev/null && echo "✅ Permissões dos logs configuradas (777)" || echo "❌ Erro ao configurar permissões dos logs"
chmod -R 777 storage/framework/ 2>/dev/null && echo "✅ Permissões do framework configuradas (777)" || echo "❌ Erro ao configurar permissões do framework"

echo ""
echo "📋 VERIFICAÇÃO FINAL:"
echo "--------------------"

# Verificar se os diretórios existem e têm as permissões corretas
verificar_permissao() {
    if [ -d "$1" ]; then
        perms=$(stat -c "%a" "$1" 2>/dev/null || stat -f "%A" "$1" 2>/dev/null)
        echo "✅ $1 - Permissões: $perms"
        
        # Testar escrita
        if [ -w "$1" ]; then
            echo "   ✅ Diretório tem permissão de escrita"
        else
            echo "   ❌ Diretório NÃO tem permissão de escrita"
        fi
    else
        echo "❌ $1 - Diretório não existe"
    fi
}

verificar_permissao "storage"
verificar_permissao "storage/logs"
verificar_permissao "storage/framework"
verificar_permissao "bootstrap/cache"

echo ""
echo "🔧 VERIFICANDO COMPOSER:"
echo "------------------------"

# Verificar se o composer está instalado
if command -v composer &> /dev/null; then
    echo "✅ Composer encontrado: $(composer --version)"
else
    echo "❌ Composer não encontrado"
    echo "💡 Soluções:"
    echo "   1. Instalar Composer globalmente"
    echo "   2. Usar composer.phar local"
    echo "   3. Fazer upload da pasta vendor manualmente"
fi

echo ""
echo "📄 VERIFICANDO ARQUIVOS ESSENCIAIS:"
echo "-----------------------------------"

arquivos_essenciais=(
    "artisan"
    "composer.json"
    ".env"
    "bootstrap/app.php"
    "public/index.php"
)

for arquivo in "${arquivos_essenciais[@]}"; do
    if [ -f "$arquivo" ]; then
        echo "✅ $arquivo existe"
    else
        echo "❌ $arquivo NÃO existe"
    fi
done

echo ""
echo "🎯 RESUMO E PRÓXIMOS PASSOS:"
echo "=============================="

if [ -d "storage" ] && [ -w "storage" ] && [ -d "bootstrap/cache" ] && [ -w "bootstrap/cache" ]; then
    echo "✅ Estrutura básica OK - Pode prosseguir com a instalação"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Configurar .env com dados do banco"
    echo "2. Instalar dependências: composer install"
    echo "3. Executar migrations: php artisan migrate"
    echo "4. Gerar chave: php artisan key:generate"
else
    echo "❌ Problemas encontrados - Corrija antes de prosseguir"
    echo ""
    echo "🔧 Execute os comandos de correção abaixo"
fi
