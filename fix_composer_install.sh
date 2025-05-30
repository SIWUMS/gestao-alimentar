#!/bin/bash
# Script para corrigir problemas do composer install

echo "🔧 Diagnóstico e Correção do Composer Install"
echo "=============================================="

# 1. Verificar diretório atual
echo "📁 Diretório atual:"
pwd
echo ""

# 2. Listar arquivos para verificar se estamos na pasta correta
echo "📋 Arquivos no diretório atual:"
ls -la
echo ""

# 3. Procurar pelo arquivo artisan
echo "🔍 Procurando arquivo artisan:"
find . -name "artisan" -type f 2>/dev/null
echo ""

# 4. Verificar se existe composer.json
echo "📄 Verificando composer.json:"
if [ -f "composer.json" ]; then
    echo "✅ composer.json encontrado"
else
    echo "❌ composer.json NÃO encontrado"
fi
echo ""

# 5. Verificar estrutura do Laravel
echo "🏗️ Verificando estrutura do Laravel:"
for dir in app config database resources routes storage; do
    if [ -d "$dir" ]; then
        echo "✅ Pasta $dir encontrada"
    else
        echo "❌ Pasta $dir NÃO encontrada"
    fi
done
echo ""

echo "💡 Soluções possíveis:"
echo "1. Navegue para a pasta correta do projeto"
echo "2. Execute os comandos de correção abaixo"
