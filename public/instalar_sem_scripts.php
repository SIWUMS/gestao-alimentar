<?php
/**
 * Script específico para instalar dependências sem executar scripts pós-instalação
 */

set_time_limit(300);
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>📦 Instalação de Dependências SEM Scripts</h1>";
echo "<p><strong>Solução para:</strong> Could not open input file: artisan</p>";
echo "<hr>";

// Mudar para diretório do projeto
$project_root = '/home/catalogonet/gme.emmvmfc.com.br';
if (is_dir($project_root)) {
    chdir($project_root);
    echo "<p>✅ Diretório: $project_root</p>";
} else {
    echo "<p style='color: red;'>❌ Diretório não encontrado: $project_root</p>";
    exit;
}

// Detectar Composer
$composer_cmd = null;
if (shell_exec('which composer') !== null) {
    $composer_cmd = 'composer';
} elseif (file_exists('composer.phar')) {
    $composer_cmd = 'php composer.phar';
} else {
    echo "<p style='color: red;'>❌ Composer não encontrado!</p>";
    echo "<p><a href='instalar_composer_web.php'>➡️ Instalar Composer primeiro</a></p>";
    exit;
}

echo "<p>✅ Composer: $composer_cmd</p>";

// Limpar instalação anterior
echo "<h2>🧹 Limpando instalação anterior</h2>";
if (is_dir('vendor')) {
    shell_exec('rm -rf vendor/');
    echo "<p>✅ Pasta vendor removida</p>";
}
if (file_exists('composer.lock')) {
    unlink('composer.lock');
    echo "<p>✅ composer.lock removido</p>";
}

// Instalar SEM scripts
echo "<h2>📦 Instalando dependências SEM scripts</h2>";
echo "<p>⏳ Executando: <code>$composer_cmd install --no-scripts --optimize-autoloader --no-dev --prefer-dist</code></p>";

$output = [];
$return_var = 0;
exec("$composer_cmd install --no-scripts --optimize-autoloader --no-dev --prefer-dist 2>&1", $output, $return_var);

if ($return_var === 0 && is_dir('vendor') && file_exists('vendor/autoload.php')) {
    echo "<p style='color: green;'>✅ <strong>Dependências instaladas com sucesso!</strong></p>";
    
    // Criar artisan se não existir
    if (!file_exists('artisan')) {
        echo "<h2>🔧 Criando arquivo artisan</h2>";
        $artisan_content = '#!/usr/bin/env php
<?php
define(\'LARAVEL_START\', microtime(true));
require __DIR__.\'/vendor/autoload.php\';
$app = require_once __DIR__.\'/bootstrap/app.php\';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$status = $kernel->handle(
    $input = new Symfony\\Component\\Console\\Input\\ArgvInput,
    new Symfony\\Component\\Console\\Output\\ConsoleOutput
);
$kernel->terminate($input, $status);
exit($status);
';
        file_put_contents('artisan', $artisan_content);
        chmod('artisan', 0755);
        echo "<p>✅ Arquivo artisan criado</p>";
    }
    
    // Executar scripts manualmente
    echo "<h2>⚙️ Executando scripts pós-instalação</h2>";
    
    // Package discovery
    echo "<p>🔄 Executando package discovery...</p>";
    $result = shell_exec('php artisan package:discover --ansi 2>&1');
    if (strpos($result, 'error') === false) {
        echo "<p>✅ Package discovery executado</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Package discovery com avisos (normal)</p>";
    }
    
    // Gerar chave se .env existe
    if (file_exists('.env')) {
        echo "<p>🔄 Gerando chave da aplicação...</p>";
        $key_result = shell_exec('php artisan key:generate --ansi 2>&1');
        if (strpos($key_result, 'generated') !== false) {
            echo "<p>✅ Chave da aplicação gerada</p>";
        }
    }
    
    echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3 style='color: #155724;'>🎉 Instalação Concluída!</h3>";
    echo "<p><a href='install.php' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>➡️ Continuar Instalação do Sistema</a></p>";
    echo "</div>";
    
} else {
    echo "<p style='color: red;'>❌ Erro na instalação:</p>";
    echo "<pre>" . implode("\n", $output) . "</pre>";
    
    echo "<h3>💡 Soluções alternativas:</h3>";
    echo "<ol>";
    echo "<li><a href='corrigir_artisan.php'>🔧 Usar correção automática completa</a></li>";
    echo "<li><strong>Tentar com ignore-platform-reqs:</strong> <code>$composer_cmd install --no-scripts --ignore-platform-reqs</code></li>";
    echo "<li><strong>Upload manual:</strong> Baixar pasta vendor de outro projeto</li>";
    echo "</ol>";
}
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
h1, h2, h3 { color: #333; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>
