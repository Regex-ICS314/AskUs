import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

/** A simple static component to display when data is not ready yet.
 * @returns Container - Container with a spinner that says "Getting data...". */
const LoadingSpinner = () => (
  <Container>
    <Row className="d-flex align-items-center justify-content-md-center">
      <Spinner animation="border" className="mx-2" />
      Getting data...
    </Row>
  </Container>
);

export default LoadingSpinner;
