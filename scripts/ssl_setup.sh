#!/bin/bash

# ========================================
# CONFIGURAÇÃO SSL COM LET'S ENCRYPT
# Para Sistema de Gestão Alimentar
# ========================================

echo "🔒 CONFIGURAÇÃO SSL - LET'S ENCRYPT"
echo "=================================="

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   echo "Este script deve ser executado como root (sudo)"
   exit 1
fi

# Instalar Certbot
echo "📦 Instalando Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Solicitar domínio
read -p "Digite seu domínio (ex: gestao.seudominio.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domínio é obrigatório!"
    exit 1
fi

# Solicitar email
read -p "Digite seu email para notificações: " EMAIL

if [ -z "$EMAIL" ]; then
    echo "❌ Email é obrigatório!"
    exit 1
fi

# Configurar SSL
echo "🔒 Configurando SSL para $DOMAIN..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL

# Atualizar configuração do Laravel
APP_DIR="/var/www/gestao-alimentar"
if [ -f "$APP_DIR/.env" ]; then
    echo "⚙️ Atualizando configuração do Laravel..."
    sed -i "s|APP_URL=http://.*|APP_URL=https://$DOMAIN|g" $APP_DIR/.env
    cd $APP_DIR
    sudo -u gestao php artisan config:cache
fi

# Configurar renovação automática
echo "⏰ Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ SSL configurado com sucesso!"
echo "🌐 Acesse: https://$DOMAIN"
