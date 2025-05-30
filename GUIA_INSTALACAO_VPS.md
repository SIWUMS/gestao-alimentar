# 🚀 Guia Completo - Instalação em VPS Ubuntu 24.04

## 📋 Especificações Recomendadas

### ✅ **Suas Especificações (EXCELENTES!):**
- **CPU:** 6 núcleos vCPU ⭐⭐⭐⭐⭐
- **RAM:** 12 GB ⭐⭐⭐⭐⭐
- **Storage:** 100GB NVMe / 200GB SSD ⭐⭐⭐⭐⭐
- **OS:** Ubuntu 24.04 LTS ⭐⭐⭐⭐⭐

### 💡 **Comparação com Requisitos Mínimos:**
| Componente | Mínimo | Recomendado | Suas Specs | Status |
|------------|--------|-------------|------------|--------|
| CPU | 1 core | 2 cores | **6 cores** | 🚀 Excelente |
| RAM | 512MB | 2GB | **12GB** | 🚀 Excelente |
| Storage | 5GB | 20GB | **100-200GB** | 🚀 Excelente |
| PHP | 8.1+ | 8.2+ | 8.2 | ✅ Perfeito |

---

## 🛠️ Instalação Automática (Recomendado)

### **1. Conectar ao VPS:**
\`\`\`bash
ssh root@SEU_IP_VPS
\`\`\`

### **2. Baixar e executar script de instalação:**
\`\`\`bash
wget https://raw.githubusercontent.com/SEU_REPO/scripts/install_vps_ubuntu.sh
chmod +x install_vps_ubuntu.sh
./install_vps_ubuntu.sh
\`\`\`

### **3. Deploy do sistema:**
\`\`\`bash
wget https://raw.githubusercontent.com/SEU_REPO/scripts/deploy_sistema.sh
chmod +x deploy_sistema.sh
./deploy_sistema.sh
\`\`\`

---

## 🔧 Instalação Manual (Passo a Passo)

### **Passo 1: Atualizar Sistema**
\`\`\`bash
apt update && apt upgrade -y
\`\`\`

### **Passo 2: Instalar Nginx**
\`\`\`bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
\`\`\`

### **Passo 3: Instalar PHP 8.2**
\`\`\`bash
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath
\`\`\`

### **Passo 4: Instalar MySQL**
\`\`\`bash
apt install -y mysql-server
mysql_secure_installation
\`\`\`

### **Passo 5: Instalar Composer**
\`\`\`bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
\`\`\`

### **Passo 6: Configurar Nginx**
\`\`\`bash
nano /etc/nginx/sites-available/gestao-alimentar
\`\`\`

### **Passo 7: Deploy da Aplicação**
\`\`\`bash
cd /var/www
git clone SEU_REPOSITORIO gestao-alimentar
cd gestao-alimentar
composer install --optimize-autoloader --no-dev
\`\`\`

---

## 🔒 Configuração SSL (Let's Encrypt)

### **Instalação Automática:**
\`\`\`bash
wget https://raw.githubusercontent.com/SEU_REPO/scripts/ssl_setup.sh
chmod +x ssl_setup.sh
./ssl_setup.sh
\`\`\`

### **Instalação Manual:**
\`\`\`bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seudominio.com
\`\`\`

---

## 🚀 Performance e Otimizações

### **Com suas especificações, você pode:**

#### **1. Configurar Cache Redis:**
\`\`\`bash
apt install -y redis-server
# Configurar no .env: CACHE_DRIVER=redis
\`\`\`

#### **2. Configurar Queue Workers:**
\`\`\`bash
# Processar jobs em background
php artisan queue:work --daemon
\`\`\`

#### **3. Configurar Load Balancer (se necessário):**
\`\`\`bash
# Nginx pode servir múltiplas instâncias
upstream backend {
    server 127.0.0.1:9000;
    server 127.0.0.1:9001;
}
\`\`\`

#### **4. Monitoramento Avançado:**
\`\`\`bash
apt install -y htop iotop nethogs
# Instalar New Relic ou Datadog para monitoramento
\`\`\`

---

## 📊 Estimativas de Capacidade

### **Com suas especificações:**
- **Usuários simultâneos:** 500-1000+ 🚀
- **Requisições/segundo:** 100-200+ 🚀
- **Armazenamento de dados:** 50GB+ de dados 🚀
- **Backup completo:** Múltiplas versões 🚀
- **Crescimento:** Suporta 5+ anos de uso 🚀

---

## 🔧 Comandos de Manutenção

### **Monitoramento:**
\`\`\`bash
# CPU e RAM
htop

# Espaço em disco
df -h

# Logs do sistema
tail -f /var/log/gestao-alimentar/laravel.log

# Status dos serviços
systemctl status nginx php8.2-fpm mysql
\`\`\`

### **Backup:**
\`\`\`bash
# Backup automático já configurado
/usr/local/bin/backup-gestao.sh

# Backup manual
mysqldump gestao_alimentar > backup.sql
tar -czf backup.tar.gz /var/www/gestao-alimentar
\`\`\`

### **Atualizações:**
\`\`\`bash
# Atualizar sistema
apt update && apt upgrade -y

# Atualizar aplicação
cd /var/www/gestao-alimentar
git pull
composer install --optimize-autoloader --no-dev
php artisan migrate
php artisan config:cache
\`\`\`

---

## 🆘 Troubleshooting

### **Problemas Comuns:**

#### **1. Erro 500:**
\`\`\`bash
# Verificar logs
tail -f /var/log/nginx/error.log
tail -f /var/www/gestao-alimentar/storage/logs/laravel.log

# Verificar permissões
chown -R www-data:www-data /var/www/gestao-alimentar/storage
chmod -R 775 /var/www/gestao-alimentar/storage
\`\`\`

#### **2. Erro de Banco:**
\`\`\`bash
# Testar conexão
mysql -u gestao_user -p gestao_alimentar

# Verificar configuração
cat /var/www/gestao-alimentar/.env | grep DB_
\`\`\`

#### **3. Performance Lenta:**
\`\`\`bash
# Limpar cache
cd /var/www/gestao-alimentar
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
\`\`\`

---

## 🎯 Próximos Passos

### **Após Instalação:**
1. ✅ **Acessar sistema:** `https://seudominio.com`
2. ✅ **Login admin:** `admin@gestaoalimentar.com` / `Admin123!@#`
3. ✅ **Configurar email** (SMTP)
4. ✅ **Importar dados** iniciais
5. ✅ **Treinar usuários**
6. ✅ **Configurar backup** em nuvem
7. ✅ **Monitoramento** 24/7

### **Melhorias Futuras:**
- 🔄 **CI/CD** com GitHub Actions
- 📊 **Monitoramento** com Grafana
- 🔒 **WAF** (Web Application Firewall)
- 🌐 **CDN** para assets estáticos
- 📱 **App mobile** (PWA)

---

## 💰 Estimativa de Custos

### **VPS Mensal:**
- **Básico (suas specs):** $20-50/mês
- **Domínio:** $10-15/ano
- **SSL:** Gratuito (Let's Encrypt)
- **Backup em nuvem:** $5-10/mês

### **Total estimado:** $25-60/mês

---

## 📞 Suporte

### **Em caso de problemas:**
1. 📋 **Verificar logs** primeiro
2. 🔍 **Consultar documentação**
3. 💬 **Abrir issue** no GitHub
4. 📧 **Contato direto** para suporte

---

**🎉 Suas especificações são EXCELENTES para o sistema!**
**O VPS vai rodar perfeitamente com muito espaço para crescimento!**
