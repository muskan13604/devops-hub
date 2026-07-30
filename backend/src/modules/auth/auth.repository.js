const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../database/mongoClient');

const users = () => getDatabase().collection('users');
const sessions = () => getDatabase().collection('refreshSessions');

const createUser = ({ email, passwordHash }) => users().insertOne({ email, passwordHash, createdAt: new Date(), updatedAt: new Date() });
const findUserByEmail = (email) => users().findOne({ email });
const findUserById = (id) => users().findOne({ _id: new ObjectId(id) });
const createSession = (session) => sessions().insertOne(session);
const consumeSession = (tokenId, userId) => sessions().findOneAndDelete({ tokenId, userId: new ObjectId(userId) });
const deleteSession = (tokenId, userId) => sessions().deleteOne({ tokenId, userId: new ObjectId(userId) });

module.exports = { createUser, findUserByEmail, findUserById, createSession, consumeSession, deleteSession };
