import { Meteor } from 'meteor/meteor';
import { v4 as uuidv4 } from 'uuid';
import { ChatSessions } from '../../api/session/ChatSessions';

const SetNewChatSessionForUser = (message) => {
  const sentAt = new Date();
  let sessionId = sessionStorage.getItem('chatbotSessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('chatbotSessionId', sessionId);
    ChatSessions.collection.insert(
      {
        latestQuery: message,
        sentAt: sentAt,
        userId: Meteor.userId(),
        _id: sessionId,
      },
      (error, result) => {
        if (error) {
          console.log('Insert Error:', error);
        } else {
          console.log('Insert Result:', result);
        }
      },
    );
  }
  console.log(`Session ID: ${sessionId}`);
  console.log(`User ID: ${Meteor.user() ? Meteor.user().username : 'notLoggedIn'}`);
  // alert(question);
  // console.log(question);
};

export { SetNewChatSessionForUser };
