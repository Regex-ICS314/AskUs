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
  console.log(sessions);
  return (
    <Accordion.Item eventKey={eventKey}>
      {/* eslint-disable-next-line react/prop-types */}
      {console.log(user)}
      {/* eslint-disable-next-line react/prop-types */}
      <Accordion.Header>{user}</Accordion.Header>
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
