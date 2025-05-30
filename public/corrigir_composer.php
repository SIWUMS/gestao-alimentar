<?php
/**
 * Script de correção rápida para Composer
 * Acesse: gme.emmvmfc.com.br/corrigir_composer.php
 */

// Configurações
set_time_limit(300);
ini_set('display_errors', 1);
error_reporting(E_ALL);

$project_root = '/home/catalogonet/gme.emmvmfc.com.br';

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correção Rápida - Composer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; background: #28a745; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .step { margin: 15px 0; padding: 15px; border-left: 4px solid #28a745; background: #f8f9fa; border-radius: 5px; }
        .success { border-left-color: #28a745; background: #d4edda; }
        .error { border-left-color: #dc3545; background: #f8d7da; }
        .warning { border-left-color: #ffc107; background: #fff3cd; }
        .btn { display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
        .btn:hover { background: #218838; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 Correção Rápida do Composer</h1>
            <p>Sistema de Gestão Alimentar</p>
        </div>

        <?php
        // Mudar para diretório do projeto
        if (is_dir($project_root)) {
            chdir($project_root);
        }

        $action = $_GET['action'] ?? 'auto';

        if ($action === 'auto') {
            echo "<div class='step'>🚀 <strong>Correção Automática Iniciada</strong></div>";
            
            // Verificar se Composer já existe
            if (file_exists('composer.phar')) {
                echo "<div class='step success'>✅ composer.phar já existe</div>";
                
                // Testar se funciona
                $test = shell_exec('php composer.phar --version 2>&1');
                if (strpos($test, 'Composer') !== false) {
                    echo "<div class='step success'>✅ Composer funcionando: " . htmlspecialchars(trim($test)) . "</div>";
                    echo "<a href='install.php' class='btn'>➡️ Continuar Instalação</a>";
                } else {
                    echo "<div class='step error'>❌ Composer não está funcionando</div>";
                    echo "<a href='?action=download' class='btn'>🔄 Baixar Novamente</a>";
                }
            } else {
                echo "<div class='step warning'>⚠️ composer.phar não encontrado - baixando...</div>";
                echo "<script>setTimeout(function(){ window.location.href = '?action=download'; }, 2000);</script>";
            }
        }

        elseif ($action === 'download') {
            echo "<div class='step'>📥 <strong>Baixando Composer...</strong></div>";
            
            $success = false;
            
            // Método 1: cURL
            if (function_exists('curl_init')) {
                echo "<div class='step'>🔄 Tentando com cURL...</div>";
                
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, 'https://getcomposer.org/composer.phar');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 60);
                
                $data = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                
                if ($data && $httpCode === 200) {
                    if (file_put_contents('composer.phar', $data)) {
                        chmod('composer.phar', 0755);
                        echo "<div class='step success'>✅ Baixado com cURL</div>";
                        $success = true;
                    }
                }
            }
            
            // Método 2: file_get_contents
            if (!$success) {
                echo "<div class='step'>🔄 Tentando com file_get_contents...</div>";
                
                $context = stream_context_create([
                    'http' => [
                        'timeout' => 60,
                        'user_agent' => 'Mozilla/5.0'
                    ]
                ]);
                
                $data = file_get_contents('https://getcomposer.org/composer.phar', false, $context);
                
                if ($data) {
                    if (file_put_contents('composer.phar', $data)) {
                        chmod('composer.phar', 0755);
                        echo "<div class='step success'>✅ Baixado com file_get_contents</div>";
                        $success = true;
                    }
                }
            }
            
            // Método 3: wget
            if (!$success) {
                echo "<div class='step'>🔄 Tentando com wget...</div>";
                
                $output = shell_exec('wget -O composer.phar https://getcomposer.org/composer.phar 2>&1');
                
                if (file_exists('composer.phar') && filesize('composer.phar') > 1000) {
                    chmod('composer.phar', 0755);
                    echo "<div class='step success'>✅ Baixado com wget</div>";
                    $success = true;
                }
            }
            
            if ($success) {
                // Testar instalação
                $test = shell_exec('php composer.phar --version 2>&1');
                if (strpos($test, 'Composer') !== false) {
                    echo "<div class='step success'>✅ Composer instalado e funcionando!</div>";
                    echo "<div class='step success'>📦 Versão: " . htmlspecialchars(trim($test)) . "</div>";
                    echo "<a href='?action=install' class='btn'>➡️ Instalar Dependências</a>";
                } else {
                    echo "<div class='step error'>❌ Composer baixado mas não funciona</div>";
                    echo "<pre>" . htmlspecialchars($test) . "</pre>";
                }
            } else {
                echo "<div class='step error'>❌ Falha em todos os métodos de download</div>";
                echo "<a href='?action=manual' class='btn'>📋 Instruções Manuais</a>";
            }
        }

        elseif ($action === 'install') {
            echo "<div class='step'>📚 <strong>Instalando Dependências...</strong></div>";
            
            if (!file_exists('composer.phar')) {
                echo "<div class='step error'>❌ composer.phar não encontrado</div>";
                echo "<a href='?action=download' class='btn'>📥 Baixar Composer</a>";
            } else {
                // Limpar instalações anteriores
                if (is_dir('vendor')) {
                    echo "<div class='step'>🗑️ Removendo vendor existente...</div>";
                    shell_exec('rm -rf vendor/');
                }
                
                if (file_exists('composer.lock')) {
                    echo "<div class='step'>🗑️ Removendo composer.lock...</div>";
                    unlink('composer.lock');
                }
                
                // Tentar instalação
                echo "<div class='step'>⏳ Instalando dependências (pode demorar)...</div>";
                echo "<script>document.body.style.cursor = 'wait';</script>";
                
                $commands = [
                    'php composer.phar install --optimize-autoloader --no-dev --prefer-dist',
                    'php composer.phar install --no-scripts --optimize-autoloader --no-dev',
                    'php composer.phar install --no-scripts --ignore-platform-reqs'
                ];
                
                $success = false;
                foreach ($commands as $i => $cmd) {
                    echo "<div class='step'>🔄 Tentativa " . ($i + 1) . ": $cmd</div>";
                    
                    $output = shell_exec("timeout 180 $cmd 2>&1");
                    
                    if (is_dir('vendor') && file_exists('vendor/autoload.php')) {
                        echo "<div class='step success'>✅ Dependências instaladas com sucesso!</div>";
                        $success = true;
                        break;
                    } else {
                        echo "<div class='step error'>❌ Tentativa " . ($i + 1) . " falhou</div>";
                        if ($output) {
                            echo "<pre>" . htmlspecialchars(substr($output, -300)) . "</pre>";
                        }
                    }
                }
                
                echo "<script>document.body.style.cursor = 'default';</script>";
                
                if ($success) {
                    echo "<div class='step success'>🎉 <strong>Instalação Concluída!</strong></div>";
                    echo "<a href='install.php' class='btn'>➡️ Continuar Instalação do Sistema</a>";
                } else {
                    echo "<div class='step error'>❌ <strong>Instalação Falhou</strong></div>";
                    echo "<a href='?action=manual' class='btn'>📋 Ver Soluções Manuais</a>";
                }
            }
        }

        elseif ($action === 'manual') {
            ?>
            <div class="step">
                <h3>📋 Soluções Manuais</h3>
                
                <h4>Opção 1: Via SSH</h4>
                <pre>cd /home/catalogonet/gme.emmvmfc.com.br
curl -sS https://getcomposer.org/composer.phar -o composer.phar
chmod +x composer.phar
php composer.phar install --no-dev</pre>
                
                <h4>Opção 2: Via cPanel Terminal</h4>
                <pre>cd gme.emmvmfc.com.br
wget https://getcomposer.org/composer.phar
php composer.phar install</pre>
                
                <h4>Opção 3: Upload da Pasta Vendor</h4>
                <ol>
                    <li>Baixe um projeto Laravel funcionando</li>
                    <li>Copie a pasta <code>vendor</code></li>
                    <li>Faça upload via cPanel File Manager</li>
                    <li>Coloque em: <code>/home/catalogonet/gme.emmvmfc.com.br/vendor/</code></li>
                </ol>
                
                <h4>Opção 4: Contatar Suporte</h4>
                <p>Entre em contato com o suporte da hospedagem para instalar o Composer globalmente.</p>
            </div>
            <?php
        }
        ?>

        <div class="step">
            <h3>🔧 Ações Disponíveis</h3>
            <a href="?action=auto" class="btn">🔍 Verificar Status</a>
            <a href="?action=download" class="btn">📥 Baixar Composer</a>
            <a href="?action=install" class="btn">📚 Instalar Dependências</a>
            <a href="?action=manual" class="btn">📋 Instruções Manuais</a>
            <a href="install.php" class="btn">⬅️ Voltar</a>
        </div>

        <div class="step">
            <p><strong>Diretório atual:</strong> <?php echo getcwd(); ?></p>
            <p><strong>Composer.phar existe:</strong> <?php echo file_exists('composer.phar') ? '✅ Sim' : '❌ Não'; ?></p>
            <p><strong>Pasta vendor existe:</strong> <?php echo is_dir('vendor') ? '✅ Sim' : '❌ Não'; ?></p>
        </div>
    </div>
</body>
</html>
