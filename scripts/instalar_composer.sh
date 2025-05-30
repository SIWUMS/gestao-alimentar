#!/bin/bash
# Script para instalar Composer se não estiver disponível

echo "📦 INSTALAÇÃO DO COMPOSER"
echo "========================="

# Verificar se o Composer já está instalado
if command -v composer &> /dev/null; then
    echo "✅ Composer já está instalado: $(composer --version)"
    exit 0
fi

# Verificar se composer.phar existe localmente
if [ -f "composer.phar" ]; then
    echo "✅ composer.phar encontrado localmente"
    echo "💡 Use: php composer.phar install"
    exit 0
fi

echo "📥 Composer não encontrado. Iniciando instalação..."

# Baixar e instalar Composer
echo "🌐 Baixando Composer..."

# Verificar se curl está disponível
if command -v curl &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
elif command -v wget &> /dev/null; then
    wget -O - https://getcomposer.org/installer | php
else
    echo "❌ Nem curl nem wget estão disponíveis"
    echo "💡 Baixe manualmente o composer.phar de https://getcomposer.org/download/"
    exit 1
fi

# Verificar se o download foi bem-sucedido
if [ -f "composer.phar" ]; then
    echo "✅ Composer baixado com sucesso"
    
    # Tornar executável
    chmod +x composer.phar
    
    # Testar instalação
    echo "🧪 Testando Composer..."
    php composer.phar --version
    
    if [ $? -eq 0 ]; then
        echo "✅ Composer funcionando corretamente"
        echo ""
        echo "📋 Para usar o Composer:"
        echo "   php composer.phar install"
        echo "   php composer.phar update"
        echo ""
        echo "💡 Para instalar globalmente (se tiver permissões):"
        echo "   sudo mv composer.phar /usr/local/bin/composer"
    else
        echo "❌ Erro ao testar Composer"
    fi
else
    echo "❌ Falha ao baixar Composer"
    echo "💡 Alternativas:"
    echo "1. Baixar manualmente de https://getcomposer.org/download/"
    echo "2. Fazer upload da pasta vendor completa"
    echo "3. Usar Composer via cPanel se disponível"
fi
