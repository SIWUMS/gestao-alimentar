# Instruções para Deploy no cPanel

## Pré-requisitos
- Hospedagem com PHP 8.1 ou superior
- MySQL 5.7 ou superior
- Composer disponível
- cPanel com File Manager

## Passo 1: Preparar os arquivos

1. **Fazer upload dos arquivos:**
   - Faça upload de todos os arquivos do projeto para uma pasta temporária (ex: `temp_sistema`)
   - NÃO coloque direto na pasta `public_html`

2. **Configurar a estrutura de pastas:**
   \`\`\`
   public_html/
   ├── index.php (do Laravel)
   ├── .htaccess
   └── assets/ (CSS, JS, imagens)
   
   private_html/ (ou fora do public_html)
   ├── app/
   ├── config/
   ├── database/
   ├── resources/
   ├── routes/
   ├── storage/
   ├── vendor/
   ├── .env
   └── demais arquivos do Laravel
   \`\`\`

## Passo 2: Configurar o Banco de Dados

1. **Criar banco de dados no cPanel:**
   - Acesse "MySQL Databases"
   - Crie um novo banco: `cpanel_gestao_alimentar`
   - Crie um usuário e associe ao banco com todas as permissões

2. **Configurar .env:**
   - Copie `.env.production` para `.env`
   - Atualize as credenciais do banco:
   \`\`\`
   DB_HOST=localhost
   DB_DATABASE=cpanel_gestao_alimentar
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   \`\`\`

## Passo 3: Instalar Dependências

1. **Via Terminal SSH (se disponível):**
   \`\`\`bash
   cd /home/usuario/private_html
   composer install --optimize-autoloader --no-dev
   php artisan key:generate
   php artisan migrate --seed
   \`\`\`

2. **Via cPanel File Manager (alternativa):**
   - Faça upload da pasta `vendor` completa
   - Execute os comandos via cron job ou script personalizado

## Passo 4: Configurar Permissões

\`\`\`bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R usuario:usuario storage/
chown -R usuario:usuario bootstrap/cache/
\`\`\`

## Passo 5: Configurar o Domínio

1. **Editar index.php no public_html:**
   \`\`\`php
   <?php
   
   use Illuminate\Contracts\Http\Kernel;
   use Illuminate\Http\Request;
   
   define('LARAVEL_START', microtime(true));
   
   // Ajustar o caminho para fora do public_html
   require __DIR__.'/../private_html/vendor/autoload.php';
   
   $app = require_once __DIR__.'/../private_html/bootstrap/app.php';
   
   $kernel = $app->make(Kernel::class);
   
   $response = $kernel->handle(
       $request = Request::capture()
   )->send();
   
   $kernel->terminate($request, $response);
   \`\`\`

## Passo 6: Configurar Email

1. **Criar conta de email no cPanel:**
   - Crie: `sistema@seudominio.com.br`
   
2. **Configurar SMTP no .env:**
   \`\`\`
   MAIL_HOST=mail.seudominio.com.br
   MAIL_PORT=587
   MAIL_USERNAME=sistema@seudominio.com.br
   MAIL_PASSWORD=senha_do_email
   MAIL_ENCRYPTION=tls
   \`\`\`

## Passo 7: Configurar Cron Jobs

1. **Acessar "Cron Jobs" no cPanel**
2. **Adicionar task para verificar estoque:**
   \`\`\`
   0 8 * * * /usr/local/bin/php /home/usuario/private_html/artisan estoque:verificar
   \`\`\`

## Passo 8: Configurações de Segurança

1. **Bloquear acesso às pastas sensíveis:**
   - Adicione `.htaccess` em `/storage/`, `/config/`, etc:
   \`\`\`
   Deny from all
   \`\`\`

2. **Configurar SSL:**
   - Ative SSL/TLS no cPanel
   - Force HTTPS redirection

## Passo 9: Criar Usuário Administrador

Execute via terminal ou crie um script:
\`\`\`php
<?php
// criar_admin.php (temporário)
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@seudominio.com.br',
    'password' => Hash::make('SenhaSuperSegura123!'),
    'role' => 'admin',
]);

echo "Usuário administrador criado!";
\`\`\`

## Passo 10: Testes Finais

1. **Acesse o sistema:**
   - Vá para `https://seudominio.com.br`
   - Teste o login
   - Verifique todas as funcionalidades

2. **Teste email:**
   - Cadastre item com estoque baixo
   - Verifique se os alertas são enviados

## Estrutura Final no Servidor

\`\`\`
/home/usuario/
├── public_html/
│   ├── index.php (Laravel)
│   ├── .htaccess
│   └── assets/
│
├── private_html/ (Sistema Laravel)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── .env
│   └── ...
│
└── logs/
    └── laravel.log
\`\`\`

## Credenciais Padrão

- **Admin:** admin@seudominio.com.br / SenhaSuperSegura123!
- **Nutricionista:** nutricionista@seudominio.com.br / senha123

## Troubleshooting

### Erro 500:
- Verifique permissões das pastas `storage/` e `bootstrap/cache/`
- Confira se o `.env` está configurado corretamente
- Verifique logs em `storage/logs/laravel.log`

### Erro de Banco:
- Confirme credenciais no `.env`
- Execute migrations: `php artisan migrate`

### Erro de Email:
- Teste configurações SMTP
- Verifique se a porta 587 está aberta
- Confirme credenciais da conta de email
