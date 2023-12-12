import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Accordion, Table } from 'react-bootstrap';
// import PropTypes from 'prop-types';
import { ChatSessions } from '../../api/session/ChatSessions';
import ChatHistory from './ChatHistory';
import LoadingBar from './LoadingBar';

// eslint-disable-next-line react/prop-types
const UserSessionsAccordion = ({ user, eventKey }) => {

  // eslint-disable-next-line no-console
  console.log(user);
  // eslint-disable-next-line no-unused-vars
  const { ready, sessions } = useTracker(() => {
    const subscription = Meteor.subscribe(ChatSessions.userPublicationName);
    const rdy = subscription.ready();
    // eslint-disable-next-line react/prop-types
    const sessionItems = ChatSessions.collection.find({ userId: user }).fetch();
    sessionItems.sort((a, b) => a.date - b.date);
    return {
      sessions: sessionItems,
      ready: rdy,
    };
  }, []);

  const deleteSession = (sessionID) => {
    console.log(`Session ${sessionID} deleted`);
    ChatSessions.collection.remove(sessionID);
  };
  /*
  console.log(`User passed in UserSessionsAccordion ${user}`);
  console.log(Meteor.users.findOne({ _id: user }));
  console.log(Meteor.users.findOne({ username: 'john@foo.com' }));
  */

  console.log(`User passed in UserSessionsAccordion ${user}`);
  console.log(Meteor.users.findOne({ id: user }));
  console.log(Meteor.users.find({}).fetch());
  if (Meteor.isClient) {
    Meteor.subscribe('users');
    // eslint-disable-next-line no-shadow,react/prop-types
    const userIds = Meteor.users.find({}, { fields: { _id: 1 } }).fetch().map(user => user._id);
    console.log('User IDs', userIds);
  }

  const username = Meteor.users.findOne({ _id: user }) ? Meteor.users.findOne({ _id: user }).username : 'not logged in';
  return (
    <Accordion.Item eventKey={eventKey}>

      <Accordion.Header>{username}</Accordion.Header>
      <Accordion.Body>
        {ready ? (
          <Table striped bordered hover>
            <tbody>
              {sessions.slice().reverse().map((session) => (
                <ChatHistory key={session._id} session={session} collection={ChatSessions.collection} deleteSession={deleteSession} user={user} adminMode />
              ))}
            </tbody>
          </Table>
        ) : <LoadingBar now={100 * (sessions.length / 100)} size={7} />}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default UserSessionsAccordion;
