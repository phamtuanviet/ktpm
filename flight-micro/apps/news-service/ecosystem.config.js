module.exports = {
  apps: [
    {
      name: 'news-service',
      script: 'dist/main.js',
      instances: 3,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
      },
    },
  ],
};
