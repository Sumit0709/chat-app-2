module.exports = {
    apps: [
      {
        name: 'chat-app-0',
        script: 'app.js',
        env: {
          PORT: 8080,
          NODE_ENV: 'production',
        },
      },
      {
        name: 'chat-app-1',
        script: 'app.js',
        env: {
          PORT: 8081,
          NODE_ENV: 'production',
        },
      },
      {
        name: 'chat-app-2',
        script: 'app.js',
        env: {
          PORT: 8082,
          NODE_ENV: 'production',
        },
      },
      {
        name: 'chat-app-3',
        script: 'app.js',
        env: {
          PORT: 8083,
          NODE_ENV: 'production',
        },
      },
    ],
  };
  