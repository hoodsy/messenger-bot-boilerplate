ssh -i ~/.ssh/deploy_rsa deploy@impressiv << EOF
  cd /var/www/messenger-bot-boilerplate;
  git pull origin master;
  npm install;
  pm2 restart bot-bp;
  pm2 logs bot-bp
EOF
