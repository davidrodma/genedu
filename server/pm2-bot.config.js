module.exports = {
  apps: [
    {
      name: 'Bot-Server',
      script: './dist/src/bot.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002, // Porta em que sua aplicação Nest.js estará rodando
      },
    },
  ],
}
