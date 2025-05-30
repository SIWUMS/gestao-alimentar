<?php
/**
 * Script para instalar Composer via interface web
 * Acesse: gme.emmvmfc.com.br/instalar_composer_web.php
 */

set_time_limit(300); // 5 minutos
ini_set('display_errors', 1);
error_reporting(E_ALL);

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalar Composer - Sistema de Gestão Alimentar</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border-radius: 10px;
        }
        .step { 
            margin: 20px 0; 
            padding: 15px; 
            border-left: 4px solid #28a745; 
            background: #f8f9fa;
            border-radius: 5px;
        }
        .success { border-left-color: #28a745; background: #d4edda; }
        .error { border-left-color: #dc3545; background: #f8d7da; }
        .warning { border-left-color: #ffc107; background: #fff3cd; }
        .info { border-left-color: #17a2b8; background: #d1ecf1; }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        .btn:hover { background: #218838; }
        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #c82333; }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto; 
            border: 1px solid #dee2e6;
        }
        .progress {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        .log {
            max-height: 300px;
            overflow-y: auto;
            background: #000;
            color: #00ff00;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Sistema de Gestão Alimentar</h1>
            <h2>📦 Instalação do Composer</h2>
        </div>

        <?php
        $action = $_GET['action'] ?? 'check';
        $step = (int)($_GET['step'] ?? 1);

        // Função para log
        function logMessage($message, $type = 'info') {
            $timestamp = date('H:i:s');
            $icon = $type === 'success' ? '✅' : ($type === 'error' ? '❌' : ($type === 'warning' ? '⚠️' : 'ℹ️'));
            echo "<div class='step $type'><strong>[$timestamp] $icon</strong> $message</div>";
            if (ob_get_level()) ob_flush();
            flush();
        }

        // Função para executar comando
        function executeCommand($cmd) {
            $output = [];
            $return_var = 0;
            exec($cmd . ' 2>&1', $output, $return_var);
            return [
                'success' => $return_var === 0,
                'output' => implode("\n", $output),
                'return_code' => $return_var
            ];
        }

        // Verificar diretório atual
        $current_dir = getcwd();
        $project_root = '/home/catalogonet/gme.emmvmfc.com.br';

        if ($action === 'check') {
            ?>
            <div class="step info">
                <h3>🔍 Verificação Inicial</h3>
                <p><strong>Diretório atual:</strong> <?php echo $current_dir; ?></p>
                <p><strong>Diretório do projeto:</strong> <?php echo $project_root; ?></p>
                <p><strong>PHP:</strong> <?php echo PHP_VERSION; ?></p>
                <p><strong>Usuário:</strong> <?php echo get_current_user(); ?></p>
            </div>

            <?php
            // Verificar se Composer já existe
            $composer_global = shell_exec('which composer 2>/dev/null');
            $composer_local = file_exists($project_root . '/composer.phar');

            if ($composer_global) {
                logMessage("Composer encontrado globalmente: " . trim($composer_global), 'success');
                echo "<a href='install.php' class='btn'>➡️ Voltar para Instalação</a>";
            } elseif ($composer_local) {
                logMessage("composer.phar encontrado localmente", 'success');
                echo "<a href='install.php' class='btn'>➡️ Voltar para Instalação</a>";
            } else {
                logMessage("Composer não encontrado - iniciando instalação", 'warning');
                ?>
                <div class="step">
                    <h3>📋 Plano de Instalação</h3>
                    <ol>
                        <li>Verificar pré-requisitos PHP</li>
                        <li>Baixar instalador do Composer</li>
                        <li>Verificar integridade</li>
                        <li>Instalar Composer</li>
                        <li>Testar instalação</li>
                        <li>Instalar dependências do Laravel</li>
                    </ol>
                </div>
                <a href="?action=install&step=1" class="btn">🚀 Iniciar Instalação</a>
                <?php
            }
        }

        elseif ($action === 'install') {
            // Mudar para diretório do projeto
            if (is_dir($project_root)) {
                chdir($project_root);
                logMessage("Mudando para diretório: $project_root", 'info');
            } else {
                logMessage("Diretório do projeto não encontrado: $project_root", 'error');
                exit;
            }

            if ($step === 1) {
                logMessage("PASSO 1: Verificando pré-requisitos", 'info');
                
                // Verificar extensões PHP
                $required_extensions = ['curl', 'openssl', 'phar', 'json', 'mbstring'];
                $missing = [];
                
                foreach ($required_extensions as $ext) {
                    if (extension_loaded($ext)) {
                        logMessage("Extensão $ext: OK", 'success');
                    } else {
                        logMessage("Extensão $ext: FALTANDO", 'error');
                        $missing[] = $ext;
                    }
                }
                
                if (empty($missing)) {
                    logMessage("Todos os pré-requisitos atendidos", 'success');
                    echo "<a href='?action=install&step=2' class='btn'>➡️ Próximo Passo</a>";
                } else {
                    logMessage("Extensões faltando: " . implode(', ', $missing), 'error');
                    logMessage("Continuando mesmo assim...", 'warning');
                    echo "<a href='?action=install&step=2' class='btn'>➡️ Continuar Mesmo Assim</a>";
                }
            }

            elseif ($step === 2) {
                logMessage("PASSO 2: Baixando Composer", 'info');
                
                // Tentar baixar com diferentes métodos
                $download_success = false;
                
                // Método 1: curl
                if (function_exists('curl_init')) {
                    logMessage("Tentando download com cURL...", 'info');
                    
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://getcomposer.org/composer.phar');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
                    
                    $composer_phar = curl_exec($ch);
                    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    
                    if ($composer_phar && $http_code === 200) {
                        if (file_put_contents('composer.phar', $composer_phar)) {
                            chmod('composer.phar', 0755);
                            logMessage("Composer baixado com cURL", 'success');
                            $download_success = true;
                        }
                    }
                }
                
                // Método 2: file_get_contents
                if (!$download_success) {
                    logMessage("Tentando download com file_get_contents...", 'info');
                    
                    $context = stream_context_create([
                        'http' => [
                            'timeout' => 120,
                            'user_agent' => 'Mozilla/5.0 (compatible; Composer Installer)'
                        ]
                    ]);
                    
                    $composer_phar = file_get_contents('https://getcomposer.org/composer.phar', false, $context);
                    
                    if ($composer_phar) {
                        if (file_put_contents('composer.phar', $composer_phar)) {
                            chmod('composer.phar', 0755);
                            logMessage("Composer baixado com file_get_contents", 'success');
                            $download_success = true;
                        }
                    }
                }
                
                // Método 3: wget via shell
                if (!$download_success) {
                    logMessage("Tentando download com wget...", 'info');
                    $result = executeCommand('wget -O composer.phar https://getcomposer.org/composer.phar');
                    
                    if ($result['success'] && file_exists('composer.phar')) {
                        chmod('composer.phar', 0755);
                        logMessage("Composer baixado com wget", 'success');
                        $download_success = true;
                    }
                }
                
                if ($download_success) {
                    echo "<a href='?action=install&step=3' class='btn'>➡️ Próximo Passo</a>";
                } else {
                    logMessage("Falha em todos os métodos de download", 'error');
                    ?>
                    <div class="step error">
                        <h3>❌ Download Falhou</h3>
                        <p><strong>Solução Manual:</strong></p>
                        <ol>
                            <li>Baixe composer.phar de <a href="https://getcomposer.org/download/" target="_blank">https://getcomposer.org/download/</a></li>
                            <li>Faça upload via cPanel File Manager para: <code><?php echo $project_root; ?></code></li>
                            <li>Renomeie para <code>composer.phar</code></li>
                            <li><a href="?action=install&step=3">Clique aqui para continuar</a></li>
                        </ol>
                    </div>
                    <?php
                }
            }

            elseif ($step === 3) {
                logMessage("PASSO 3: Testando Composer", 'info');
                
                if (!file_exists('composer.phar')) {
                    logMessage("composer.phar não encontrado", 'error');
                    echo "<a href='?action=install&step=2' class='btn btn-danger'>⬅️ Voltar</a>";
                } else {
                    $result = executeCommand('php composer.phar --version');
                    
                    if ($result['success']) {
                        logMessage("Composer funcionando: " . trim($result['output']), 'success');
                        echo "<a href='?action=install&step=4' class='btn'>➡️ Instalar Dependências</a>";
                    } else {
                        logMessage("Erro ao testar Composer: " . $result['output'], 'error');
                        echo "<a href='?action=install&step=2' class='btn btn-danger'>⬅️ Tentar Novamente</a>";
                    }
                }
            }

            elseif ($step === 4) {
                logMessage("PASSO 4: Instalando dependências do Laravel", 'info');
                
                ?>
                <div class="progress">
                    <div class="progress-bar" style="width: 0%" id="progressBar"></div>
                </div>
                <div id="installLog" class="log">Iniciando instalação das dependências...<br></div>
                
                <script>
                function updateProgress(percent, message) {
                    document.getElementById('progressBar').style.width = percent + '%';
                    document.getElementById('installLog').innerHTML += message + '<br>';
                    document.getElementById('installLog').scrollTop = document.getElementById('installLog').scrollHeight;
                }
                
                updateProgress(10, '[' + new Date().toLocaleTimeString() + '] 🔄 Limpando instalações anteriores...');
                </script>
                
                <?php
                // Limpar instalações anteriores
                if (is_dir('vendor')) {
                    logMessage("Removendo pasta vendor existente...", 'info');
                    shell_exec('rm -rf vendor/');
                }
                
                if (file_exists('composer.lock')) {
                    logMessage("Removendo composer.lock...", 'info');
                    unlink('composer.lock');
                }
                
                echo "<script>updateProgress(25, '[' + new Date().toLocaleTimeString() + '] ✅ Limpeza concluída');</script>";
                
                // Tentar diferentes métodos de instalação
                $methods = [
                    'php composer.phar install --optimize-autoloader --no-dev --prefer-dist',
                    'php composer.phar install --no-scripts --optimize-autoloader --no-dev --prefer-dist',
                    'php composer.phar install --no-scripts --optimize-autoloader --no-dev --prefer-dist --ignore-platform-reqs'
                ];
                
                $success = false;
                $attempt = 0;
                
                foreach ($methods as $method) {
                    $attempt++;
                    echo "<script>updateProgress(" . (25 + ($attempt * 20)) . ", '[' + new Date().toLocaleTimeString() + '] 🔄 Tentativa $attempt: $method');</script>";
                    
                    logMessage("Tentativa $attempt: $method", 'info');
                    
                    // Executar comando com timeout
                    $cmd = "timeout 300 $method";
                    $result = executeCommand($cmd);
                    
                    if ($result['success'] && is_dir('vendor') && file_exists('vendor/autoload.php')) {
                        echo "<script>updateProgress(100, '[' + new Date().toLocaleTimeString() + '] ✅ Dependências instaladas com sucesso!');</script>";
                        logMessage("Dependências instaladas com sucesso!", 'success');
                        $success = true;
                        break;
                    } else {
                        echo "<script>updateProgress(" . (25 + ($attempt * 20)) . ", '[' + new Date().toLocaleTimeString() + '] ❌ Tentativa $attempt falhou');</script>";
                        logMessage("Tentativa $attempt falhou: " . substr($result['output'], -200), 'error');
                    }
                    
                    if (ob_get_level()) ob_flush();
                    flush();
                    sleep(1);
                }
                
                if ($success) {
                    ?>
                    <div class="step success">
                        <h3>🎉 Instalação Concluída!</h3>
                        <p>As dependências do Composer foram instaladas com sucesso.</p>
                        <a href="install.php" class="btn">➡️ Continuar Instalação do Sistema</a>
                    </div>
                    <?php
                } else {
                    ?>
                    <div class="step error">
                        <h3>❌ Instalação Falhou</h3>
                        <p>Não foi possível instalar as dependências automaticamente.</p>
                        <h4>💡 Soluções Alternativas:</h4>
                        <ol>
                            <li><strong>Via SSH:</strong> Acesse via SSH e execute: <code>cd <?php echo $project_root; ?> && php composer.phar install</code></li>
                            <li><strong>Upload Manual:</strong> Baixe a pasta vendor de outro projeto Laravel e faça upload</li>
                            <li><strong>Suporte:</strong> Entre em contato com o suporte da hospedagem</li>
                        </ol>
                        <a href="?action=install&step=4" class="btn">🔄 Tentar Novamente</a>
                    </div>
                    <?php
                }
            }
        }

        elseif ($action === 'manual') {
            ?>
            <div class="step info">
                <h3>📋 Instruções para Instalação Manual</h3>
                
                <h4>Método 1: Via SSH</h4>
                <pre>cd /home/catalogonet/gme.emmvmfc.com.br
wget https://getcomposer.org/composer.phar
chmod +x composer.phar
php composer.phar install --optimize-autoloader --no-dev</pre>
                
                <h4>Método 2: Via cPanel Terminal (se disponível)</h4>
                <pre>cd gme.emmvmfc.com.br
curl -sS https://getcomposer.org/composer.phar -o composer.phar
php composer.phar install</pre>
                
                <h4>Método 3: Upload Manual da Pasta Vendor</h4>
                <ol>
                    <li>Baixe um projeto Laravel funcionando</li>
                    <li>Copie a pasta <code>vendor</code></li>
                    <li>Faça upload via cPanel File Manager para <code>/home/catalogonet/gme.emmvmfc.com.br/</code></li>
                </ol>
            </div>
            <?php
        }
        ?>

        <div class="step info">
            <h3>🔧 Opções Disponíveis</h3>
            <a href="?action=check" class="btn">🔍 Verificar Status</a>
            <a href="?action=install&step=1" class="btn">🚀 Instalar Composer</a>
            <a href="?action=manual" class="btn">📋 Instruções Manuais</a>
            <a href="install.php" class="btn">⬅️ Voltar para Instalação</a>
        </div>

        <div class="step">
            <h3>ℹ️ Informações do Sistema</h3>
            <p><strong>PHP:</strong> <?php echo PHP_VERSION; ?></p>
            <p><strong>Diretório:</strong> <?php echo getcwd(); ?></p>
            <p><strong>Usuário:</strong> <?php echo get_current_user(); ?></p>
            <p><strong>Memória:</strong> <?php echo ini_get('memory_limit'); ?></p>
            <p><strong>Tempo limite:</strong> <?php echo ini_get('max_execution_time'); ?>s</p>
        </div>
    </div>
</body>
</html>
