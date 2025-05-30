#!/bin/bash

# ========================================
# DEPLOY DO SISTEMA DE GESTÃO ALIMENTAR
# Para VPS Ubuntu 24.04 já configurado
# ========================================

echo "🚀 DEPLOY DO SISTEMA DE GESTÃO ALIMENTAR"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (sudo)"
   exit 1
fi

# ========================================
# CONFIGURAÇÕES
# ========================================
APP_DIR="/var/www/gestao-alimentar"
REPO_URL="https://github.com/SEU_USUARIO/gestao-alimentar.git"  # Substitua pela URL do seu repositório
DB_NAME="gestao_alimentar"
DB_USER="gestao_user"
DB_PASS="senha_super_segura_123!"

log "📁 Preparando diretório da aplicação..."

# Backup se já existir
if [ -d "$APP_DIR" ]; then
    warning "Diretório já existe. Fazendo backup..."
    mv $APP_DIR $APP_DIR.backup.$(date +%Y%m%d_%H%M%S)
fi

# Criar diretório
mkdir -p $APP_DIR
cd $APP_DIR

# ========================================
# OPÇÃO 1: CLONE DO REPOSITÓRIO GIT
# ========================================
if [ ! -z "$REPO_URL" ] && [ "$REPO_URL" != "https://github.com/SEU_USUARIO/gestao-alimentar.git" ]; then
    log "📥 Clonando repositório..."
    git clone $REPO_URL .
else
    # ========================================
    # OPÇÃO 2: UPLOAD MANUAL DOS ARQUIVOS
    # ========================================
    warning "Configure a URL do repositório ou faça upload manual dos arquivos"
    info "Para upload manual:"
    info "1. Faça upload dos arquivos para: $APP_DIR"
    info "2. Execute novamente este script"
    exit 1
fi

# ========================================
# CONFIGURAÇÃO DE PERMISSÕES
# ========================================
log "🔒 Configurando permissões..."
chown -R gestao:www-data $APP_DIR
find $APP_DIR -type f -exec chmod 644 {} \;
find $APP_DIR -type d -exec chmod 755 {} \;
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

# ========================================
# INSTALAÇÃO DE DEPENDÊNCIAS
# ========================================
log "📦 Instalando dependências do Composer..."
cd $APP_DIR

# Instalar dependências PHP
sudo -u gestao composer install --optimize-autoloader --no-dev

# ========================================
# CONFIGURAÇÃO DO AMBIENTE
# ========================================
log "⚙️ Configurando arquivo .env..."

# Criar arquivo .env
cat > .env << EOF
APP_NAME="Sistema de Gestão Alimentar"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://$(curl -s ifconfig.me)

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=$DB_NAME
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASS

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="sistema@gestaoalimentar.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="\${APP_NAME}"
VITE_PUSHER_APP_KEY="\${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="\${PUSHER_HOST}"
VITE_PUSHER_PORT="\${PUSHER_PORT}"
VITE_PUSHER_SCHEME="\${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="\${PUSHER_APP_CLUSTER}"

# Configurações específicas do sistema
APP_TIMEZONE=America/Sao_Paulo
EOF

# Gerar chave da aplicação
log "🔑 Gerando chave da aplicação..."
sudo -u gestao php artisan key:generate

# ========================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ========================================
log "🗄️ Configurando banco de dados..."

# Executar migrations
sudo -u gestao php artisan migrate --force

# Executar seeders
sudo -u gestao php artisan db:seed --force

# ========================================
# OTIMIZAÇÕES DE PRODUÇÃO
# ========================================
log "⚡ Aplicando otimizações de produção..."

# Cache de configuração
sudo -u gestao php artisan config:cache

# Cache de rotas
sudo -u gestao php artisan route:cache

# Cache de views
sudo -u gestao php artisan view:cache

# Otimizar autoload
sudo -u gestao composer dump-autoload --optimize

# ========================================
# CONFIGURAÇÃO DE ASSETS
# ========================================
if [ -f "package.json" ]; then
    log "🎨 Compilando assets..."
    sudo -u gestao npm install
    sudo -u gestao npm run build
