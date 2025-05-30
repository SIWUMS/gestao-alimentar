<?php

$baseDir = dirname(__DIR__);

// Verificar se o arquivo .env existe
if (!file_exists($baseDir . '/.env')) {
    echo "❌ Arquivo .env não encontrado. Criando um arquivo .env padrão...\n";
    copy($baseDir . '/.env.example', $baseDir . '/.env');
    echo "✅ Arquivo .env criado. Por favor, configure-o.\n";
} else {
    echo "✅ Arquivo .env encontrado.\n";
}

// Gerar a key do Laravel se não existir
if (empty(env('APP_KEY'))) {
    echo "🔑 Gerando uma nova chave para o Laravel...\n";
    $command = 'php artisan key:generate';
    chdir($baseDir);
    exec($command, $output, $return_var);

    if ($return_var === 0) {
        echo "✅ Chave gerada com sucesso.\n";
    } else {
        echo "❌ Erro ao gerar a chave.\n";
        print_r($output);
    }
} else {
    echo "✅ A chave do Laravel já existe.\n";
}

// Rodar as migrations
echo "🔄 Rodando as migrations...\n";
$command = 'php artisan migrate';
chdir($baseDir);
exec($command, $output, $return_var);

if ($return_var === 0) {
    echo "✅ Migrations rodadas com sucesso.\n";
} else {
    echo "❌ Erro ao rodar as migrations.\n";
    print_r($output);
}

// Criar diretório storage/app/public se não existir
if (!is_dir($baseDir . '/storage/app/public')) {
    mkdir($baseDir . '/storage/app/public', 0755, true);
    echo "✅ Diretório storage/app/public criado\n";
}

// Criar o link simbólico para storage/app/public
echo "🔗 Criando o link simbólico para storage/app/public...\n";
$command = 'php artisan storage:link';
chdir($baseDir);
exec($command, $output, $return_var);

if ($return_var === 0) {
    echo "✅ Link simbólico criado com sucesso.\n";
} else {
    echo "❌ Erro ao criar o link simbólico.\n";
    print_r($output);
}

// Criar diretório app/Http/Controllers se não existir
if (!is_dir($baseDir . '/app/Http/Controllers')) {
    mkdir($baseDir . '/app/Http/Controllers', 0755, true);
    echo "✅ Diretório app/Http/Controllers criado\n";
}

// Criar diretório Helpers se não existir
if (!is_dir($baseDir . '/app/Helpers')) {
    mkdir($baseDir . '/app/Helpers', 0755, true);
    echo "✅ Diretório app/Helpers criado\n";
}

// Criar arquivo Functions.php se não existir
$functionsFile = $baseDir . '/app/Helpers/Functions.php';
if (!file_exists($functionsFile)) {
    $functionsContent = '<?php

if (!function_exists("formatCurrency")) {
    function formatCurrency($value) {
        return "R$ " . number_format($value, 2, ",", ".");
    }
}

if (!function_exists("formatDate")) {
    function formatDate($date) {
        return date("d/m/Y", strtotime($date));
    }
}

if (!function_exists("formatDateTime")) {
    function formatDateTime($datetime) {
        return date("d/m/Y H:i", strtotime($datetime));
    }
}

if (!function_exists("calculateAge")) {
    function calculateAge($birthdate) {
        $today = new DateTime();
        $birth = new DateTime($birthdate);
        return $today->diff($birth)->y;
    }
}

if (!function_exists("sanitizeString")) {
    function sanitizeString($string) {
        return trim(strip_tags($string));
    }
}
';
    
    file_put_contents($functionsFile, $functionsContent);
    echo "✅ Arquivo app/Helpers/Functions.php criado\n";
}
