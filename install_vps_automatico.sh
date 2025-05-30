#!/bin/bash

# ========================================
# INSTALADOR AUTOMÁTICO VPS
# Sistema de Gestão Alimentar
# Domínio: gestor.emmvmfc.com.br
# ========================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configurações
DOMAIN="gestor.emmvmfc.com.br"
APP_DIR="/var/www/html/cardapio"
DB_NAME="gestao_alimentar"
DB_USER="gestao_user"
DB_PASS="GestaoAlimentar2024!@#"
ADMIN_EMAIL="admin@emmvmfc.com.br"
ADMIN_PASS="Admin123!@#"

# Funções de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] ❌ $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] ⚠️ $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] ℹ️ $1${NC}"
}

step() {
    echo -e "${PURPLE}[PASSO] 🔄 $1${NC}"
}

success() {
    echo -e "${CYAN}[SUCESSO] 🎉 $1${NC}"
}

# Banner inicial
clear
echo -e "${CYAN}"
echo "=========================================="
echo "🚀 INSTALADOR AUTOMÁTICO VPS"
echo "Sistema de Gestão Alimentar"
echo "=========================================="
echo -e "${NC}"
echo "📍 Domínio: $DOMAIN"
echo "📁 Diretório: $APP_DIR"
echo "🗄️ Banco: $DB_NAME"
echo "=========================================="
echo ""

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (sudo)"
fi

# Confirmação
read -p "🤔 Deseja continuar com a instalação? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Instalação cancelada pelo usuário"
fi

# ========================================
# PASSO 1: ATUALIZAR SISTEMA
# ========================================
step "Atualizando sistema operacional..."
export DEBIAN_FRONTEND=noninteractive
apt update -y
apt upgrade -y
log "Sistema atualizado com sucesso"

# ========================================
# PASSO 2: INSTALAR DEPENDÊNCIAS BÁSICAS
# ========================================
step "Instalando dependências básicas..."
apt install -y \
    curl \
    wget \
    unzip \
    git \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    nano \
    vim \
    ufw \
    fail2ban

log "Dependências básicas instaladas"

# ========================================
# PASSO 3: INSTALAR NGINX
# ========================================
step "Instalando Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
log "Nginx instalado e iniciado"

# ========================================
# PASSO 4: INSTALAR PHP 8.2
# ========================================
step "Instalando PHP 8.2 e extensões..."
add-apt-repository -y ppa:ondrej/php
apt update -y

apt install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-gd \
    php8.2-bcmath \
    php8.2-json \
    php8.2-intl \
    php8.2-readline \
    php8.2-tokenizer \
    php8.2-fileinfo \
    php8.2-opcache \
    php8.2-cli

systemctl enable php8.2-fpm
systemctl start php8.2-fpm
log "PHP 8.2 instalado com todas as extensões"

# ========================================
# PASSO 5: CONFIGURAR PHP
# ========================================
step "Configurando PHP para produção..."

# Configuração PHP-FPM
cat > /etc/php/8.2/fpm/conf.d/99-gestao-alimentar.ini << 'EOF'
; Configurações para Sistema de Gestão Alimentar
memory_limit = 512M
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
max_input_time = 300
max_input_vars = 3000
date.timezone = America/Sao_Paulo

; OPcache
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
opcache.save_comments = 1
opcache.enable_file_override = 1

; Session
session.gc_maxlifetime = 7200
session.cookie_lifetime = 0
session.cookie_secure = 1
session.cookie_httponly = 1
session.use_strict_mode = 1

; Security
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off
EOF

# Configuração PHP CLI
cp /etc/php/8.2/fpm/conf.d/99-gestao-alimentar.ini /etc/php/8.2/cli/conf.d/

systemctl restart php8.2-fpm
log "PHP configurado para produção"

# ========================================
# PASSO 6: INSTALAR MYSQL
# ========================================
step "Instalando MySQL 8.0..."
apt install -y mysql-server mysql-client

# Configurar MySQL
systemctl enable mysql
systemctl start mysql

