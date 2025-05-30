#!/bin/bash
# Script para corrigir permissões do Laravel

echo "🔧 CORREÇÃO DE PERMISSÕES - LARAVEL"
echo "==================================="

# Verificar se estamos no diretório correto
if [ ! -f "artisan" ]; then
    echo "❌ Arquivo 'artisan' não encontrado!"
    echo "💡 Execute este script na pasta raiz do projeto Laravel"
    exit 1
fi

echo "✅ Projeto Laravel detectado"
echo ""

# Função para criar diretório com permissões
criar_e_configurar() {
    local dir="$1"
    local perm="$2"
    
    if [ ! -d "$dir" ]; then
        echo "📁 Criando: $dir"
        mkdir -p "$dir"
    fi
    
    echo "🔐 Configurando permissões: $dir ($perm)"
    chmod -R "$perm" "$dir"
    
    if [ $? -eq 0 ]; then
        echo "✅ $dir configurado com sucesso"
    else
        echo "❌ Erro ao configurar $dir"
    fi
}

# Criar e configurar diretórios essenciais
echo "🏗️ CRIANDO E CONFIGURANDO DIRETÓRIOS:"
echo "-------------------------------------"

# Storage e subdiretórios
criar_e_configurar "storage" "755"
criar_e_configurar "storage/app" "755"
criar_e_configurar "storage/app/public" "755"
criar_e_configurar "storage/framework" "777"
criar_e_configurar "storage/framework/cache" "777"
criar_e_configurar "storage/framework/cache/data" "777"
criar_e_configurar "storage/framework/sessions" "777"
criar_e_configurar "storage/framework/views" "777"
criar_e_configurar "storage/logs" "777"

# Bootstrap
criar_e_configurar "bootstrap" "755"
criar_e_configurar "bootstrap/cache" "777"

echo ""
echo "🔗 CRIANDO LINKS SIMBÓLICOS:"
echo "----------------------------"

# Link simbólico para storage público
if [ ! -L "public/storage" ]; then
    echo "🔗 Criando link: public/storage -> storage/app/public"
    ln -sf ../storage/app/public public/storage
    if [ $? -eq 0 ]; then
        echo "✅ Link simbólico criado"
    else
        echo "❌ Erro ao criar link simbólico"
    fi
else
    echo "✅ Link simbólico já existe"
fi

echo ""
echo "📝 CRIANDO ARQUIVOS NECESSÁRIOS:"
echo "--------------------------------"

# Criar .gitkeep nos diretórios vazios
touch storage/app/.gitkeep
touch storage/app/public/.gitkeep
touch storage/framework/cache/.gitkeep
touch storage/framework/cache/data/.gitkeep
touch storage/framework/sessions/.gitkeep
touch storage/framework/views/.gitkeep
touch storage/logs/.gitkeep
touch bootstrap/cache/.gitkeep

echo "✅ Arquivos .gitkeep criados"

# Criar arquivo de log se não existir
if [ ! -f "storage/logs/laravel.log" ]; then
    touch storage/logs/laravel.log
    chmod 666 storage/logs/laravel.log
    echo "✅ Arquivo de log criado"
fi

echo ""
echo "🧪 TESTANDO PERMISSÕES:"
echo "----------------------"

# Função para testar escrita
testar_escrita() {
    local dir="$1"
    local arquivo_teste="$dir/teste_escrita_$$"
    
    if echo "teste" > "$arquivo_teste" 2>/dev/null; then
        rm -f "$arquivo_teste"
        echo "✅ $dir - Escrita OK"
        return 0
    else
        echo "❌ $dir - Sem permissão de escrita"
        return 1
    fi
}

# Testar diretórios críticos
testar_escrita "storage"
testar_escrita "storage/logs"
testar_escrita "storage/framework"
testar_escrita "storage/framework/cache"
testar_escrita "storage/framework/sessions"
testar_escrita "storage/framework/views"
testar_escrita "bootstrap/cache"

echo ""
echo "📊 RELATÓRIO FINAL:"
echo "==================="

# Verificar proprietário dos arquivos
echo "👤 Proprietário dos arquivos:"
ls -la storage/ | head -3
echo ""

# Mostrar permissões atuais
echo "🔐 Permissões atuais:"
echo "storage/: $(stat -c '%a' storage/ 2>/dev/null || stat -f '%A' storage/ 2>/dev/null)"
echo "storage/logs/: $(stat -c '%a' storage/logs/ 2>/dev/null || stat -f '%A' storage/logs/ 2>/dev/null)"
echo "storage/framework/: $(stat -c '%a' storage/framework/ 2>/dev/null || stat -f '%A' storage/framework/ 2>/dev/null)"
echo "bootstrap/cache/: $(stat -c '%a' bootstrap/cache/ 2>/dev/null || stat -f '%A' bootstrap/cache/ 2>/dev/null)"

echo ""
echo "🎉 CORREÇÃO CONCLUÍDA!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verificar se o .env está configurado"
echo "2. Instalar dependências do Composer"
echo "3. Executar: php artisan key:generate"
echo "4. Executar: php artisan migrate"
