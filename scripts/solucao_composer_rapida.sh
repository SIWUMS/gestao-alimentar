#!/bin/bash
# Solução rápida para instalar Composer e dependências

echo "⚡ SOLUÇÃO RÁPIDA - COMPOSER + DEPENDÊNCIAS"
echo "=========================================="

# Verificar se estamos no lugar certo
if [ ! -f "composer.json" ]; then
    echo "❌ Execute na pasta raiz do projeto Laravel"
    exit 1
fi

echo "✅ Projeto Laravel detectado"
echo ""

# MÉTODO 1: Tentar Composer global
echo "🔍 Método 1: Verificando Composer global..."
if command -v composer >/dev/null 2>&1; then
    echo "✅ Composer global encontrado!"
    composer install --optimize-autoloader --no-dev
    if [ $? -eq 0 ]; then
        echo "🎉 Dependências instaladas com sucesso!"
        exit 0
    fi
fi

# MÉTODO 2: Baixar e usar composer.phar
echo "📥 Método 2: Baixando composer.phar..."
if command -v curl >/dev/null 2>&1; then
    curl -sS https://getcomposer.org/composer.phar -o composer.phar
elif command -v wget >/dev/null 2>&1; then
    wget https://getcomposer.org/composer.phar
else
    echo "❌ Nem curl nem wget disponíveis"
    exit 1
fi

if [ -f "composer.phar" ]; then
    chmod +x composer.phar
    echo "✅ composer.phar baixado!"
    
    # Instalar dependências
    echo "📦 Instalando dependências..."
    php composer.phar install --optimize-autoloader --no-dev
    
    if [ $? -eq 0 ]; then
        echo "🎉 Dependências instaladas com sucesso!"
        echo "💡 Use: php composer.phar [comando]"
        exit 0
    else
        echo "❌ Erro na instalação - tentando sem scripts..."
        php composer.phar install --no-scripts --optimize-autoloader --no-dev
        
        if [ $? -eq 0 ]; then
            echo "🎉 Dependências instaladas (sem scripts)!"
            php composer.phar dump-autoload --optimize
            exit 0
        fi
    fi
fi

echo "❌ Todas as tentativas falharam"
echo ""
echo "💡 SOLUÇÕES MANUAIS:"
echo "1. Baixe composer.phar de https://getcomposer.org/download/"
echo "2. Faça upload da pasta vendor de outro projeto Laravel"
echo "3. Use cPanel Composer se disponível"
echo "4. Entre em contato com suporte da hospedagem"
