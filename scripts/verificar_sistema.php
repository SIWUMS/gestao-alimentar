<?php
/**
 * Script PHP para verificar sistema e criar estrutura
 * Execute via browser ou linha de comando
 */

echo "<h1>🔍 Verificação do Sistema Laravel</h1>";
echo "<hr>";

// Verificar se estamos no diretório correto
if (!file_exists('artisan')) {
    die('<p style="color: red;">❌ Arquivo "artisan" não encontrado. Execute este script na pasta raiz do projeto Laravel.</p>');
}

echo "<p>✅ Projeto Laravel detectado</p>";

// Função para criar diretório
function criarDiretorio($path, $permissions = 0755) {
    if (!is_dir($path)) {
        if (mkdir($path, $permissions, true)) {
            echo "<p>✅ Diretório criado: <strong>$path</strong> (permissões: " . decoct($permissions) . ")</p>";
        } else {
            echo "<p style='color: red;'>❌ Erro ao criar diretório: <strong>$path</strong></p>";
        }
    } else {
        echo "<p>✅ Diretório já existe: <strong>$path</strong></p>";
    }
}

// Função para verificar permissões
function verificarPermissoes($path) {
    if (is_dir($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $writable = is_writable($path) ? '✅ Escrita OK' : '❌ Sem escrita';
        echo "<p>📁 <strong>$path</strong> - Permissões: $perms - $writable</p>";
        return is_writable($path);
    } else {
        echo "<p style='color: red;'>❌ Diretório não existe: <strong>$path</strong></p>";
        return false;
    }
}

echo "<h2>🏗️ Criando Estrutura de Diretórios</h2>";

// Diretórios essenciais do Laravel
$diretorios = [
    'storage' => 0755,
    'storage/app' => 0755,
    'storage/app/public' => 0755,
    'storage/framework' => 0777,
    'storage/framework/cache' => 0777,
    'storage/framework/cache/data' => 0777,
    'storage/framework/sessions' => 0777,
    'storage/framework/views' => 0777,
    'storage/logs' => 0777,
    'bootstrap' => 0755,
    'bootstrap/cache' => 0777,
];

foreach ($diretorios as $dir => $perm) {
    criarDiretorio($dir, $perm);
}

echo "<h2>🔐 Configurando Permissões</h2>";

// Configurar permissões
foreach ($diretorios as $dir => $perm) {
    if (is_dir($dir)) {
        if (chmod($dir, $perm)) {
            echo "<p>✅ Permissões configuradas: <strong>$dir</strong> (" . decoct($perm) . ")</p>";
        } else {
            echo "<p style='color: orange;'>⚠️ Não foi possível alterar permissões: <strong>$dir</strong></p>";
        }
    }
}

echo "<h2>📋 Verificação de Permissões</h2>";

$diretorios_verificar = [
    'storage',
    'storage/logs',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'bootstrap/cache'
];

$todos_ok = true;
foreach ($diretorios_verificar as $dir) {
    if (!verificarPermissoes($dir)) {
        $todos_ok = false;
    }
}

echo "<h2>📄 Criando Arquivos Necessários</h2>";

// Criar arquivos .gitkeep
$gitkeep_dirs = [
    'storage/app',
    'storage/app/public',
    'storage/framework/cache',
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
];

foreach ($gitkeep_dirs as $dir) {
    $gitkeep_file = $dir . '/.gitkeep';
    if (!file_exists($gitkeep_file)) {
        if (file_put_contents($gitkeep_file, '') !== false) {
            echo "<p>✅ Arquivo criado: <strong>$gitkeep_file</strong></p>";
        } else {
            echo "<p style='color: red;'>❌ Erro ao criar: <strong>$gitkeep_file</strong></p>";
        }
    } else {
        echo "<p>✅ Arquivo já existe: <strong>$gitkeep_file</strong></p>";
    }
}

// Criar arquivo de log se não existir
if (!file_exists('storage/logs/laravel.log')) {
    if (file_put_contents('storage/logs/laravel.log', '') !== false) {
        chmod('storage/logs/laravel.log', 0666);
        echo "<p>✅ Arquivo de log criado: <strong>storage/logs/laravel.log</strong></p>";
    } else {
        echo "<p style='color: red;'>❌ Erro ao criar arquivo de log</p>";
    }
} else {
    echo "<p>✅ Arquivo de log já existe</p>";
}

echo "<h2>🧪 Teste de Escrita</h2>";

// Testar escrita nos diretórios críticos
function testarEscrita($dir) {
    $arquivo_teste = $dir . '/teste_' . uniqid() . '.tmp';
    if (file_put_contents($arquivo_teste, 'teste') !== false) {
        unlink($arquivo_teste);
        echo "<p>✅ Teste de escrita OK: <strong>$dir</strong></p>";
        return true;
    } else {
        echo "<p style='color: red;'>❌ Teste de escrita FALHOU: <strong>$dir</strong></p>";
        return false;
    }
}

$teste_ok = true;
foreach ($diretorios_verificar as $dir) {
    if (is_dir($dir)) {
        if (!testarEscrita($dir)) {
            $teste_ok = false;
        }
    }
}

echo "<h2>🔧 Verificação do Composer</h2>";

// Verificar Composer
$composer_cmd = '';
if (shell_exec('which composer') !== null) {
    $composer_cmd = 'composer';
    echo "<p>✅ Composer encontrado globalmente</p>";
} elseif (file_exists('composer.phar')) {
    $composer_cmd = 'php composer.phar';
    echo "<p>✅ Composer.phar encontrado localmente</p>";
} else {
    echo "<p style='color: red;'>❌ Composer não encontrado</p>";
    echo "<p>💡 Soluções:</p>";
    echo "<ul>";
    echo "<li>Instalar Composer globalmente</li>";
    echo "<li>Fazer download do composer.phar</li>";
    echo "<li>Fazer upload da pasta vendor manualmente</li>";
    echo "</ul>";
}

echo "<h2>📊 Relatório Final</h2>";

if ($todos_ok && $teste_ok) {
    echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px;'>";
    echo "<h3 style='color: #155724;'>🎉 Sistema OK!</h3>";
    echo "<p>✅ Todos os diretórios têm as permissões corretas</p>";
    echo "<p>✅ Testes de escrita passaram</p>";
    echo "<p><strong>Próximos passos:</strong></p>";
    echo "<ol>";
    echo "<li>Configurar arquivo .env</li>";
    if ($composer_cmd) {
        echo "<li>Executar: <code>$composer_cmd install</code></li>";
    } else {
        echo "<li>Instalar dependências do Composer</li>";
    }
    echo "<li>Executar: <code>php artisan key:generate</code></li>";
    echo "<li>Executar: <code>php artisan migrate --seed</code></li>";
    echo "</ol>";
    echo "</div>";
} else {
    echo "<div style='background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px;'>";
    echo "<h3 style='color: #721c24;'>⚠️ Problemas Encontrados</h3>";
    echo "<p>Alguns diretórios não têm as permissões corretas.</p>";
    echo "<p><strong>Execute os comandos abaixo via terminal:</strong></p>";
    echo "<pre>";
    echo "chmod -R 755 storage/\n";
    echo "chmod -R 777 storage/logs/\n";
    echo "chmod -R 777 storage/framework/\n";
    echo "chmod -R 777 bootstrap/cache/\n";
    echo "</pre>";
    echo "</div>";
}

echo "<h2>📋 Informações do Sistema</h2>";
echo "<ul>";
echo "<li><strong>PHP Version:</strong> " . PHP_VERSION . "</li>";
echo "<li><strong>Sistema Operacional:</strong> " . PHP_OS . "</li>";
echo "<li><strong>Diretório Atual:</strong> " . getcwd() . "</li>";
echo "<li><strong>Usuário PHP:</strong> " . get_current_user() . "</li>";
echo "<li><strong>Memória Disponível:</strong> " . ini_get('memory_limit') . "</li>";
echo "</ul>";

// Verificar extensões PHP necessárias
echo "<h2>🔌 Extensões PHP</h2>";
$extensoes_necessarias = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json'];

foreach ($extensoes_necessarias as $ext) {
    if (extension_loaded($ext)) {
        echo "<p>✅ <strong>$ext</strong> - Carregada</p>";
    } else {
        echo "<p style='color: red;'>❌ <strong>$ext</strong> - NÃO carregada</p>";
    }
}

echo "<hr>";
echo "<p><small>Script executado em: " . date('d/m/Y H:i:s') . "</small></p>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h1, h2 { color: #333; }
code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>