# Configuração segura do MySQL
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootPass123!@#';"
mysql -u root -pRootPass123!@# -e "DELETE FROM mysql.user WHERE User='';"
mysql -u root -pRootPass123!@# -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -u root -pRootPass123!@# -e "DROP DATABASE IF EXISTS test;"
mysql -u root -pRootPass123!@# -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -u root -pRootPass123!@# -e "FLUSH PRIVILEGES;"

log "MySQL instalado e configurado"

# ========================================
# PASSO 7: CRIAR BANCO DE DADOS
# ========================================
step "Criando banco de dados e usuário..."

mysql -u root -pRootPass123!@# << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

log "Banco de dados '$DB_NAME' criado com usuário '$DB_USER'"

# ========================================
# PASSO 8: INSTALAR COMPOSER
# ========================================
step "Instalando Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
log "Composer instalado globalmente"

# ========================================
# PASSO 9: INSTALAR NODE.JS (para assets)
# ========================================
step "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
log "Node.js $(node --version) instalado"

# ========================================
# PASSO 10: CRIAR USUÁRIO DO SISTEMA
# ========================================
step "Criando usuário do sistema..."
if ! id "gestao" &>/dev/null; then
    useradd -m -s /bin/bash gestao
    usermod -aG www-data gestao
    log "Usuário 'gestao' criado"
else
    log "Usuário 'gestao' já existe"
fi

# ========================================
# PASSO 11: PREPARAR DIRETÓRIO DA APLICAÇÃO
# ========================================
step "Preparando diretório da aplicação..."

# Backup se existir
if [ -d "$APP_DIR" ]; then
    warning "Diretório já existe. Fazendo backup..."
    mv $APP_DIR $APP_DIR.backup.$(date +%Y%m%d_%H%M%S)
fi

# Criar diretório
mkdir -p $APP_DIR
cd $APP_DIR

log "Diretório '$APP_DIR' preparado"

# ========================================
# PASSO 12: CRIAR APLICAÇÃO LARAVEL
# ========================================
step "Criando aplicação Laravel..."

# Instalar Laravel via Composer
composer create-project laravel/laravel . --prefer-dist --no-dev
log "Laravel instalado"

# ========================================
# PASSO 13: CONFIGURAR APLICAÇÃO
# ========================================
step "Configurando aplicação..."

# Criar arquivo .env
cat > .env << EOF
APP_NAME="Sistema de Gestão Alimentar"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://$DOMAIN

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
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@emmvmfc.com.br"
MAIL_FROM_NAME="Sistema de Gestão Alimentar"

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

VITE_PUSHER_APP_KEY="\${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="\${PUSHER_HOST}"
VITE_PUSHER_PORT="\${PUSHER_PORT}"
VITE_PUSHER_SCHEME="\${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="\${PUSHER_APP_CLUSTER}"

APP_TIMEZONE=America/Sao_Paulo
EOF

# Gerar chave da aplicação
php artisan key:generate --force

log "Aplicação configurada"

# ========================================
# PASSO 14: CONFIGURAR PERMISSÕES
# ========================================
step "Configurando permissões..."

chown -R gestao:www-data $APP_DIR
find $APP_DIR -type f -exec chmod 644 {} \;
find $APP_DIR -type d -exec chmod 755 {} \;
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

log "Permissões configuradas"

# ========================================
# PASSO 15: CONFIGURAR NGINX
# ========================================
step "Configurando Nginx para $DOMAIN..."

