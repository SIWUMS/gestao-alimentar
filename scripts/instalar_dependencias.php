<?php
/**
 * Script PHP para instalar dependências do Laravel via browser
 */

echo "<h1>📚 Instalação de Dependências do Laravel</h1>";
echo "<hr>";

// Verificar se estamos no lugar certo
if (!file_exists('composer.json')) {
    echo "<p style='color: red;'>❌ Arquivo composer.json não encontrado!</p>";
    echo "<p>Execute este script na pasta raiz do projeto Laravel.</p>";
    exit;
}

echo "<p>✅ Projeto Laravel detectado</p>";

// Função para detectar Composer
function detectarComposer() {
    // Verificar composer global
    if (shell_exec('which composer') !== null) {
        return 'composer';
    }
    
    // Verificar composer.phar local
    if (file_exists('composer.phar')) {
        return 'php composer.phar';
    }
    
    // Verificar em locais comuns
    if (file_exists('/usr/local/bin/composer')) {
        return '/usr/local/bin/composer';
    }
    
    return false;
}

echo "<h2>🔍 Detectando Composer</h2>";

$composer_cmd = detectarComposer();

if (!$composer_cmd) {
    echo "<p style='color: red;'>❌ Composer não encontrado!</p>";
    echo "<p><a href='instalar_composer.php'>➡️ Instalar Composer primeiro</a></p>";
    exit;
}

echo "<p>✅ Composer encontrado: <code>$composer_cmd</code></p>";

// Testar Composer
$version = shell_exec("$composer_cmd --version 2>&1");
echo "<p>Versão: $version</p>";

echo "<h2>🧹 Preparando Instalação</h2>";

// Limpar instalações anteriores
if (is_dir('vendor')) {
    echo "<p>🗑️ Removendo pasta vendor existente...</p>";
    
    // Função recursiva para remover diretório
    function removeDirectory($dir) {
        if (!is_dir($dir)) return false;
        
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . DIRECTORY_SEPARATOR . $file;
            is_dir($path) ? removeDirectory($path) : unlink($path);
        }
        return rmdir($dir);
    }
    
    if (removeDirectory('vendor')) {
        echo "<p>✅ Pasta vendor removida</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Não foi possível remover pasta vendor completamente</p>";
    }
}

if (file_exists('composer.lock')) {
    echo "<p>🗑️ Removendo composer.lock...</p>";
    if (unlink('composer.lock')) {
        echo "<p>✅ composer.lock removido</p>";
    }
}

echo "<h2>📦 Instalando Dependências</h2>";

// Função para executar comando e capturar saída
function executarComando($cmd) {
    $output = [];
    $return_var = 0;
    
    exec($cmd . ' 2>&1', $output, $return_var);
    
    return [
        'success' => $return_var === 0,
        'output' => implode("\n", $output),
        'return_code' => $return_var
    ];
}

// Tentar diferentes métodos de instalação
$methods = [
    [
        'name' => 'Instalação padrão otimizada',
        'cmd' => "$composer_cmd install --optimize-autoloader --no-dev --prefer-dist"
    ],
    [
        'name' => 'Instalação sem scripts',
        'cmd' => "$composer_cmd install --no-scripts --optimize-autoloader --no-dev --prefer-dist"
    ],
    [
        'name' => 'Instalação ignorando requisitos de plataforma',
        'cmd' => "$composer_cmd install --no-scripts --optimize-autoloader --no-dev --prefer-dist --ignore-platform-reqs"
    ]
];

$success = false;
$attempt = 0;

foreach ($methods as $method) {
    $attempt++;
    echo "<h3>🔄 Tentativa $attempt: {$method['name']}</h3>";
    echo "<p>Executando: <code>{$method['cmd']}</code></p>";
    
    // Mostrar progresso
    echo "<div id='progress-$attempt'>⏳ Instalando...</div>";
    echo "<script>document.getElementById('progress-$attempt').innerHTML = '⏳ Instalando... (isso pode demorar alguns minutos)';</script>";
    
    // Executar comando
    $result = executarComando($method['cmd']);
    
    if ($result['success'] && is_dir('vendor') && file_exists('vendor/autoload.php')) {
        echo "<script>document.getElementById('progress-$attempt').innerHTML = '✅ Sucesso!';</script>";
        echo "<p style='color: green;'>✅ <strong>Dependências instaladas com sucesso!</strong></p>";
        $success = true;
        break;
    } else {
        echo "<script>document.getElementById('progress-$attempt').innerHTML = '❌ Falhou';</script>";
        echo "<p style='color: red;'>❌ Tentativa $attempt falhou</p>";
        
        // Mostrar saída do erro (limitada)
        $error_output = substr($result['output'], -500);
        echo "<details><summary>Ver erro</summary><pre>$error_output</pre></details>";
        
        if ($attempt < count($methods)) {
            echo "<p>⏳ Tentando método alternativo...</p>";
        }
    }
    
    // Flush output para mostrar progresso
    if (ob_get_level()) ob_flush();
    flush();
}

