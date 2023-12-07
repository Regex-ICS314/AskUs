import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';

/** A component that displays a variable size loading bar based on input.
 * @param {number} now - A number between 0 and 1 that displays the current progress of loading bar.
 * @param {number} size - A parameter to pass the desired size to this component.
 * @returns Container - Container that says "Loading..." and a variable size progress bar. */
const LoadingBar = (props) => {
  const { now, size } = props;

  return (
    <Container className="pt-4 pb-5">
      <Row className="justify-content-md-center">
        Loading...
      </Row>
      <Row className="justify-content-md-center pt-2">
        <Col xs={size}>
          <ProgressBar now={now} label={`${now}%`} animated striped />
        </Col>
      </Row>
    </Container>
  );
};

LoadingBar.propTypes = {
  now: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

export default LoadingBar;
