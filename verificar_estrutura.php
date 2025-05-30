<?php
/**
 * Script para verificar a estrutura do projeto Laravel
 * Execute: php verificar_estrutura.php
 */

echo "🔍 VERIFICAÇÃO DA ESTRUTURA DO PROJETO\n";
echo "=====================================\n\n";

// Verificar diretório atual
echo "📁 Diretório atual: " . getcwd() . "\n\n";

// Arquivos essenciais do Laravel
$arquivosEssenciais = [
    'artisan' => 'Arquivo de comandos do Laravel',
    'composer.json' => 'Configuração do Composer',
    'composer.lock' => 'Lock file do Composer',
    '.env' => 'Arquivo de configuração',
    'package.json' => 'Dependências Node.js'
];

echo "📋 Verificando arquivos essenciais:\n";
foreach ($arquivosEssenciais as $arquivo => $descricao) {
    if (file_exists($arquivo)) {
        echo "✅ $arquivo - $descricao\n";
    } else {
        echo "❌ $arquivo - $descricao (NÃO ENCONTRADO)\n";
    }
}

echo "\n";

// Pastas essenciais do Laravel
$pastasEssenciais = [
    'app' => 'Código da aplicação',
    'config' => 'Arquivos de configuração',
    'database' => 'Migrations e seeders',
    'resources' => 'Views e assets',
    'routes' => 'Rotas da aplicação',
    'storage' => 'Arquivos de cache e logs',
    'vendor' => 'Dependências do Composer',
    'public' => 'Arquivos públicos'
];

echo "📂 Verificando pastas essenciais:\n";
foreach ($pastasEssenciais as $pasta => $descricao) {
    if (is_dir($pasta)) {
        echo "✅ $pasta/ - $descricao\n";
    } else {
        echo "❌ $pasta/ - $descricao (NÃO ENCONTRADA)\n";
    }
}

echo "\n";

// Verificar se estamos na pasta correta
$isLaravelProject = file_exists('artisan') && file_exists('composer.json') && is_dir('app');

if ($isLaravelProject) {
    echo "🎉 PROJETO LARAVEL DETECTADO!\n";
    echo "Você está na pasta correta.\n\n";
    
    // Verificar composer.json
    if (file_exists('composer.json')) {
        $composer = json_decode(file_get_contents('composer.json'), true);
        if (isset($composer['name'])) {
            echo "📦 Nome do projeto: " . $composer['name'] . "\n";
        }
        if (isset($composer['require']['laravel/framework'])) {
            echo "🔧 Versão do Laravel: " . $composer['require']['laravel/framework'] . "\n";
        }
    }
} else {
    echo "⚠️  PROJETO LARAVEL NÃO DETECTADO!\n";
    echo "Você pode estar na pasta errada.\n\n";
    
    echo "💡 Sugestões:\n";
    echo "1. Navegue para a pasta correta do projeto\n";
    echo "2. Verifique se os arquivos foram enviados corretamente\n";
    echo "3. Execute: find . -name 'artisan' -type f\n";
}

echo "\n";

// Verificar permissões
if (file_exists('artisan')) {
    $perms = fileperms('artisan');
    echo "🔐 Permissões do artisan: " . substr(sprintf('%o', $perms), -4) . "\n";
    
    if (!is_executable('artisan')) {
        echo "⚠️  Artisan não é executável. Execute: chmod +x artisan\n";
    }
}

echo "\n";
echo "🔧 COMANDOS PARA CORRIGIR:\n";
echo "=========================\n";

if (!$isLaravelProject) {
    echo "# Encontrar pasta do projeto:\n";
    echo "find /home/catalogonet -name 'artisan' -type f 2>/dev/null\n\n";
    echo "# Navegar para pasta correta:\n";
    echo "cd /caminho/encontrado\n\n";
}

echo "# Instalar dependências sem scripts:\n";
echo "composer install --no-scripts\n\n";

echo "# Gerar autoload:\n";
echo "composer dump-autoload\n\n";

echo "# Corrigir permissões:\n";
echo "chmod +x artisan\n";
echo "chmod -R 755 storage/\n";
echo "chmod -R 755 bootstrap/cache/\n\n";

echo "# Executar comandos Laravel:\n";
echo "php artisan key:generate\n";
echo "php artisan migrate\n";
