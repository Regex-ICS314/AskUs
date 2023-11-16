import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { MicFill, MicMuteFill } from 'react-bootstrap-icons';

const ChatInput = ({ userInput, setUserInput, handleSend, handleAudioStart, handleAudioStop, loading }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      handleAudioStop().then(audioBlob => {
        // Handle the audio blob here, e.g., by sending it to the server
        handleSend(null, true, audioBlob); // Modified handleSend to accept audioBlob
      });
    } else {
      handleAudioStart();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRecording) {
      handleSend(e, false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <div className="d-flex">
        <InputGroup className="siteSearch">
          <Form.Control
            aria-describedby="basic-addon2"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
            aria-label="User input"
            className="search-boarder"
          />
        </InputGroup>
        <Button onClick={toggleRecording}>
          {isRecording ? <MicMuteFill /> : <MicFill />}
        </Button>
        <Button type="submit" className="ms-2" style={{ backgroundColor: '#907139' }} disabled={loading}>Send</Button>
      </div>
    </Form>
  );
};

ChatInput.propTypes = {
  userInput: PropTypes.string.isRequired,
  setUserInput: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  handleAudioStart: PropTypes.func.isRequired,
  handleAudioStop: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ChatInput;
