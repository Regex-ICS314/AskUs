import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, InputGroup, Modal, Form } from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';
import ReactStars from 'react-rating-stars-component';
import ChatLoading from './ChatLoading';
import { Messages } from '../../api/message/Messages';
import LoadingSpinner from './LoadingSpinner';

const transition = {
  type: 'spring',
  stiffness: 200,
  mass: 0.2,
  damping: 20,
};

const variants = {
  initial: {
    opacity: 0,
    y: 300,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition,
  },
};

const ChatWindow = React.forwardRef((props, ref) => {

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  // Modify the ratingChanged function
  const ratingChanged = (newRating) => {
    if (newRating <= 2) {
      setShowModal(true); // Show modal when rating is 2 or less
    }
  };
  // Function to close the modal
  const handleClose = () => {
    setShowModal(false);
  };
  const { ready, messages } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Messages.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Message documents
    const messageItems = Messages.collection.find({ sessionId: sessionStorage.getItem('chatbotSessionId') }).fetch();
    return {
      messages: messageItems,
      ready: rdy,
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { chatSender, formatChatbotResponse, loading } = props;

  return (ready ? (
    <div className="chat-window">
      <AnimatePresence>
        {messages.map((message) => (
          <React.Fragment key={message._id}>
            <motion.div
              className={`d-flex ${message.sender === 'bot' ? 'justify-content-start px-5' : 'justify-content-end px-5'}`}
              initial="initial"
              animate="enter"
              variants={variants}
            > {chatSender(message)}
            </motion.div>
            <div className={`d-flex ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}>
              <motion.div
                className={`${message.sender === 'bot' ? 'bubble left' : 'bubble right'} chat-message ${message.sender}`}
                style={{ width: 'fit-content' }}
                initial="initial"
                animate="enter"
                variants={variants}
              >
                {message.sender === 'bot' ? formatChatbotResponse(message.message) : message.message}
                {message.sender === 'bot' ? (
                  <InputGroup>
                    <ReactStars
                      count={5}
                      onChange={ratingChanged}
                      size={24}
                      activeColor="#ffffff"
                    />
                    {/* Modal Component */}
                    <Modal show={showModal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Feedback</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          {/* Your form fields go here */}
                          <Form.Group>
                            <Form.Label>What did you find unsatisfactory?</Form.Label>
                            <Form.Control as="textarea" placeholder="please type your feedback" />
                          </Form.Group>
                          {/* ... other form fields ... */}
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button className="landingSearchButton" onClick={handleClose}>
                          Submit Feedback
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Button className="ms-auto refresh"><ArrowClockwise /></Button>
                  </InputGroup>
                ) : ''}
              </motion.div>
            </div>
          </React.Fragment>
        ))}
      </AnimatePresence>
      {/* ChatLoading Circle is rendered here */}
      {loading && <ChatLoading />}
      <div ref={ref} />
    </div>
  ) : <LoadingSpinner />);
});

ChatWindow.propTypes = {
  chatSender: PropTypes.func.isRequired, // For chatSender function
  formatChatbotResponse: PropTypes.func.isRequired, // For formatChatbotResponse function
  loading: PropTypes.bool.isRequired, // For loading state
};

export default ChatWindow;
