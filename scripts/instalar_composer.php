<?php
/**
 * Script PHP para instalar Composer via browser
 * Útil quando não há acesso SSH
 */

echo "<h1>📦 Instalação do Composer via PHP</h1>";
echo "<hr>";

// Verificar se já existe
if (shell_exec('which composer') !== null) {
    echo "<p style='color: green;'>✅ <strong>Composer já está instalado globalmente!</strong></p>";
    echo "<p>Versão: " . shell_exec('composer --version') . "</p>";
    echo "<p><a href='instalar_dependencias.php'>➡️ Prosseguir para instalação de dependências</a></p>";
    exit;
}

if (file_exists('composer.phar')) {
    echo "<p style='color: green;'>✅ <strong>composer.phar já existe!</strong></p>";
    echo "<p>Versão: " . shell_exec('php composer.phar --version') . "</p>";
    echo "<p><a href='instalar_dependencias.php'>➡️ Prosseguir para instalação de dependências</a></p>";
    exit;
}

echo "<h2>🔍 Verificando Pré-requisitos</h2>";

// Verificar PHP
echo "<h3>🐘 PHP:</h3>";
echo "<p>✅ Versão: " . PHP_VERSION . "</p>";

if (version_compare(PHP_VERSION, '7.4.0', '<')) {
    echo "<p style='color: red;'>❌ PHP muito antigo. Mínimo: 7.4.0</p>";
    exit;
}

// Verificar extensões
echo "<h3>🔌 Extensões PHP:</h3>";
$required_extensions = ['curl', 'openssl', 'phar', 'json', 'mbstring'];
$missing = [];

foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p>✅ $ext</p>";
    } else {
        echo "<p style='color: red;'>❌ $ext (faltando)</p>";
        $missing[] = $ext;
    }
}

if (!empty($missing)) {
    echo "<p style='color: orange;'>⚠️ Extensões faltando: " . implode(', ', $missing) . "</p>";
    echo "<p>Continuando mesmo assim...</p>";
}

// Verificar permissões de escrita
echo "<h3>🔐 Permissões:</h3>";
if (is_writable('.')) {
    echo "<p>✅ Diretório atual tem permissão de escrita</p>";
} else {
    echo "<p style='color: red;'>❌ Sem permissão de escrita no diretório atual</p>";
    exit;
}

echo "<h2>📥 Baixando Composer</h2>";

// Baixar instalador
echo "<p>🌐 Baixando instalador do Composer...</p>";

$installer = file_get_contents('https://getcomposer.org/installer');

if ($installer === false) {
    echo "<p style='color: red;'>❌ Erro ao baixar instalador</p>";
    echo "<p>💡 Tentando download direto do composer.phar...</p>";
    
    // Tentar download direto
    $composer_phar = file_get_contents('https://getcomposer.org/composer.phar');
    
    if ($composer_phar !== false) {
        if (file_put_contents('composer.phar', $composer_phar)) {
            chmod('composer.phar', 0755);
            echo "<p style='color: green;'>✅ composer.phar baixado diretamente!</p>";
            echo "<p>Versão: " . shell_exec('php composer.phar --version') . "</p>";
            echo "<p><a href='instalar_dependencias.php'>➡️ Prosseguir para instalação de dependências</a></p>";
            exit;
        }
    }
    
    echo "<p style='color: red;'>❌ Falha no download direto também</p>";
    echo "<p>💡 <strong>Solução manual:</strong></p>";
    echo "<ol>";
    echo "<li>Baixe composer.phar de <a href='https://getcomposer.org/download/' target='_blank'>https://getcomposer.org/download/</a></li>";
    echo "<li>Faça upload para a pasta do projeto</li>";
    echo "<li>Execute: <code>php composer.phar install</code></li>";
    echo "</ol>";
    exit;
}

// Salvar instalador
if (file_put_contents('composer-setup.php', $installer) === false) {
    echo "<p style='color: red;'>❌ Erro ao salvar instalador</p>";
    exit;
}

echo "<p>✅ Instalador baixado com sucesso</p>";

echo "<h2>🔐 Verificando Integridade</h2>";

// Verificar hash (opcional)
$expected_signature = file_get_contents('https://composer.github.io/installer.sig');
if ($expected_signature !== false) {
    $actual_signature = hash_file('sha384', 'composer-setup.php');
    
    if ($expected_signature === $actual_signature) {
        echo "<p>✅ Assinatura verificada com sucesso</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Assinatura não confere - prosseguindo mesmo assim</p>";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Não foi possível verificar assinatura</p>";
}

echo "<h2>⚙️ Instalando Composer</h2>";

// Executar instalador
echo "<p>🔧 Executando instalador...</p>";

ob_start();
include 'composer-setup.php';
$output = ob_get_clean();

// Limpar instalador
unlink('composer-setup.php');

if (file_exists('composer.phar')) {
    chmod('composer.phar', 0755);
    echo "<p style='color: green;'>✅ <strong>Composer instalado com sucesso!</strong></p>";
    
    // Testar instalação
    $version = shell_exec('php composer.phar --version 2>&1');
    echo "<p>Versão: $version</p>";
    
    echo "<h2>🎉 Instalação Concluída!</h2>";
    echo "<p><strong>Como usar:</strong></p>";
    echo "<ul>";
    echo "<li><code>php composer.phar install</code> - Instalar dependências</li>";
    echo "<li><code>php composer.phar update</code> - Atualizar dependências</li>";
    echo "<li><code>php composer.phar dump-autoload</code> - Regenerar autoload</li>";
    echo "</ul>";
    
    echo "<p><a href='instalar_dependencias.php' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>➡️ Instalar Dependências do Laravel</a></p>";
    
} else {
    echo "<p style='color: red;'>❌ Erro na instalação do Composer</p>";
    echo "<p>Saída do instalador:</p>";
    echo "<pre>$output</pre>";
    
    echo "<p>💡 <strong>Soluções alternativas:</strong></p>";
    echo "<ol>";
    echo "<li>Baixar composer.phar manualmente</li>";
    echo "<li>Usar Composer via cPanel (se disponível)</li>";
    echo "<li>Fazer upload da pasta vendor completa</li>";
    echo "</ol>";
}

echo "<hr>";
echo "<p><small>Script executado em: " . date('d/m/Y H:i:s') . "</small></p>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
h1, h2, h3 { color: #333; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
a { color: #007bff; }
</style>
