import { Random } from 'meteor/random';
import { UserSessions } from '../../../api/session/UserSessions';

const createNewSession = (userId = null) => {
  // Generate a temporary user ID if none is provided
  const tempUserId = userId || Random.id();

  const newSession = {
    userId: tempUserId,
    messages: [],
    currentTopicEmbedding: null,
    currentArticles: null,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    isTemporaryId: !userId, // Flag to indicate if this is a temporary session
  };
  UserSessions.collection.insert(newSession);
  return newSession;
};

const getSession = (userId) => UserSessions.collection.findOne({ userId }) || createNewSession(userId);

const updateSession = (userId, updates) => {
  UserSessions.collection.update({ userId }, { $set: { ...updates, lastUpdatedAt: new Date() } });
};

const deleteSession = (userId) => {
  UserSessions.collection.remove({ userId });
};

// Function to handle temporary sessions
const handleTemporarySession = (userId) => {
  const session = getSession(userId);
  if (session.isTemporary) {
    deleteSession(userId);
  }
};

export { getSession, updateSession, deleteSession, handleTemporarySession };