cat > /etc/nginx/sites-available/gestao-alimentar << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    root $APP_DIR/public;
    index index.php index.html index.htm;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Handle Laravel routes
    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    # PHP-FPM configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        
        # Security
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_read_timeout 300;
    }

    # Deny access to sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|tar|gz)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Deny access to uploads directory PHP files
    location ~* /uploads/.*\.php$ {
        deny all;
    }

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    location ~ ^/(login|register|password) {
        limit_req zone=login burst=5 nodelay;
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    # File upload size
    client_max_body_size 100M;

    # Logs
    access_log /var/log/nginx/gestao-alimentar.access.log;
    error_log /var/log/nginx/gestao-alimentar.error.log;
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/gestao-alimentar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t
systemctl reload nginx

log "Nginx configurado para $DOMAIN"

# ========================================
# PASSO 16: CONFIGURAR FIREWALL
# ========================================
step "Configurando firewall..."

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow mysql
ufw --force enable

log "Firewall configurado"

# ========================================
# PASSO 17: CONFIGURAR FAIL2BAN
# ========================================
step "Configurando Fail2Ban..."

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/gestao-alimentar.error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/gestao-alimentar.error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl restart fail2ban

log "Fail2Ban configurado"

# ========================================
# PASSO 18: INSTALAR SSL (LET'S ENCRYPT)
# ========================================
step "Instalando SSL com Let's Encrypt..."

apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL --redirect

# Configurar renovação automática
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

log "SSL configurado para $DOMAIN"

# ========================================
# PASSO 19: EXECUTAR MIGRATIONS
# ========================================
step "Executando migrations do banco..."

cd $APP_DIR
php artisan migrate --force

log "Migrations executadas"

# ========================================
# PASSO 20: CRIAR USUÁRIO ADMINISTRADOR
# ========================================
step "Criando usuário administrador..."

php artisan tinker --execute="
\$user = new App\Models\User();
\$user->name = 'Administrador';
\$user->email = '$ADMIN_EMAIL';
\$user->password = Hash::make('$ADMIN_PASS');
\$user->email_verified_at = now();
\$user->save();
echo 'Usuário administrador criado!';
"

log "Usuário administrador criado"

# ========================================
# PASSO 21: OTIMIZAÇÕES DE PRODUÇÃO
# ========================================
step "Aplicando otimizações de produção..."

# Cache de configuração
php artisan config:cache

# Cache de rotas
php artisan route:cache

# Cache de views
php artisan view:cache

# Otimizar autoload
composer dump-autoload --optimize

# Link simbólico para storage
php artisan storage:link

log "Otimizações aplicadas"

# ========================================
# PASSO 22: CONFIGURAR LOGS
# ========================================
step "Configurando sistema de logs..."

mkdir -p /var/log/gestao-alimentar
chown gestao:www-data /var/log/gestao-alimentar
chmod 755 /var/log/gestao-alimentar

# Configurar logrotate
cat > /etc/logrotate.d/gestao-alimentar << 'EOF'
/var/log/gestao-alimentar/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 gestao www-data
}

/var/www/html/cardapio/storage/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 gestao www-data
}
EOF

log "Sistema de logs configurado"

# ========================================
# PASSO 23: CONFIGURAR BACKUP AUTOMÁTICO
# ========================================
step "Configurando backup automático..."

mkdir -p /backup/gestao-alimentar

cat > /usr/local/bin/backup-gestao.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/gestao-alimentar"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/html/cardapio"

# Backup do banco
mysqldump -u gestao_user -pGestaoAlimentar2024!@# gestao_alimentar > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C /var/www/html cardapio

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup realizado com sucesso" >> /var/log/gestao-alimentar/backup.log
EOF

chmod +x /usr/local/bin/backup-gestao.sh

# Agendar backup diário às 2h
echo "0 2 * * * /usr/local/bin/backup-gestao.sh" | crontab -

log "Backup automático configurado"

# ========================================
# PASSO 24: CONFIGURAR MONITORAMENTO
# ========================================
step "Configurando monitoramento..."

cat > /usr/local/bin/monitor-gestao.sh << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/gestao-alimentar/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Verificar serviços
services=("nginx" "php8.2-fpm" "mysql")
for service in "${services[@]}"; do
    if ! systemctl is-active --quiet $service; then
        echo "$DATE: ERRO - Serviço $service não está rodando" >> $LOG_FILE
        systemctl restart $service
        echo "$DATE: INFO - Serviço $service reiniciado" >> $LOG_FILE
    fi
done

# Verificar espaço em disco
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
    echo "$DATE: AVISO - Uso de disco alto: ${disk_usage}%" >> $LOG_FILE
