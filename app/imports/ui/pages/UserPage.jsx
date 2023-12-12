import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { v4 as uuidv4 } from 'uuid';
import { ChatSessions } from '../../api/session/ChatSessions';
import ChatHistory from '../components/ChatHistory';
import LoadingBar from '../components/LoadingBar';

const addSession = (sessionID) => {
  const sentAt = new Date();
  console.log(`New Session ${sessionID} added`);
  ChatSessions.collection.insert(
    {
      latestQuery: '',
      sentAt: sentAt,
      userId: Meteor.userId() ? Meteor.userId() : 'notLoggedIn',
      _id: sessionID,
    },
  );
  sessionStorage.setItem('chatbotSessionId', sessionID);
};

const deleteSession = (sessionID) => {
  console.log(`Session ${sessionID} deleted`);
  ChatSessions.collection.remove(sessionID);
};
const UserPage = () => {

  const { ready, sessions } = useTracker(() => {
    const subscription = Meteor.subscribe(ChatSessions.userPublicationName);
    const rdy = subscription.ready();
    const userToFind = Meteor.userId() ? Meteor.userId() : 'notLoggedIn';
    const sessionItems = ChatSessions.collection.find({ userId: userToFind }).fetch();
    sessionItems.sort((a, b) => a.date - b.date);
    return {
      sessions: sessionItems,
      ready: rdy,
    };
  }, []);

  console.log(sessions);
  return (
    <Container id="user-page">
      <h1> History </h1>
      <Col lg={6}>
        {ready ? (
          <Table striped bordered hover>
            <tbody>
              {sessions.slice().reverse().map((session) => (
                <ChatHistory key={session._id} session={session} collection={ChatSessions.collection} deleteSession={deleteSession} user="" adminMode={false} />
              ))}
            </tbody>
          </Table>
        ) : <LoadingBar now={100 * (sessions.length / 100)} size={7} />}
      </Col>
      <Button variant="success " onClick={() => addSession(uuidv4())}> New thread </Button>
    </Container>
  );
};

export default UserPage;
