import React, { Component } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';
import ConfirmModal from './ConfirmModal';

class FileItem extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  handleDelete = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleConfirmDelete = () => {
    const { file, onRemove } = this.props;
    Meteor.call('files.remove', file._id, (error) => {
      if (error) {
        console.error(`Error removing file: ${error.reason}`);
      } else {
        onRemove(file._id);
      }
    });
    this.setState({ showModal: false });
  };

  render() {
    const { file } = this.props;
    const { showModal } = this.state;

    return (
      <li>
        {file.name}
        <Button onClick={this.handleDelete}>Delete</Button>

        <ConfirmModal
          show={showModal}
          handleClose={this.handleCloseModal}
          handleConfirm={this.handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete ${file.name}?`}
        />
      </li>
    );
  }
}

// Define PropTypes
FileItem.propTypes = {
  file: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FileItem;
