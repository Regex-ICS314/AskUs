import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../components/LoadingBar';
import { Messages } from '../../api/message/Messages';
import ChatHistoryTable from '../components/ChatHistoryTable';

// eslint-disable-next-line react/prop-types
const UserMessagesHistoryPage = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('userForViewingHistory');
  console.log(localStorage.getItem('sessionForViewingHistory'));
  const { ready, messages } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Messages.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Message documents
    const messageItems = Messages.collection.find({ sessionId: localStorage.getItem('sessionForViewingHistory') }).fetch();
    return {
      messages: messageItems,
      ready: rdy,
    };
  }, []);

  return (
    <Container>
      <Button variant="secondary" onClick={() => { navigate('/admin'); }}> Go Back </Button>
      <h1>{`${user}'s Messages`}</h1>
      <h5>{`Chat Session: ${localStorage.getItem('sessionForViewingHistory')}`}</h5>
      <Col lg={12}>
        {ready ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Stars</th>
                <th>Feedback</th>
                <th>SentAt</th>
              </tr>
            </thead>
            <tbody>
              {console.log(localStorage.getItem('sessionForViewingHistory'))}
              {messages.map((message) => <ChatHistoryTable key={message._id} message={message} />)}
            </tbody>
          </Table>
        ) : <LoadingBar now={100 * (messages.length / 100)} size={7} />}

      </Col>
    </Container>
  );
};

export default UserMessagesHistoryPage;
