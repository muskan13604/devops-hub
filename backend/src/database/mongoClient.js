const { MongoClient } = require('mongodb');
const env = require('../config/env');

let client;
let database;

async function connectDatabase() {
  if (database) return database;

  client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  database = client.db(env.mongoDbName);
  await database.command({ ping: 1 });
  console.log('MongoDB connected');
  return database;
}

function getDatabase() {
  if (!database) throw new Error('MongoDB has not been connected.');
  return database;
}

async function disconnectDatabase() {
  if (!client) return;
  await client.close();
  client = undefined;
  database = undefined;
}

module.exports = { connectDatabase, getDatabase, disconnectDatabase };
