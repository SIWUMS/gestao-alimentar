#!/bin/bash
# Script para instalar dependências do Laravel após ter o Composer

echo "📚 INSTALAÇÃO DE DEPENDÊNCIAS DO LARAVEL"
echo "========================================"

# Verificar se estamos no diretório correto
if [ ! -f "composer.json" ]; then
    echo "❌ Arquivo composer.json não encontrado!"
    echo "💡 Execute este script na pasta raiz do projeto Laravel"
    exit 1
fi

echo "✅ Projeto Laravel detectado"
echo ""

# Função para detectar comando do Composer
detectar_composer() {
    # Verificar se existe arquivo com comando salvo
    if [ -f ".composer_command" ]; then
        COMPOSER_CMD=$(cat .composer_command)
        echo "📋 Usando comando salvo: $COMPOSER_CMD"
        return 0
    fi
    
    # Verificar composer global
    if command -v composer >/dev/null 2>&1; then
        COMPOSER_CMD="composer"
        echo "✅ Composer global encontrado"
        return 0
    fi
    
    # Verificar composer.phar local
    if [ -f "composer.phar" ]; then
        COMPOSER_CMD="php composer.phar"
        echo "✅ composer.phar local encontrado"
        return 0
    fi
    
    # Verificar em locais comuns
    if [ -f "/usr/local/bin/composer" ]; then
        COMPOSER_CMD="/usr/local/bin/composer"
        echo "✅ Composer encontrado em /usr/local/bin"
        return 0
    fi
    
    if [ -f "$HOME/bin/composer" ]; then
        COMPOSER_CMD="$HOME/bin/composer"
        echo "✅ Composer encontrado em $HOME/bin"
        return 0
    fi
    
    echo "❌ Composer não encontrado!"
    echo "💡 Execute primeiro: bash scripts/instalar_composer_completo.sh"
    return 1
}

# Detectar Composer
if ! detectar_composer; then
    exit 1
fi

echo "🔧 Comando do Composer: $COMPOSER_CMD"
echo ""

# Verificar versão do Composer
echo "📦 Verificando versão do Composer..."
$COMPOSER_CMD --version

if [ $? -ne 0 ]; then
    echo "❌ Erro ao executar Composer"
    echo "💡 Verifique se o Composer está funcionando corretamente"
    exit 1
fi

echo ""

# Limpar instalações anteriores se necessário
echo "🧹 Limpando instalações anteriores..."

if [ -d "vendor" ]; then
    echo "🗑️ Removendo pasta vendor existente..."
    rm -rf vendor/
fi

if [ -f "composer.lock" ]; then
    echo "🗑️ Removendo composer.lock existente..."
    rm -f composer.lock
fi

echo "✅ Limpeza concluída"
echo ""

# Instalar dependências
echo "📦 INSTALANDO DEPENDÊNCIAS..."
echo "=============================="

# Tentar diferentes métodos de instalação
install_attempts=0
max_attempts=3

while [ $install_attempts -lt $max_attempts ]; do
    install_attempts=$((install_attempts + 1))
    echo "🔄 Tentativa $install_attempts de $max_attempts"
    
    case $install_attempts in
        1)
            echo "📋 Método 1: Instalação padrão otimizada"
            $COMPOSER_CMD install --optimize-autoloader --no-dev --prefer-dist
            ;;
        2)
            echo "📋 Método 2: Instalação sem scripts"
            $COMPOSER_CMD install --no-scripts --optimize-autoloader --no-dev --prefer-dist
            ;;
        3)
            echo "📋 Método 3: Instalação ignorando requisitos de plataforma"
            $COMPOSER_CMD install --no-scripts --optimize-autoloader --no-dev --prefer-dist --ignore-platform-reqs
            ;;
    esac
    
    # Verificar se a instalação foi bem-sucedida
    if [ $? -eq 0 ] && [ -d "vendor" ] && [ -f "vendor/autoload.php" ]; then
        echo "✅ Dependências instaladas com sucesso!"
        break
    else
        echo "❌ Tentativa $install_attempts falhou"
        
        if [ $install_attempts -lt $max_attempts ]; then
            echo "⏳ Tentando método alternativo..."
            echo ""
        else
            echo "❌ Todas as tentativas falharam"
            echo ""
            echo "💡 SOLUÇÕES ALTERNATIVAS:"
            echo "1. Verificar conexão com internet"
            echo "2. Limpar cache do Composer: $COMPOSER_CMD clear-cache"
            echo "3. Atualizar Composer: $COMPOSER_CMD self-update"
            echo "4. Fazer upload manual da pasta vendor"
            exit 1
        fi
    fi
done

echo ""

# Executar scripts pós-instalação se necessário
if [ $install_attempts -eq 2 ] || [ $install_attempts -eq 3 ]; then
    echo "🔧 Executando scripts pós-instalação..."
    
    # Gerar autoload
    $COMPOSER_CMD dump-autoload --optimize
    
    if [ $? -eq 0 ]; then
        echo "✅ Autoload gerado com sucesso"
    else
        echo "⚠️ Erro ao gerar autoload - mas dependências estão instaladas"
    fi
fi

echo ""

# Verificar instalação
echo "🔍 VERIFICANDO INSTALAÇÃO..."
echo "============================"

# Verificar pasta vendor
if [ -d "vendor" ]; then
    vendor_size=$(du -sh vendor/ 2>/dev/null | cut -f1)
    echo "✅ Pasta vendor criada (tamanho: $vendor_size)"
else
    echo "❌ Pasta vendor não foi criada"
    exit 1
fi

# Verificar autoload
if [ -f "vendor/autoload.php" ]; then
    echo "✅ Autoload disponível"
else
    echo "❌ Autoload não encontrado"
    exit 1
fi

# Verificar Laravel
if [ -f "vendor/laravel/framework/src/Illuminate/Foundation/Application.php" ]; then
    echo "✅ Laravel Framework instalado"
else
    echo "❌ Laravel Framework não encontrado"
fi

# Contar pacotes instalados
if [ -f "composer.lock" ]; then
    package_count=$(grep -c '"name":' composer.lock 2>/dev/null || echo "N/A")
    echo "📦 Pacotes instalados: $package_count"
fi

echo ""

# Próximos passos
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. ✅ Dependências instaladas"
echo "2. 🔑 Gerar chave: php artisan key:generate"
echo "3. ⚙️ Configurar .env com dados do banco"
echo "4. 🗄️ Executar migrations: php artisan migrate --seed"
echo "5. 🌐 Testar aplicação: php artisan serve"

echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "=================="
echo "• Atualizar dependências: $COMPOSER_CMD update"
echo "• Limpar cache: $COMPOSER_CMD clear-cache"
echo "• Otimizar autoload: $COMPOSER_CMD dump-autoload --optimize"
echo "• Verificar dependências: $COMPOSER_CMD show"

# Salvar comando para uso futuro
echo "$COMPOSER_CMD" > .composer_command
echo ""
echo "💾 Comando do Composer salvo em .composer_command"
