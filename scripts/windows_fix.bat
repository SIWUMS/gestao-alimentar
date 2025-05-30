@echo off
echo 🔧 CORREÇÃO PARA WINDOWS - Sistema de Gestão Alimentar
echo =====================================================

REM Verificar se estamos no diretório correto
if not exist "artisan" (
    echo ❌ Arquivo 'artisan' não encontrado!
    echo 💡 Execute este script na pasta raiz do projeto Laravel
    pause
    exit /b 1
)

echo ✅ Projeto Laravel detectado
echo.

echo 📁 Criando estrutura de diretórios...
echo ------------------------------------

REM Criar diretórios essenciais
if not exist "storage" mkdir storage
if not exist "storage\app" mkdir storage\app
if not exist "storage\app\public" mkdir storage\app\public
if not exist "storage\framework" mkdir storage\framework
if not exist "storage\framework\cache" mkdir storage\framework\cache
if not exist "storage\framework\cache\data" mkdir storage\framework\cache\data
if not exist "storage\framework\sessions" mkdir storage\framework\sessions
if not exist "storage\framework\views" mkdir storage\framework\views
if not exist "storage\logs" mkdir storage\logs
if not exist "bootstrap" mkdir bootstrap
if not exist "bootstrap\cache" mkdir bootstrap\cache

echo ✅ Diretórios criados

echo.
echo 🔐 Configurando permissões (Windows)...
echo ---------------------------------------

REM No Windows, usar icacls para configurar permissões
icacls storage /grant Everyone:(OI)(CI)F /T >nul 2>&1
icacls bootstrap\cache /grant Everyone:(OI)(CI)F /T >nul 2>&1

echo ✅ Permissões configuradas

echo.
echo 📄 Criando arquivos necessários...
echo ----------------------------------

REM Criar arquivos .gitkeep
echo. > storage\app\.gitkeep
echo. > storage\app\public\.gitkeep
echo. > storage\framework\cache\.gitkeep
echo. > storage\framework\cache\data\.gitkeep
echo. > storage\framework\sessions\.gitkeep
echo. > storage\framework\views\.gitkeep
echo. > storage\logs\.gitkeep
echo. > bootstrap\cache\.gitkeep

REM Criar arquivo de log
if not exist "storage\logs\laravel.log" echo. > storage\logs\laravel.log

echo ✅ Arquivos criados

echo.
echo 📦 Verificando Composer...
echo -------------------------

REM Verificar se Composer está disponível
composer --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Composer encontrado globalmente
    set COMPOSER_CMD=composer
) else (
    if exist "composer.phar" (
        echo ✅ composer.phar encontrado
        set COMPOSER_CMD=php composer.phar
    ) else (
        echo ❌ Composer não encontrado
        echo 💡 Baixe de https://getcomposer.org/download/
        set COMPOSER_CMD=
    )
)

echo.
echo ⚙️ Configurando Laravel...
echo -------------------------

REM Copiar .env se não existir
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ✅ Arquivo .env criado
    ) else (
        echo ⚠️ Crie o arquivo .env manualmente
    )
)

echo.
echo 🧪 Testando sistema...
echo ---------------------

REM Testar escrita nos diretórios
echo teste > storage\teste.tmp 2>nul
if exist "storage\teste.tmp" (
    del storage\teste.tmp
    echo ✅ storage - Escrita OK
) else (
    echo ❌ storage - Sem permissão de escrita
)

echo teste > bootstrap\cache\teste.tmp 2>nul
if exist "bootstrap\cache\teste.tmp" (
    del bootstrap\cache\teste.tmp
    echo ✅ bootstrap\cache - Escrita OK
) else (
    echo ❌ bootstrap\cache - Sem permissão de escrita
)

echo.
echo 📊 RELATÓRIO FINAL
echo ==================

echo ✅ Estrutura de diretórios criada
echo ✅ Permissões configuradas para Windows
echo ✅ Arquivos necessários criados

if defined COMPOSER_CMD (
    echo ✅ Composer disponível
    echo.
    echo 📋 Próximos passos:
    echo 1. Configure o arquivo .env
    echo 2. Execute: %COMPOSER_CMD% install
    echo 3. Execute: php artisan key:generate
    echo 4. Execute: php artisan migrate --seed
) else (
    echo ⚠️ Instale o Composer
    echo.
    echo 📋 Próximos passos:
    echo 1. Instale Composer de https://getcomposer.org/
    echo 2. Configure o arquivo .env
    echo 3. Execute: composer install
    echo 4. Execute: php artisan key:generate
    echo 5. Execute: php artisan migrate --seed
)

echo.
echo 🎉 Configuração concluída!
echo.
pause
