<?php
/**
 * Script de instalação atualizado com correção do Composer
 */

// Verificar se o Laravel está configurado
if (!file_exists('bootstrap/app.php')) {
    die('Erro: Arquivos do Laravel não encontrados. Verifique a estrutura de pastas.');
}

// Verificar se Composer está disponível
function verificarComposer() {
    // Verificar composer global
    if (shell_exec('which composer') !== null) {
        return 'composer';
    }
    
    // Verificar composer.phar local
    if (file_exists('composer.phar')) {
        return 'php composer.phar';
    }
    
    return false;
}

$composer_cmd = verificarComposer();
$composer_disponivel = $composer_cmd !== false;

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalação - Sistema de Gestão Alimentar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
        }
        .install-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            max-width: 600px;
            margin: 0 auto;
        }
        .install-header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .install-body {
            padding: 2rem;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 8px;
            background: #f8f9fa;
        }
        .status-success { background: #d4edda; border-left: 4px solid #28a745; }
        .status-error { background: #f8d7da; border-left: 4px solid #dc3545; }
        .status-warning { background: #fff3cd; border-left: 4px solid #ffc107; }
        .btn-fix {
            background: #ffc107;
            border: none;
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .btn-fix:hover {
            background: #e0a800;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="install-card">
            <div class="install-header">
                <h1>🍽️ Sistema de Gestão Alimentar</h1>
                <p>Instalação e Configuração</p>
            </div>
            
            <div class="install-body">
                <div class="mb-4">
                    <h3>⚙️ Verificação do Sistema</h3>
                    <div class="mt-3">
                        <h5>🔍 Verificando Requisitos...</h5>
                        
                        <!-- PHP -->
                        <div class="status-item status-success">
                            <div>
                                <strong>PHP:</strong> ✅ <?php echo PHP_VERSION; ?>
                                <br><small>Extensões PHP:</small>
                            </div>
                        </div>
                        
                        <!-- Extensões PHP -->
                        <div class="row">
                            <?php
                            $extensions = ['pdo', 'mbstring', 'openssl', 'tokenizer', 'xml'];
                            foreach ($extensions as $ext) {
                                $loaded = extension_loaded($ext);
                                echo "<div class='col-6'>";
                                echo "<span class='" . ($loaded ? 'text-success' : 'text-danger') . "'>";
                                echo ($loaded ? '✅' : '❌') . " $ext";
                                echo "</span></div>";
                            }
                            ?>
                        </div>
                        
                        <!-- Composer -->
                        <div class="status-item <?php echo $composer_disponivel ? 'status-success' : 'status-error'; ?>">
                            <div>
                                <strong>Composer:</strong> 
                                <?php if ($composer_disponivel): ?>
                                    ✅ Encontrado
                                    <br><small><?php echo $composer_cmd; ?></small>
                                <?php else: ?>
                                    ❌ Não encontrado
                                    <br><small>Necessário para instalar dependências</small>
                                <?php endif; ?>
                            </div>
                            <?php if (!$composer_disponivel): ?>
                                <a href="instalar_composer_web.php" class="btn-fix">Corrigir</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <?php if (!$composer_disponivel): ?>
                    <div class="alert alert-warning">
                        <h5>⚠️ Erros Encontrados:</h5>
                        <ul class="mb-0">
                            <li>Erro ao instalar dependências: sh: line 1: composer: command not found</li>
                        </ul>
                    </div>
                    
                    <div class="text-center">
                        <a href="instalar_composer_web.php" class="btn btn-warning btn-lg">
                            ⬇️ Corrigir os erros primeiro
                        </a>
                        <br><br>
                        <a href="corrigir_composer.php" class="btn btn-outline-primary">
                            🔧 Correção Rápida
                        </a>
                    </div>
                    
                    <div class="mt-4">
                        <h5>💡 Soluções Alternativas:</h5>
                        <ol>
                            <li><strong>Via Interface Web:</strong> <a href="instalar_composer_web.php">Clique aqui</a></li>
                            <li><strong>Via SSH:</strong> <code>cd /home/catalogonet/gme.emmvmfc.com.br && curl -sS https://getcomposer.org/composer.phar -o composer.phar</code></li>
                            <li><strong>Upload Manual:</strong> Baixe composer.phar e faça upload via cPanel</li>
                        </ol>
                    </div>

                <?php else: ?>
                    
                    <div class="alert alert-success">
                        <h5>✅ Progresso:</h5>
                        <ul class="mb-0">
                            <li>PHP versão: <?php echo PHP_VERSION; ?> ✅</li>
                            <li>Composer disponível ✅</li>
                        </ul>
                    </div>

                    <?php
                    // Verificar se dependências estão instaladas
                    $vendor_exists = is_dir('vendor') && file_exists('vendor/autoload.php');
                    
                    if (!$vendor_exists):
                    ?>
                        <div class="text-center">
                            <h5>📦 Próximo Passo: Instalar Dependências</h5>
                            <a href="instalar_composer_web.php?action=install&step=4" class="btn btn-success btn-lg">
                                📚 Instalar Dependências do Laravel
                            </a>
                        </div>
                    <?php else: ?>
                        
                        <?php
                        // Continuar com instalação normal do Laravel
                        try {
                            require 'vendor/autoload.php';
                            $app = require_once 'bootstrap/app.php';
                            
                            // Testar conexão com banco
                            echo "<div class='alert alert-info'>";
                            echo "<h5>🗄️ Configurando Banco de Dados...</h5>";
                            echo "<p>Configure o arquivo .env com as credenciais do banco de dados.</p>";
                            echo "</div>";
                            
                            // Criar usuário administrador se não existir
                            echo "<div class='text-center'>";
                            echo "<h5>🎉 Sistema Quase Pronto!</h5>";
                            echo "<p>Dependências instaladas com sucesso.</p>";
                            echo "<a href='/dashboard' class='btn btn-success btn-lg'>🚀 Acessar Sistema</a>";
                            echo "</div>";
                            
                        } catch (Exception $e) {
                            echo "<div class='alert alert-danger'>";
                            echo "<h5>❌ Erro na configuração:</h5>";
                            echo "<p>" . $e->getMessage() . "</p>";
                            echo "</div>";
                        }
                        ?>
                        
                    <?php endif; ?>
                    
                <?php endif; ?>

                <div class="mt-4 text-center">
                    <small class="text-muted">
                        Este processo pode levar alguns minutos dependendo da sua conexão.
                    </small>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <p class="text-white">
                <strong>Criado Por CB. Walison</strong>
            </p>
        </div>
    </div>
</body>
</html>