fi

# Verificar uso de memória
mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $mem_usage -gt 80 ]; then
    echo "$DATE: AVISO - Uso de memória alto: ${mem_usage}%" >> $LOG_FILE
fi

# Verificar se o site está respondendo
if ! curl -s -f https://gestor.emmvmfc.com.br > /dev/null; then
    echo "$DATE: ERRO - Site não está respondendo" >> $LOG_FILE
fi
EOF

chmod +x /usr/local/bin/monitor-gestao.sh

# Agendar monitoramento a cada 5 minutos
echo "*/5 * * * * /usr/local/bin/monitor-gestao.sh" | crontab -

log "Monitoramento configurado"

# ========================================
# PASSO 25: VERIFICAÇÕES FINAIS
# ========================================
step "Executando verificações finais..."

# Testar conexão com banco
if php artisan migrate:status > /dev/null 2>&1; then
    success "✅ Conexão com banco de dados OK"
else
    error "❌ Problema na conexão com banco de dados"
fi

# Testar aplicação
sleep 5
if curl -s -f https://$DOMAIN > /dev/null; then
    success "✅ Site está respondendo corretamente"
else
    warning "⚠️ Site pode não estar respondendo - verifique DNS"
fi

# Verificar SSL
if curl -s -I https://$DOMAIN | grep -q "HTTP/2 200"; then
    success "✅ SSL funcionando corretamente"
else
    warning "⚠️ Verificar configuração SSL"
fi

# ========================================
# RELATÓRIO FINAL
# ========================================
clear
echo -e "${CYAN}"
echo "=========================================="
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo -e "${NC}"
echo ""
echo -e "${GREEN}🌐 ACESSO AO SISTEMA:${NC}"
echo "• URL: https://$DOMAIN"
echo "• Diretório: $APP_DIR"
echo ""
echo -e "${GREEN}👤 CREDENCIAIS DE ADMINISTRADOR:${NC}"
echo "• Email: $ADMIN_EMAIL"
echo "• Senha: $ADMIN_PASS"
echo ""
echo -e "${GREEN}🗄️ BANCO DE DADOS:${NC}"
echo "• Host: localhost"
echo "• Banco: $DB_NAME"
echo "• Usuário: $DB_USER"
echo "• Senha: $DB_PASS"
echo ""
echo -e "${GREEN}📁 DIRETÓRIOS IMPORTANTES:${NC}"
echo "• Aplicação: $APP_DIR"
echo "• Logs: /var/log/gestao-alimentar/"
echo "• Backup: /backup/gestao-alimentar/"
echo ""
echo -e "${GREEN}🔧 COMANDOS ÚTEIS:${NC}"
echo "• Ver logs: tail -f /var/log/gestao-alimentar/monitor.log"
echo "• Backup manual: /usr/local/bin/backup-gestao.sh"
echo "• Limpar cache: cd $APP_DIR && php artisan cache:clear"
echo ""
echo -e "${GREEN}🔒 SEGURANÇA:${NC}"
echo "• SSL: ✅ Configurado"
echo "• Firewall: ✅ Ativo"
echo "• Fail2Ban: ✅ Ativo"
echo "• Backup: ✅ Automático (diário)"
echo "• Monitoramento: ✅ Ativo (5min)"
echo ""
echo -e "${YELLOW}⚠️ PRÓXIMOS PASSOS:${NC}"
echo "1. Acesse https://$DOMAIN"
echo "2. Faça login com as credenciais acima"
echo "3. Configure o sistema conforme necessário"
echo "4. Teste todas as funcionalidades"
echo ""
echo -e "${BLUE}📞 SUPORTE:${NC}"
echo "• Logs de erro: tail -f $APP_DIR/storage/logs/laravel.log"
echo "• Status dos serviços: systemctl status nginx php8.2-fpm mysql"
echo "• Verificar SSL: certbot certificates"
echo ""
echo "=========================================="
success "🚀 Sistema pronto para uso!"
echo "=========================================="
