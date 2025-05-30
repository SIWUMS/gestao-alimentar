<?php
/**
 * Script de instalação para cPanel
 * Execute este arquivo via browser após fazer upload
 */

// Verificar se o Laravel está configurado
if (!file_exists('../bootstrap/app.php')) {
    die('Erro: Arquivos do Laravel não encontrados. Verifique a estrutura de pastas.');
}

require '../vendor/autoload.php';
$app = require_once '../bootstrap/app.php';

try {
    // Testar conexão com banco
    $pdo = new PDO(
        'mysql:host=' . env('DB_HOST') . ';dbname=' . env('DB_DATABASE'),
        env('DB_USERNAME'),
        env('DB_PASSWORD')
    );
    
    echo "<h2>✅ Conexão com banco de dados OK</h2>";
    
    // Executar migrations
    echo "<h3>Executando migrations...</h3>";
    Artisan::call('migrate:fresh --seed');
    echo "<p>✅ Migrations executadas com sucesso</p>";
    
    // Gerar chave da aplicação
    echo "<h3>Gerando chave da aplicação...</h3>";
    Artisan::call('key:generate');
    echo "<p>✅ Chave gerada com sucesso</p>";
    
    // Criar usuário administrador
    echo "<h3>Criando usuário administrador...</h3>";
    
    $admin = App\Models\User::firstOrCreate(
        ['email' => 'admin@escola.com'],
        [
            'name' => 'Administrador',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]
    );
    
    echo "<p>✅ Usuário administrador criado:</p>";
    echo "<p><strong>Email:</strong> admin@escola.com</p>";
    echo "<p><strong>Senha:</strong> admin123</p>";
    
    echo "<h2>🎉 Instalação concluída com sucesso!</h2>";
    echo "<p><a href='/dashboard' class='btn btn-success'>Acessar Sistema</a></p>";
    
    // Remover script de instalação
    echo "<script>
        setTimeout(function() {
            if(confirm('Instalação concluída! Deseja remover este script por segurança?')) {
                fetch('install.php?remove=1');
                window.location.href = '/dashboard';
            }
        }, 3000);
    </script>";
    
} catch (Exception $e) {
    echo "<h2>❌ Erro na instalação:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Verifique as configurações do banco de dados no arquivo .env</p>";
}

// Remover script se solicitado
if (isset($_GET['remove'])) {
    unlink(__FILE__);
    echo "Script removido com sucesso!";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Instalação - Sistema de Gestão Alimentar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h4>🍽️ Sistema de Gestão Alimentar - Instalação</h4>
                    </div>
                    <div class="card-body">
                        <!-- Conteúdo gerado pelo PHP acima -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
