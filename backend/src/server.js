const app = require('./app');
const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./database/mongoClient');

async function start() {
  await connectDatabase();
  const server = app.listen(env.port, () => console.log(`API listening on port ${env.port}`));

  const shutdown = async (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('Unable to start API', error);
  process.exit(1);
});
