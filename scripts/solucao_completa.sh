#!/bin/bash
# Script completo para resolver todos os problemas

echo "🚀 SOLUÇÃO COMPLETA - SISTEMA DE GESTÃO ALIMENTAR"
echo "================================================="

# Verificar se estamos no lugar certo
if [ ! -f "artisan" ]; then
    echo "❌ Execute este script na pasta raiz do projeto Laravel"
    exit 1
fi

echo "✅ Projeto Laravel detectado"
echo ""

# PASSO 1: Criar estrutura de diretórios
echo "📁 PASSO 1: Criando estrutura de diretórios"
echo "-------------------------------------------"

mkdir -p storage/{app/public,framework/{cache/data,sessions,views},logs}
mkdir -p bootstrap/cache

echo "✅ Diretórios criados"

# PASSO 2: Configurar permissões
echo ""
echo "🔐 PASSO 2: Configurando permissões"
echo "-----------------------------------"

chmod -R 755 storage/
chmod -R 777 storage/logs/
chmod -R 777 storage/framework/
chmod -R 755 bootstrap/
chmod -R 777 bootstrap/cache/

echo "✅ Permissões configuradas"

# PASSO 3: Criar arquivos necessários
echo ""
echo "📄 PASSO 3: Criando arquivos necessários"
echo "----------------------------------------"

# Criar .gitkeep
touch storage/app/.gitkeep
touch storage/app/public/.gitkeep
touch storage/framework/cache/.gitkeep
touch storage/framework/cache/data/.gitkeep
touch storage/framework/sessions/.gitkeep
touch storage/framework/views/.gitkeep
touch storage/logs/.gitkeep
touch bootstrap/cache/.gitkeep

# Criar arquivo de log
touch storage/logs/laravel.log
chmod 666 storage/logs/laravel.log

echo "✅ Arquivos criados"

# PASSO 4: Verificar/Instalar Composer
echo ""
echo "📦 PASSO 4: Verificando Composer"
echo "--------------------------------"

if command -v composer &> /dev/null; then
    echo "✅ Composer encontrado globalmente"
    COMPOSER_CMD="composer"
elif [ -f "composer.phar" ]; then
    echo "✅ composer.phar encontrado"
    COMPOSER_CMD="php composer.phar"
else
    echo "📥 Baixando Composer..."
    if command -v curl &> /dev/null; then
        curl -sS https://getcomposer.org/installer | php
    elif command -v wget &> /dev/null; then
        wget -O - https://getcomposer.org/installer | php
    else
        echo "❌ Não foi possível baixar Composer automaticamente"
        echo "💡 Baixe manualmente de https://getcomposer.org/download/"
        COMPOSER_CMD=""
    fi
    
    if [ -f "composer.phar" ]; then
        chmod +x composer.phar
        COMPOSER_CMD="php composer.phar"
        echo "✅ Composer baixado com sucesso"
    fi
fi

# PASSO 5: Instalar dependências (se Composer disponível)
if [ ! -z "$COMPOSER_CMD" ]; then
    echo ""
    echo "📚 PASSO 5: Instalando dependências"
    echo "-----------------------------------"
    
    if [ ! -d "vendor" ]; then
        echo "📦 Executando: $COMPOSER_CMD install"
        $COMPOSER_CMD install --optimize-autoloader --no-dev
        
        if [ $? -eq 0 ]; then
            echo "✅ Dependências instaladas"
        else
            echo "❌ Erro ao instalar dependências"
        fi
    else
        echo "✅ Pasta vendor já existe"
    fi
fi

# PASSO 6: Configurar Laravel
echo ""
echo "⚙️ PASSO 6: Configurando Laravel"
echo "--------------------------------"

# Verificar se .env existe
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado a partir do .env.example"
    else
        echo "⚠️ Arquivo .env não encontrado - crie manualmente"
    fi
fi

# Gerar chave da aplicação (se possível)
if [ ! -z "$COMPOSER_CMD" ] && [ -d "vendor" ]; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --force
    
    if [ $? -eq 0 ]; then
        echo "✅ Chave gerada"
    else
        echo "❌ Erro ao gerar chave"
    fi
fi

# PASSO 7: Teste final
echo ""
echo "🧪 PASSO 7: Teste final"
echo "----------------------"

# Testar escrita nos diretórios
testar_escrita() {
    local dir="$1"
    local arquivo_teste="$dir/teste_$$"
    
    if echo "teste" > "$arquivo_teste" 2>/dev/null; then
        rm -f "$arquivo_teste"
        echo "✅ $dir - OK"
        return 0
    else
        echo "❌ $dir - ERRO"
        return 1
    fi
}

echo "Testando permissões de escrita:"
testar_escrita "storage"
testar_escrita "storage/logs"
testar_escrita "storage/framework"
testar_escrita "bootstrap/cache"

# RELATÓRIO FINAL
echo ""
echo "📊 RELATÓRIO FINAL"
echo "=================="

if [ -d "storage" ] && [ -w "storage" ] && [ -d "bootstrap/cache" ] && [ -w "bootstrap/cache" ]; then
    echo "🎉 SUCESSO! Sistema configurado corretamente"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. ✅ Estrutura de diretórios criada"
    echo "2. ✅ Permissões configuradas"
    
    if [ ! -z "$COMPOSER_CMD" ]; then
        echo "3. ✅ Composer disponível"
        if [ -d "vendor" ]; then
            echo "4. ✅ Dependências instaladas"
        else
            echo "4. ⚠️ Execute: $COMPOSER_CMD install"
        fi
    else
        echo "3. ⚠️ Instale Composer ou faça upload da pasta vendor"
    fi
    
    echo ""
    echo "🌐 Para finalizar a instalação:"
    echo "1. Configure o arquivo .env com dados do banco"
    echo "2. Execute: php artisan migrate --seed"
    echo "3. Acesse o sistema via browser"
    
else
    echo "❌ PROBLEMAS ENCONTRADOS"
    echo ""
    echo "🔧 Execute manualmente:"
    echo "chmod -R 755 storage/"
    echo "chmod -R 777 storage/logs/"
    echo "chmod -R 777 storage/framework/"
    echo "chmod -R 777 bootstrap/cache/"
fi

echo ""
echo "💡 Em caso de problemas, execute:"
echo "   bash scripts/verificar_estrutura.sh"
echo "   php scripts/verificar_sistema.php"
