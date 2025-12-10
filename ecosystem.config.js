module.exports = {
  apps: [
    {
      name: 'hetalog',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/root/hetalog',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 10000,
      shutdown_with_message: true,
      merge_logs: true,
      error_file: '/root/.pm2/logs/hetalog-error.log',
      out_file: '/root/.pm2/logs/hetalog-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}






