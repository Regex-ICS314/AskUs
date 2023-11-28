import { Accordion } from 'react-bootstrap';
import React from 'react';
import ChatHistory from './ChatHistory';
import { ChatSessions } from '../../api/session/ChatSessions';

/*
  const { ready, sessions } = useTracker(() => {
    const subscription = Meteor.subscribe(ChatSessions.userPublicationName);
    const rdy = subscription.ready();
    const userToFind = Meteor.user() ? Meteor.user().username : 'notLoggedIn';
    const sessionItems = ChatSessions.collection.find({ userId: userToFind }).fetch();
    sessionItems.sort((a, b) => a.date - b.date);
    return {
      sessions: sessionItems,
      ready: rdy,
    };
  }, []);
 */

 // get a subscription of all the sessions grouped by userID, each index is an array of all the userId's sessions

const AdminChatHistory = () => {
  return (
  // map the whole sessions grouped by ID into each accordion, which will each be a session, and when opening the session will open a table which will have the entire logs
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AdminChatHistory;