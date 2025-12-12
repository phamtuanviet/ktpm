module.exports = {
  apps: [
    {
      name: 'booking-service',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5006,
      },
    },
  ],
};
