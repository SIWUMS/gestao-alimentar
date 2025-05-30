<?php
/**
 * Script para configurar arquivo .env
 * Acesse: gme.emmvmfc.com.br/configurar_env.php
 */

$project_root = '/home/catalogonet/gme.emmvmfc.com.br';
if (is_dir($project_root)) {
    chdir($project_root);
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurar .env - Sistema de Gestão Alimentar</title>
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
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
            border-color: #28a745;
            outline: none;
            box-shadow: 0 0 5px rgba(40, 167, 69, 0.3);
        }
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
        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #5a6268; }
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
        .section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
        }
        .section h3 {
            margin-top: 0;
            color: #28a745;
        }
        .row {
            display: flex;
            gap: 20px;
        }
        .col {
            flex: 1;
        }
        .help-text {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Sistema de Gestão Alimentar</h1>
            <h2>⚙️ Configuração do Arquivo .env</h2>
            <p>Configure as variáveis de ambiente do sistema</p>
        </div>

        <?php
        $action = $_POST['action'] ?? 'form';

        if ($action === 'save') {
            // Processar formulário e salvar .env
            $env_content = '';
            
            // Configurações da aplicação
            $env_content .= "# Configurações da Aplicação\n";
            $env_content .= "APP_NAME=\"" . ($_POST['app_name'] ?? 'Sistema de Gestão Alimentar') . "\"\n";
            $env_content .= "APP_ENV=" . ($_POST['app_env'] ?? 'production') . "\n";
            $env_content .= "APP_KEY=\n";
            $env_content .= "APP_DEBUG=" . ($_POST['app_debug'] ?? 'false') . "\n";
            $env_content .= "APP_URL=" . ($_POST['app_url'] ?? 'https://gme.emmvmfc.com.br') . "\n\n";
            
            // Configurações de log
            $env_content .= "# Configurações de Log\n";
            $env_content .= "LOG_CHANNEL=stack\n";
            $env_content .= "LOG_DEPRECATIONS_CHANNEL=null\n";
            $env_content .= "LOG_LEVEL=" . ($_POST['log_level'] ?? 'error') . "\n\n";
            
            // Configurações do banco
            $env_content .= "# Configurações do Banco de Dados\n";
            $env_content .= "DB_CONNECTION=mysql\n";
            $env_content .= "DB_HOST=" . ($_POST['db_host'] ?? '127.0.0.1') . "\n";
            $env_content .= "DB_PORT=" . ($_POST['db_port'] ?? '3306') . "\n";
            $env_content .= "DB_DATABASE=" . ($_POST['db_database'] ?? '') . "\n";
            $env_content .= "DB_USERNAME=" . ($_POST['db_username'] ?? '') . "\n";
            $env_content .= "DB_PASSWORD=" . ($_POST['db_password'] ?? '') . "\n\n";
            
            // Configurações de cache e sessão
            $env_content .= "# Configurações de Cache e Sessão\n";
            $env_content .= "BROADCAST_DRIVER=log\n";
            $env_content .= "CACHE_DRIVER=file\n";
            $env_content .= "FILESYSTEM_DISK=local\n";
            $env_content .= "QUEUE_CONNECTION=sync\n";
            $env_content .= "SESSION_DRIVER=file\n";
            $env_content .= "SESSION_LIFETIME=120\n\n";
            
            // Configurações de email
            $env_content .= "# Configurações de Email\n";
            $env_content .= "MAIL_MAILER=" . ($_POST['mail_mailer'] ?? 'smtp') . "\n";
            $env_content .= "MAIL_HOST=" . ($_POST['mail_host'] ?? '') . "\n";
            $env_content .= "MAIL_PORT=" . ($_POST['mail_port'] ?? '587') . "\n";
            $env_content .= "MAIL_USERNAME=" . ($_POST['mail_username'] ?? '') . "\n";
            $env_content .= "MAIL_PASSWORD=" . ($_POST['mail_password'] ?? '') . "\n";
            $env_content .= "MAIL_ENCRYPTION=" . ($_POST['mail_encryption'] ?? 'tls') . "\n";
            $env_content .= "MAIL_FROM_ADDRESS=\"" . ($_POST['mail_from'] ?? 'noreply@gme.emmvmfc.com.br') . "\"\n";
            $env_content .= "MAIL_FROM_NAME=\"Sistema de Gestão Alimentar\"\n\n";
            
            // Configurações específicas do sistema
            $env_content .= "# Configurações Específicas do Sistema\n";
            $env_content .= "SISTEMA_NOME=\"Sistema de Gestão Alimentar\"\n";
            $env_content .= "SISTEMA_VERSAO=\"1.0.0\"\n";
            $env_content .= "SISTEMA_AUTOR=\"CB. Wallison\"\n\n";
            
            // Configurações de timezone
            $env_content .= "# Configurações de Timezone e Locale\n";
            $env_content .= "APP_TIMEZONE=America/Sao_Paulo\n";
            $env_content .= "APP_LOCALE=pt_BR\n";
            $env_content .= "APP_FALLBACK_LOCALE=en\n\n";
            
            // Configurações de segurança
            $env_content .= "# Configurações de Segurança\n";
            $env_content .= "SESSION_SECURE_COOKIE=true\n";
            $env_content .= "SESSION_SAME_SITE=lax\n\n";
            
            // Configurações de estoque
            $env_content .= "# Configurações de Estoque\n";
            $env_content .= "ESTOQUE_ALERTA_MINIMO=" . ($_POST['estoque_alerta'] ?? '10') . "\n";
            $env_content .= "ESTOQUE_ALERTA_EMAIL=true\n\n";
            
            // Salvar arquivo .env
            if (file_put_contents('.env', $env_content)) {
                echo "<div class='step success'>";
                echo "<h3>✅ Arquivo .env criado com sucesso!</h3>";
                echo "<p>O arquivo .env foi salvo em: " . getcwd() . "/.env</p>";
                echo "</div>";
                
                // Tentar gerar chave da aplicação
                echo "<div class='step info'>";
                echo "<h3>🔑 Gerando chave da aplicação...</h3>";
                $output = shell_exec('php artisan key:generate 2>&1');
                if (strpos($output, 'generated') !== false) {
                    echo "<p>✅ Chave gerada com sucesso!</p>";
                } else {
                    echo "<p>⚠️ Execute manualmente: <code>php artisan key:generate</code></p>";
                }
                echo "</div>";
                
                echo "<div class='step'>";
                echo "<h3>🚀 Próximos Passos</h3>";
                echo "<ol>";
                echo "<li><strong>Testar conexão com banco:</strong> <code>php artisan migrate:status</code></li>";
                echo "<li><strong>Executar migrations:</strong> <code>php artisan migrate --seed</code></li>";
                echo "<li><strong>Configurar permissões:</strong> <code>chmod -R 775 storage bootstrap/cache</code></li>";
                echo "<li><strong>Acessar sistema:</strong> <a href='/install.php'>Continuar instalação</a></li>";
                echo "</ol>";
                echo "</div>";
                
                echo "<a href='install.php' class='btn'>➡️ Continuar Instalação</a>";
                echo "<a href='?action=form' class='btn btn-secondary'>🔄 Reconfigurar</a>";
                
            } else {
                echo "<div class='step error'>";
                echo "<h3>❌ Erro ao salvar arquivo .env</h3>";
                echo "<p>Verifique as permissões do diretório.</p>";
                echo "</div>";
            }
        } else {
            // Mostrar formulário
            ?>
            <form method="POST">
                <input type="hidden" name="action" value="save">
                
                <div class="section">
                    <h3>🏢 Configurações da Aplicação</h3>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="app_name">Nome da Aplicação</label>
                                <input type="text" id="app_name" name="app_name" value="Sistema de Gestão Alimentar">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="app_env">Ambiente</label>
                                <select id="app_env" name="app_env">
                                    <option value="production" selected>Produção</option>
                                    <option value="local">Local</option>
                                    <option value="staging">Teste</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="app_url">URL da Aplicação</label>
                                <input type="url" id="app_url" name="app_url" value="https://gme.emmvmfc.com.br">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="app_debug">Debug</label>
                                <select id="app_debug" name="app_debug">
                                    <option value="false" selected>Desabilitado (Produção)</option>
                                    <option value="true">Habilitado (Desenvolvimento)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>🗄️ Configurações do Banco de Dados</h3>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="db_host">Host do Banco</label>
                                <input type="text" id="db_host" name="db_host" value="127.0.0.1">
                                <div class="help-text">Geralmente localhost ou 127.0.0.1</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="db_port">Porta</label>
                                <input type="number" id="db_port" name="db_port" value="3306">
                                <div class="help-text">Porta padrão do MySQL: 3306</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="db_database">Nome do Banco de Dados</label>
                        <input type="text" id="db_database" name="db_database" placeholder="catalogonet_gme">
                        <div class="help-text">Nome do banco criado no cPanel</div>
                    </div>
                    
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="db_username">Usuário do Banco</label>
                                <input type="text" id="db_username" name="db_username" placeholder="catalogonet_gme">
                                <div class="help-text">Usuário criado no cPanel</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="db_password">Senha do Banco</label>
                                <input type="password" id="db_password" name="db_password">
                                <div class="help-text">Senha definida no cPanel</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>📧 Configurações de Email</h3>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_mailer">Tipo de Email</label>
                                <select id="mail_mailer" name="mail_mailer">
                                    <option value="smtp" selected>SMTP</option>
                                    <option value="sendmail">Sendmail</option>
                                    <option value="log">Log (Teste)</option>
                                </select>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_host">Servidor SMTP</label>
                                <input type="text" id="mail_host" name="mail_host" placeholder="smtp.gmail.com">
                                <div class="help-text">Ex: smtp.gmail.com, mail.seudominio.com</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_port">Porta SMTP</label>
                                <input type="number" id="mail_port" name="mail_port" value="587">
                                <div class="help-text">587 (TLS) ou 465 (SSL)</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_encryption">Criptografia</label>
                                <select id="mail_encryption" name="mail_encryption">
                                    <option value="tls" selected>TLS</option>
                                    <option value="ssl">SSL</option>
                                    <option value="">Nenhuma</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_username">Email/Usuário</label>
                                <input type="email" id="mail_username" name="mail_username" placeholder="sistema@gme.emmvmfc.com.br">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="mail_password">Senha do Email</label>
                                <input type="password" id="mail_password" name="mail_password">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="mail_from">Email Remetente</label>
                        <input type="email" id="mail_from" name="mail_from" value="noreply@gme.emmvmfc.com.br">
                        <div class="help-text">Email que aparecerá como remetente</div>
                    </div>
                </div>

                <div class="section">
                    <h3>⚙️ Configurações do Sistema</h3>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="log_level">Nível de Log</label>
                                <select id="log_level" name="log_level">
                                    <option value="error" selected>Error (Produção)</option>
                                    <option value="warning">Warning</option>
                                    <option value="info">Info</option>
                                    <option value="debug">Debug</option>
                                </select>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="estoque_alerta">Alerta de Estoque Mínimo</label>
                                <input type="number" id="estoque_alerta" name="estoque_alerta" value="10">
                                <div class="help-text">Quantidade mínima para alerta</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <button type="submit" class="btn">💾 Salvar Configurações</button>
                    <a href="install.php" class="btn btn-secondary">⬅️ Voltar</a>
                </div>
            </form>
            <?php
        }
        ?>
    </div>
</body>
</html>
