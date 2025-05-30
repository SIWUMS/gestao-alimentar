#!/bin/bash
# Script completo para instalar Composer em qualquer ambiente

echo "📦 INSTALAÇÃO COMPLETA DO COMPOSER"
echo "=================================="

# Verificar diretório atual
echo "📁 Diretório atual: $(pwd)"
echo "👤 Usuário atual: $(whoami)"
echo ""

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# PASSO 1: Verificar se Composer já existe
echo "🔍 PASSO 1: Verificando Composer existente"
echo "------------------------------------------"

if command_exists composer; then
    echo "✅ Composer já instalado globalmente: $(composer --version)"
    exit 0
elif [ -f "composer.phar" ]; then
    echo "✅ composer.phar encontrado localmente"
    chmod +x composer.phar
    echo "💡 Use: php composer.phar install"
    exit 0
elif [ -f "/usr/local/bin/composer" ]; then
    echo "✅ Composer encontrado em /usr/local/bin/"
    echo "💡 Adicione ao PATH ou use: /usr/local/bin/composer"
    exit 0
else
    echo "❌ Composer não encontrado - prosseguindo com instalação"
fi

echo ""

# PASSO 2: Verificar pré-requisitos
echo "🔧 PASSO 2: Verificando pré-requisitos"
echo "--------------------------------------"

# Verificar PHP
if command_exists php; then
    PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
    echo "✅ PHP encontrado: $(php -v | head -n 1)"
    
    # Verificar versão mínima (7.4+)
    if php -r "exit(version_compare(PHP_VERSION, '7.4.0', '<') ? 1 : 0);"; then
        echo "❌ PHP versão muito antiga. Mínimo: 7.4.0"
        echo "💡 Atualize o PHP antes de continuar"
        exit 1
    else
        echo "✅ Versão do PHP compatível"
    fi
else
    echo "❌ PHP não encontrado"
    echo "💡 Instale PHP antes de continuar"
    exit 1
fi

# Verificar extensões necessárias
echo ""
echo "🔌 Verificando extensões PHP:"
REQUIRED_EXTENSIONS=("curl" "openssl" "phar" "json" "mbstring")
MISSING_EXTENSIONS=()

for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if php -m | grep -q "^$ext$"; then
        echo "✅ $ext"
    else
        echo "❌ $ext (faltando)"
        MISSING_EXTENSIONS+=("$ext")
    fi
done

