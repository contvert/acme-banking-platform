module.exports = {
  apps: [
    {
      name: 'mercury-banking',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3210',
      cwd: '/www/wwwroot/mercuiry.com',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3210,
        // Les secrets sont chargés depuis .env.local sur le serveur
        PROVISIONING_DELAY_HOURS: '3',
        PROVISIONING_LOGIN_URL: 'https://client.gemetseldevengativoverlangtekrolewskieoum.org/login',
        PROVISIONING_EMAIL_REPLY_TO: 'support@wee-boot.com',
      },
    },
  ],
};
