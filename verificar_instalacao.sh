#!/bin/bash

# ========================================
# SCRIPT DE VERIFICAÇÃO DA INSTALAÇÃO
# Sistema de Gestão Alimentar
# ========================================

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="gestor.emmvmfc.com.br"
APP_DIR="/var/www/html/cardapio"

echo -e "${BLUE}=========================================="
echo "🔍 VERIFICAÇÃO DA INSTALAÇÃO"
echo "=========================================="
echo -e "${NC}"

# Função para verificar
check() {
    if $1 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Verificar serviços
echo -e "${YELLOW}📋 VERIFICANDO SERVIÇOS:${NC}"
check "systemctl is-active --quiet nginx" "Nginx está rodando"
check "systemctl is-active --quiet php8.2-fpm" "PHP-FPM está rodando"
check "systemctl is-active --quiet mysql" "MySQL está rodando"
check "systemctl is-active --quiet fail2ban" "Fail2Ban está rodando"

echo ""

# Verificar arquivos
echo -e "${YELLOW}📁 VERIFICANDO ARQUIVOS:${NC}"
check "test -d $APP_DIR" "Diretório da aplicação existe"
check "test -f $APP_DIR/.env" "Arquivo .env existe"
check "test -f $APP_DIR/artisan" "Laravel instalado"
check "test -d $APP_DIR/storage" "Diretório storage existe"

echo ""

# Verificar permissões
echo -e "${YELLOW}🔒 VERIFICANDO PERMISSÕES:${NC}"
check "test -w $APP_DIR/storage" "Storage é gravável"
check "test -w $APP_DIR/bootstrap/cache" "Cache é gravável"

echo ""

# Verificar rede
echo -e "${YELLOW}🌐 VERIFICANDO CONECTIVIDADE:${NC}"
check "curl -s -f http://localhost" "Nginx responde localmente"
check "curl -s -f https://$DOMAIN" "Site responde via HTTPS"

echo ""

# Verificar banco
echo -e "${YELLOW}🗄️ VERIFICANDO BANCO DE DADOS:${NC}"
cd $APP_DIR
check "php artisan migrate:status" "Conexão com banco OK"

echo ""

# Verificar SSL
echo -e "${YELLOW}🔒 VERIFICANDO SSL:${NC}"
check "certbot certificates | grep -q $DOMAIN" "Certificado SSL existe"

echo ""

# Informações do sistema
echo -e "${YELLOW}💻 INFORMAÇÕES DO SISTEMA:${NC}"
echo "• OS: $(lsb_release -d | cut -f2)"
echo "• PHP: $(php --version | head -n1)"
echo "• Nginx: $(nginx -v 2>&1)"
echo "• MySQL: $(mysql --version)"
echo "• Composer: $(composer --version | head -n1)"

echo ""

# Uso de recursos
echo -e "${YELLOW}📊 USO DE RECURSOS:${NC}"
echo "• CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% em uso"
echo "• RAM: $(free -h | awk 'NR==2{printf "%.1f/%.1fGB (%.0f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
echo "• Disco: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"

echo ""

# Logs recentes
echo -e "${YELLOW}📝 LOGS RECENTES:${NC}"
if [ -f "/var/log/gestao-alimentar/monitor.log" ]; then
    echo "• Monitor: $(tail -n1 /var/log/gestao-alimentar/monitor.log)"
fi

if [ -f "$APP_DIR/storage/logs/laravel.log" ]; then
    echo "• Laravel: $(tail -n1 $APP_DIR/storage/logs/laravel.log | cut -c1-80)..."
fi

echo ""
echo -e "${BLUE}=========================================="
echo "✅ VERIFICAÇÃO CONCLUÍDA"
echo "=========================================="
echo -e "${NC}"
