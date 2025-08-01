module.exports = {
  apps: [
    {
      name: 'my-app', 
      script: 'server.ts', 
      interpreter: './node_modules/.bin/ts-node.cmd', 
      watch: false,
      autorestart: true,
      restart_delay: 5000,
    }
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
