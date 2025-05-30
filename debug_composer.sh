#!/bin/bash
# Script de debug para problemas do composer

echo "🐛 DEBUG DO COMPOSER INSTALL"
echo "============================"

echo ""
echo "1. INFORMAÇÕES DO SISTEMA:"
echo "--------------------------"
echo "Usuário atual: $(whoami)"
echo "Diretório atual: $(pwd)"
echo "Versão do PHP: $(php -v | head -n 1)"
echo "Versão do Composer: $(composer --version 2>/dev/null || echo 'Composer não encontrado')"
echo ""

echo "2. ESTRUTURA DO DIRETÓRIO:"
echo "-------------------------"
ls -la
echo ""

echo "3. PROCURAR ARQUIVO ARTISAN:"
echo "---------------------------"
find . -name "artisan" -type f 2>/dev/null || echo "Arquivo artisan não encontrado no diretório atual"
echo ""

echo "4. VERIFICAR COMPOSER.JSON:"
echo "--------------------------"
if [ -f "composer.json" ]; then
    echo "✅ composer.json encontrado"
    echo "Conteúdo (primeiras linhas):"
    head -n 10 composer.json
else
    echo "❌ composer.json não encontrado"
fi
echo ""

echo "5. VERIFICAR VENDOR:"
echo "------------------"
if [ -d "vendor" ]; then
    echo "✅ Pasta vendor existe"
    echo "Tamanho: $(du -sh vendor/ 2>/dev/null || echo 'Erro ao calcular')"
else
    echo "❌ Pasta vendor não existe"
fi
echo ""

echo "6. VERIFICAR PERMISSÕES:"
echo "----------------------"
if [ -f "artisan" ]; then
    echo "Permissões do artisan: $(ls -la artisan)"
else
    echo "Arquivo artisan não encontrado"
fi
echo ""

echo "7. TENTAR COMPOSER INSTALL COM DEBUG:"
echo "------------------------------------"
echo "Executando: composer install --no-scripts -vvv"
echo ""
