#!/bin/bash

# ========================================
# INSTALAÇÃO COMPLETA - VPS UBUNTU 24.04
# Sistema de Gestão Alimentar
# ========================================

echo "🚀 INSTALAÇÃO DO SISTEMA DE GESTÃO ALIMENTAR"
echo "📋 VPS Ubuntu 24.04 - Configuração Completa"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
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

log "🔄 Atualizando sistema Ubuntu 24.04..."
apt update && apt upgrade -y

log "📦 Instalando dependências básicas..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    nano \
    vim

# ========================================
# INSTALAÇÃO DO NGINX
# ========================================
log "🌐 Instalando Nginx..."
apt install -y nginx

# Configurar Nginx
systemctl start nginx
systemctl enable nginx

# ========================================
# INSTALAÇÃO DO PHP 8.2
# ========================================
log "🐘 Instalando PHP 8.2 e extensões..."

# Adicionar repositório PHP
add-apt-repository ppa:ondrej/php -y
apt update

# Instalar PHP e extensões necessárias
apt install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-cli \
    php8.2-common \
    php8.2-mysql \
    php8.2-zip \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-curl \
    php8.2-xml \
    php8.2-bcmath \
    php8.2-json \
    php8.2-tokenizer \
    php8.2-intl \
    php8.2-soap \
    php8.2-redis \
    php8.2-imagick

# Configurar PHP-FPM
systemctl start php8.2-fpm
systemctl enable php8.2-fpm

# ========================================
# INSTALAÇÃO DO MYSQL 8.0
# ========================================
log "🗄️ Instalando MySQL 8.0..."
apt install -y mysql-server

# Configurar MySQL
systemctl start mysql
systemctl enable mysql

# Configuração segura do MySQL
mysql_secure_installation

# ========================================
# INSTALAÇÃO DO COMPOSER
# ========================================
log "🎼 Instalando Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# Verificar instalação
composer --version

# ========================================
# INSTALAÇÃO DO NODE.JS E NPM
# ========================================
log "📦 Instalando Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar instalação
node --version
npm --version

# ========================================
# CONFIGURAÇÃO DO FIREWALL
# ========================================
log "🔒 Configurando Firewall (UFW)..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 80
ufw allow 443

# ========================================
# CONFIGURAÇÃO DO FAIL2BAN
# ========================================
log "🛡️ Configurando Fail2Ban..."
systemctl start fail2ban
systemctl enable fail2ban

# ========================================
# CRIAÇÃO DO USUÁRIO PARA APLICAÇÃO
# ========================================
log "👤 Criando usuário para aplicação..."
adduser --disabled-password --gecos "" gestao
usermod -aG www-data gestao

# ========================================
# CONFIGURAÇÃO DE DIRETÓRIOS
# ========================================
log "📁 Configurando diretórios..."
mkdir -p /var/www/gestao-alimentar
chown -R gestao:www-data /var/www/gestao-alimentar
chmod -R 755 /var/www/gestao-alimentar

# ========================================
# CONFIGURAÇÃO DO NGINX PARA LARAVEL
# ========================================
log "⚙️ Configurando Nginx para Laravel..."

cat > /etc/nginx/sites-available/gestao-alimentar << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/gestao-alimentar/public;
    index index.php index.html index.htm;

    # Logs
    access_log /var/log/nginx/gestao-alimentar.access.log;
    error_log /var/log/nginx/gestao-alimentar.error.log;

    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;

    # Configuração para Laravel
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Processar arquivos PHP
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Negar acesso a arquivos sensíveis
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache para arquivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configurações de upload
    client_max_body_size 100M;
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/gestao-alimentar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# ========================================
# CONFIGURAÇÃO DO PHP
# ========================================
log "🔧 Otimizando configuração do PHP..."

# Backup da configuração original
cp /etc/php/8.2/fpm/php.ini /etc/php/8.2/fpm/php.ini.backup

# Configurações otimizadas para o sistema
cat >> /etc/php/8.2/fpm/php.ini << 'EOF'

; Configurações otimizadas para Sistema de Gestão Alimentar
memory_limit = 512M
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
max_input_time = 300
max_input_vars = 3000
date.timezone = America/Sao_Paulo

; Configurações de sessão
session.gc_maxlifetime = 7200
session.cookie_lifetime = 7200

; Configurações de cache
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
opcache.save_comments = 1
EOF

# ========================================
# CONFIGURAÇÃO DO MYSQL
# ========================================
log "🗄️ Configurando MySQL..."

# Criar banco de dados e usuário
mysql -e "CREATE DATABASE gestao_alimentar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER 'gestao_user'@'localhost' IDENTIFIED BY 'senha_super_segura_123!';"
mysql -e "GRANT ALL PRIVILEGES ON gestao_alimentar.* TO 'gestao_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# ========================================
# CONFIGURAÇÃO DE LOGS
# ========================================
log "📝 Configurando logs..."
mkdir -p /var/log/gestao-alimentar
chown -R gestao:www-data /var/log/gestao-alimentar
chmod -R 755 /var/log/gestao-alimentar

# ========================================
# CONFIGURAÇÃO DE BACKUP AUTOMÁTICO
# ========================================
log "💾 Configurando backup automático..."

mkdir -p /backup/gestao-alimentar
chown -R gestao:gestao /backup/gestao-alimentar

# Script de backup
cat > /usr/local/bin/backup-gestao.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/gestao-alimentar"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do banco
mysqldump -u gestao_user -psenha_super_segura_123! gestao_alimentar > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/gestao-alimentar

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-gestao.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-gestao.sh") | crontab -

# ========================================
# REINICIAR SERVIÇOS
# ========================================
log "🔄 Reiniciando serviços..."
systemctl restart nginx
systemctl restart php8.2-fpm
systemctl restart mysql

# ========================================
# VERIFICAÇÕES FINAIS
# ========================================
log "✅ Verificando instalação..."

echo ""
echo "=========================================="
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo ""
echo "📋 INFORMAÇÕES DO SISTEMA:"
echo "• PHP: $(php --version | head -n1)"
echo "• Composer: $(composer --version)"
echo "• Node.js: $(node --version)"
echo "• NPM: $(npm --version)"
echo "• Nginx: $(nginx -v 2>&1)"
echo "• MySQL: $(mysql --version)"
echo ""
echo "🗄️ BANCO DE DADOS:"
echo "• Nome: gestao_alimentar"
echo "• Usuário: gestao_user"
echo "• Senha: senha_super_segura_123!"
echo ""
echo "📁 DIRETÓRIOS:"
echo "• Aplicação: /var/www/gestao-alimentar"
echo "• Logs: /var/log/gestao-alimentar"
echo "• Backup: /backup/gestao-alimentar"
echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "1. Fazer upload do código Laravel para /var/www/gestao-alimentar"
echo "2. Configurar arquivo .env"
echo "3. Executar: composer install"
echo "4. Executar: php artisan migrate --seed"
echo "5. Configurar SSL (Let's Encrypt)"
echo ""
echo "🌐 ACESSO:"
echo "• HTTP: http://SEU_IP_VPS"
echo "• SSH: ssh root@SEU_IP_VPS"
echo ""
echo "=========================================="

log "✅ Script de instalação finalizado!"