fi

# Link simbólico para storage
sudo -u gestao php artisan storage:link

# ========================================
# CONFIGURAÇÃO DE LOGS
# ========================================
log "📝 Configurando logs..."
mkdir -p $APP_DIR/storage/logs
chown -R gestao:www-data $APP_DIR/storage/logs
chmod -R 775 $APP_DIR/storage/logs

# ========================================
# CONFIGURAÇÃO DE CRON JOBS
# ========================================
log "⏰ Configurando tarefas agendadas..."

# Adicionar cron job para o Laravel Scheduler
(sudo -u gestao crontab -l 2>/dev/null; echo "* * * * * cd $APP_DIR && php artisan schedule:run >> /dev/null 2>&1") | sudo -u gestao crontab -

# ========================================
# CONFIGURAÇÃO DE SSL (OPCIONAL)
# ========================================
read -p "Deseja configurar SSL com Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "🔒 Instalando Certbot..."
    apt install -y certbot python3-certbot-nginx
    
    read -p "Digite seu domínio (ex: gestao.seudominio.com): " DOMAIN
    if [ ! -z "$DOMAIN" ]; then
        log "🔒 Configurando SSL para $DOMAIN..."
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        # Atualizar .env com HTTPS
        sed -i "s|APP_URL=http://.*|APP_URL=https://$DOMAIN|g" $APP_DIR/.env
        sudo -u gestao php artisan config:cache
    fi
fi

# ========================================
# CRIAR USUÁRIO ADMINISTRADOR
# ========================================
log "👤 Criando usuário administrador..."

sudo -u gestao php artisan tinker --execute="
\$user = new App\Models\User();
\$user->name = 'Administrador';
\$user->email = 'admin@gestaoalimentar.com';
\$user->password = Hash::make('Admin123!@#');
\$user->role = 'admin';
\$user->save();
echo 'Usuário administrador criado com sucesso!';
"

# ========================================
# REINICIAR SERVIÇOS
# ========================================
log "🔄 Reiniciando serviços..."
systemctl restart nginx
systemctl restart php8.2-fpm

# ========================================
# VERIFICAÇÕES FINAIS
# ========================================
log "✅ Executando verificações finais..."

# Testar conexão com banco
if sudo -u gestao php artisan migrate:status > /dev/null 2>&1; then
    info "✅ Conexão com banco de dados OK"
else
    error "❌ Problema na conexão com banco de dados"
fi

# Testar aplicação
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|302"; then
    info "✅ Aplicação respondendo OK"
else
    warning "⚠️ Aplicação pode não estar respondendo corretamente"
fi

# ========================================
# RELATÓRIO FINAL
# ========================================
echo ""
echo "=========================================="
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "=========================================="
echo ""
echo "🌐 ACESSO AO SISTEMA:"
echo "• URL: http://$(curl -s ifconfig.me)"
if [ ! -z "$DOMAIN" ]; then
    echo "• Domínio: https://$DOMAIN"
fi
echo ""
echo "👤 CREDENCIAIS DE ADMINISTRADOR:"
echo "• Email: admin@gestaoalimentar.com"
echo "• Senha: Admin123!@#"
echo ""
echo "🗄️ BANCO DE DADOS:"
echo "• Host: localhost"
echo "• Banco: $DB_NAME"
echo "• Usuário: $DB_USER"
echo "• Senha: $DB_PASS"
echo ""
echo "📁 DIRETÓRIOS IMPORTANTES:"
echo "• Aplicação: $APP_DIR"
echo "• Logs: $APP_DIR/storage/logs"
echo "• Backup: /backup/gestao-alimentar"
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "• Ver logs: tail -f $APP_DIR/storage/logs/laravel.log"
echo "• Limpar cache: cd $APP_DIR && php artisan cache:clear"
echo "• Backup manual: /usr/local/bin/backup-gestao.sh"
echo ""
echo "=========================================="

log "✅ Deploy finalizado com sucesso!"
