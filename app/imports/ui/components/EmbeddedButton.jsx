import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

const EmbeddingButton = ({ onsend }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateEmbeddings = () => {
    setLoading(true);

    Meteor.call('generateAndStoreEmbeddings', (err) => {
      if (err) {
        swal('Error', `${err.reason}`, 'error');
      } else {
        swal('Success', 'Embeddings generated and stored successfully', 'success');
      }
      setLoading(false);
    });

    onsend();
  };

  return (
    <Button variant="secondary" onClick={handleGenerateEmbeddings} disabled={loading} style={{ textDecoration: 'none' }}>
      {loading ? 'Generating Embeddings...' : 'Generate Embeddings'}
    </Button>
  );
};

EmbeddingButton.propTypes = {
  onsend: PropTypes.func.isRequired,
};

export default EmbeddingButton;
