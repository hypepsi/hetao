module.exports = {
  apps: [
    {
      name: 'hetalog',
      script: 'npm',
      args: 'start',
      cwd: '/root/hetalog',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}






