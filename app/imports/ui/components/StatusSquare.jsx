import React from 'react';
import PropTypes from 'prop-types';

/** A simple square element div to display current status of database.
 * @param {boolean} complete - Boolean of whether square displays complete or not.
 * @returns div with either green or red square. */
const StatusSquare = ({ complete }) => (
  complete ? <div className="square" style={{ backgroundColor: 'lightgreen' }}>&#x2713;</div> : <div className="square" style={{ backgroundColor: 'red' }}>X</div>
);

// Require a document to be passed to this component.
StatusSquare.propTypes = {
  complete: PropTypes.bool.isRequired,
};

export default StatusSquare;
