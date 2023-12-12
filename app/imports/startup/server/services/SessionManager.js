import { Random } from 'meteor/random';
import { UserSessions } from '../../../api/session/UserSessions';

// This session manager is for a new chatbot context session for each user and if user is not logged in there are different sessions to ensure not logged in users have the same chatbot context session
// As this comment is written there is no new chatbot context session for every thread/chat session
const createNewSession = (userId = null) => {
  // Generate a temporary user ID if none is provided
  let tempUserId = userId || Random.id();

  if (tempUserId === 'notLoggedIn') {
    tempUserId = Random.id();
  }

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
