import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

const UpdateDatabaseButton = ({ onsend }) => {
  const handleUpdateClick = async () => {
    try {
      // Fetch JSON data using a Meteor method
      Meteor.call('getJsonData', (error, result) => {
        if (error) {
          swal('Error fetching JSON data', `${error}`, 'error');
        } else {
          const jsonData = result;
          // Now call the updateDatabase method with the fetched JSON data
          Meteor.call('askus.updateDatabase', jsonData, (updateError) => {
            if (updateError) {
              swal('Error updating database', `${updateError}`, 'error');
            } else {
              swal('Success', 'Database successfully updated', 'success');
            }
          });
        }
      });
    } catch (error) {
      swal('Error in handleUpdateClick', `${error}`, 'error');
    }

    onsend();
  };

  return (
    <Button variant="secondary" onClick={handleUpdateClick} style={{ textDecoration: 'none' }}>
      Update Database
    </Button>
  );
};

UpdateDatabaseButton.propTypes = {
  onsend: PropTypes.func.isRequired,
};

export default UpdateDatabaseButton;