if [ ${#MISSING_EXTENSIONS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️ Extensões faltando: ${MISSING_EXTENSIONS[*]}"
    echo "💡 Instale as extensões ou continue mesmo assim"
    read -p "Continuar mesmo assim? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# PASSO 3: Baixar Composer
echo "📥 PASSO 3: Baixando Composer"
echo "-----------------------------"

# Verificar ferramentas de download
if command_exists curl; then
    DOWNLOAD_CMD="curl -sS"
    echo "✅ Usando curl para download"
elif command_exists wget; then
    DOWNLOAD_CMD="wget -O -"
    echo "✅ Usando wget para download"
else
    echo "❌ Nem curl nem wget disponíveis"
    echo "💡 Instale curl ou wget, ou baixe manualmente"
    echo "   URL: https://getcomposer.org/composer.phar"
    exit 1
fi

# Baixar instalador do Composer
echo "🌐 Baixando instalador do Composer..."
$DOWNLOAD_CMD https://getcomposer.org/installer > composer-setup.php

if [ $? -eq 0 ] && [ -f "composer-setup.php" ]; then
    echo "✅ Instalador baixado com sucesso"
else
    echo "❌ Erro ao baixar instalador"
    echo "💡 Tentando download direto do composer.phar..."
    
    # Tentar download direto
    $DOWNLOAD_CMD https://getcomposer.org/composer.phar > composer.phar
    
    if [ $? -eq 0 ] && [ -f "composer.phar" ]; then
        chmod +x composer.phar
        echo "✅ composer.phar baixado diretamente"
        echo "💡 Use: php composer.phar install"
        rm -f composer-setup.php
        exit 0
    else
        echo "❌ Falha no download direto também"
        exit 1
    fi
fi

echo ""

# PASSO 4: Verificar integridade (opcional)
echo "🔐 PASSO 4: Verificando integridade"
echo "-----------------------------------"

# Baixar hash esperado
EXPECTED_CHECKSUM=$($DOWNLOAD_CMD https://composer.github.io/installer.sig 2>/dev/null)

if [ ! -z "$EXPECTED_CHECKSUM" ]; then
    ACTUAL_CHECKSUM=$(php -r "echo hash_file('sha384', 'composer-setup.php');")
    
    if [ "$EXPECTED_CHECKSUM" = "$ACTUAL_CHECKSUM" ]; then
        echo "✅ Checksum verificado com sucesso"
    else
        echo "⚠️ Checksum não confere - prosseguindo mesmo assim"
    fi
else
    echo "⚠️ Não foi possível verificar checksum - prosseguindo"
fi

echo ""

# PASSO 5: Instalar Composer
echo "⚙️ PASSO 5: Instalando Composer"
echo "-------------------------------"

# Executar instalador
php composer-setup.php --quiet

if [ $? -eq 0 ] && [ -f "composer.phar" ]; then
    echo "✅ Composer instalado com sucesso"
    chmod +x composer.phar
    
    # Limpar instalador
    rm -f composer-setup.php
    
    # Testar instalação
    echo "🧪 Testando instalação..."
    php composer.phar --version
    
    if [ $? -eq 0 ]; then
        echo "✅ Composer funcionando corretamente"
    else
        echo "❌ Erro ao testar Composer"
        exit 1
    fi
else
    echo "❌ Erro na instalação do Composer"
    rm -f composer-setup.php
    exit 1
fi

echo ""

# PASSO 6: Tentar instalação global (opcional)
echo "🌍 PASSO 6: Tentando instalação global"
echo "--------------------------------------"

# Verificar se temos permissões para instalar globalmente
if [ -w "/usr/local/bin" ]; then
    echo "📁 Movendo para /usr/local/bin/composer..."
    mv composer.phar /usr/local/bin/composer
    
    if [ $? -eq 0 ]; then
        echo "✅ Composer instalado globalmente"
        echo "💡 Agora você pode usar: composer install"
        
        # Testar comando global
        if command_exists composer; then
            echo "✅ Comando 'composer' disponível globalmente"
        else
            echo "⚠️ Comando global não funcionou - use caminho completo"
        fi
    else
        echo "❌ Erro ao mover para /usr/local/bin"
        echo "💡 Use: php composer.phar install"
    fi
elif [ -w "$HOME/bin" ] || mkdir -p "$HOME/bin" 2>/dev/null; then
    echo "📁 Movendo para $HOME/bin/composer..."
    mv composer.phar "$HOME/bin/composer"
    
    if [ $? -eq 0 ]; then
        echo "✅ Composer instalado em $HOME/bin"
        echo "💡 Adicione $HOME/bin ao seu PATH"
        echo "   export PATH=\"\$HOME/bin:\$PATH\""
    else
        echo "❌ Erro ao mover para $HOME/bin"
        echo "💡 Use: php composer.phar install"
    fi
else
    echo "ℹ️ Sem permissões para instalação global"
    echo "💡 Use: php composer.phar install"
fi

echo ""

# PASSO 7: Relatório final
echo "📊 RELATÓRIO FINAL"
echo "=================="

if [ -f "composer.phar" ]; then
    echo "✅ composer.phar disponível localmente"
    echo "   Comando: php composer.phar install"
fi

if command_exists composer; then
    echo "✅ Composer disponível globalmente"
    echo "   Comando: composer install"
    COMPOSER_CMD="composer"
elif [ -f "/usr/local/bin/composer" ]; then
    echo "✅ Composer em /usr/local/bin"
    echo "   Comando: /usr/local/bin/composer install"
    COMPOSER_CMD="/usr/local/bin/composer"
elif [ -f "$HOME/bin/composer" ]; then
    echo "✅ Composer em $HOME/bin"
    echo "   Comando: $HOME/bin/composer install"
    COMPOSER_CMD="$HOME/bin/composer"
elif [ -f "composer.phar" ]; then
    echo "✅ Composer local disponível"
    echo "   Comando: php composer.phar install"
    COMPOSER_CMD="php composer.phar"
else
    echo "❌ Nenhuma instalação do Composer encontrada"
    exit 1
fi

echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA!"
echo ""
echo "📋 Próximos passos:"
echo "1. Instalar dependências: $COMPOSER_CMD install"
echo "2. Otimizar autoload: $COMPOSER_CMD dump-autoload --optimize"
echo "3. Configurar Laravel: php artisan key:generate"

# Salvar comando do composer para uso posterior
echo "$COMPOSER_CMD" > .composer_command
echo ""
echo "💡 Comando salvo em .composer_command para scripts futuros"