if (!$success) {
    echo "<h2 style='color: red;'>❌ Todas as Tentativas Falharam</h2>";
    echo "<p>💡 <strong>Soluções alternativas:</strong></p>";
    echo "<ol>";
    echo "<li><strong>Verificar conexão:</strong> Certifique-se de que o servidor tem acesso à internet</li>";
    echo "<li><strong>Limpar cache:</strong> Execute <code>$composer_cmd clear-cache</code></li>";
    echo "<li><strong>Atualizar Composer:</strong> Execute <code>$composer_cmd self-update</code></li>";
    echo "<li><strong>Upload manual:</strong> Baixe a pasta vendor de outro projeto Laravel e faça upload</li>";
    echo "<li><strong>Contatar suporte:</strong> Entre em contato com o suporte da hospedagem</li>";
    echo "</ol>";
    exit;
}

// Executar scripts pós-instalação se necessário
if ($attempt > 1) {
    echo "<h2>🔧 Scripts Pós-Instalação</h2>";
    echo "<p>🔄 Gerando autoload otimizado...</p>";
    
    $autoload_result = executarComando("$composer_cmd dump-autoload --optimize");
    
    if ($autoload_result['success']) {
        echo "<p>✅ Autoload gerado com sucesso</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Erro ao gerar autoload - mas dependências estão instaladas</p>";
    }
}

echo "<h2>🔍 Verificando Instalação</h2>";

// Verificar pasta vendor
if (is_dir('vendor')) {
    $vendor_size = 'N/A';
    if (function_exists('exec')) {
        $size_output = shell_exec('du -sh vendor/ 2>/dev/null');
        if ($size_output) {
            $vendor_size = trim(explode("\t", $size_output)[0]);
        }
    }
    echo "<p>✅ Pasta vendor criada (tamanho: $vendor_size)</p>";
} else {
    echo "<p style='color: red;'>❌ Pasta vendor não foi criada</p>";
    exit;
}

// Verificar autoload
if (file_exists('vendor/autoload.php')) {
    echo "<p>✅ Autoload disponível</p>";
} else {
    echo "<p style='color: red;'>❌ Autoload não encontrado</p>";
}

// Verificar Laravel
if (file_exists('vendor/laravel/framework/src/Illuminate/Foundation/Application.php')) {
    echo "<p>✅ Laravel Framework instalado</p>";
} else {
    echo "<p style='color: orange;'>⚠️ Laravel Framework não detectado</p>";
}

// Contar pacotes
if (file_exists('composer.lock')) {
    $composer_lock = json_decode(file_get_contents('composer.lock'), true);
    if ($composer_lock && isset($composer_lock['packages'])) {
        $package_count = count($composer_lock['packages']);
        echo "<p>📦 Pacotes instalados: $package_count</p>";
    }
}

echo "<h2>🎉 Instalação Concluída!</h2>";

echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
echo "<h3 style='color: #155724; margin-top: 0;'>✅ Dependências Instaladas com Sucesso!</h3>";
echo "<p><strong>Próximos passos:</strong></p>";
echo "<ol>";
echo "<li>🔑 <strong>Gerar chave:</strong> <code>php artisan key:generate</code></li>";
echo "<li>⚙️ <strong>Configurar .env:</strong> Configure banco de dados e outras variáveis</li>";
echo "<li>🗄️ <strong>Executar migrations:</strong> <code>php artisan migrate --seed</code></li>";
echo "<li>🌐 <strong>Testar aplicação:</strong> <code>php artisan serve</code></li>";
echo "</ol>";
echo "</div>";

echo "<h3>🔧 Comandos Úteis:</h3>";
echo "<ul>";
echo "<li><strong>Atualizar dependências:</strong> <code>$composer_cmd update</code></li>";
echo "<li><strong>Limpar cache:</strong> <code>$composer_cmd clear-cache</code></li>";
echo "<li><strong>Otimizar autoload:</strong> <code>$composer_cmd dump-autoload --optimize</code></li>";
echo "<li><strong>Verificar dependências:</strong> <code>$composer_cmd show</code></li>";
echo "</ul>";

// Salvar comando para uso futuro
file_put_contents('.composer_command', $composer_cmd);
echo "<p>💾 Comando do Composer salvo em .composer_command</p>";

echo "<hr>";
echo "<p><small>Instalação concluída em: " . date('d/m/Y H:i:s') . "</small></p>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
h1, h2, h3 { color: #333; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; max-height: 200px; }
details { margin: 10px 0; }
summary { cursor: pointer; color: #007bff; }
</style>
