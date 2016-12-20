ssh -i deploy_rsa deploy@impressiv \
  'cd /var/www/messenger-bot-boilerplate;' \
  'git pull origin master;' \
  'npm install;' \
  'pm2 restart bot-bp;' \ 
