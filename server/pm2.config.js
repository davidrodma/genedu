module.exports = {
  apps: [
    {
      name: 'Nest-Server',
      script: './dist/src/main.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001, // Porta em que sua aplicação Nest.js estará rodando
      },
    },
  ],
}
