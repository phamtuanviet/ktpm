module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'dist/main.js',
      instances: 5,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
