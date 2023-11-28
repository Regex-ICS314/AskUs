import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { MyFiles } from '../../api/fileupload/FilesCollection';

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      showModal: false,
      fileToDelete: null,
      showRenameModal: false,
      fileToRename: null,
      newName: '',
    };
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('files.all');
      const files = MyFiles.find().fetch();
      this.setState({ files });
    });
  }

  componentWillUnmount() {
    this.tracker.stop();
  }

  // Show delete modal
  showDeleteModal = (file) => {
    this.setState({ showModal: true, fileToDelete: file });
  };

  confirmDelete = () => {
    const { fileToDelete } = this.state; // Destructuring state
    if (fileToDelete) {
      Meteor.call('files.remove', fileToDelete._id, (error) => {
        if (error) {
          console.error('Error deleting file:', error);
        } else {
          this.setState(prevState => ({
            files: prevState.files.filter(file => file._id !== fileToDelete._id),
            showModal: false,
            fileToDelete: null,
          }));
        }
      });
    } else {
      this.setState({ showModal: false });
    }
  };

  // Show rename modal
  showRenameModal = (file) => {
    this.setState({ showRenameModal: true, fileToRename: file, newName: file.name });
  };

  // Confirm file rename
  confirmRename = () => {
    const { fileToRename, newName } = this.state;
    if (fileToRename && newName !== '') {
      Meteor.call('files.rename', fileToRename._id, newName, (error) => {
        if (error) {
          console.error('Error renaming file:', error);
        } else {
          this.setState(prevState => ({
            files: prevState.files.map(file => (file._id === fileToRename._id ? { ...file, name: newName } : file)),
            showRenameModal: false,
            fileToRename: null,
            newName: '',
          }));
        }
      });
    }
  };

  handleNewNameChange = (event) => {
    this.setState({ newName: event.target.value });
  };

  renderTableBody() {
    const { files } = this.state;
    return files.map(file => (
      <tr key={file._id}>
        <td>
          <Button type="button" className="btn btn-light" role="button" tabIndex={0} onClick={() => this.showRenameModal(file)}>
            {file.name}
          </Button>
        </td>
        <td>{(file.size / 1024).toFixed(2)} KB</td>
        <td>Status Placeholder</td>
        <td>
          <Button variant="danger" onClick={() => this.showDeleteModal(file)}>
            <Trash />
          </Button>
        </td>
      </tr>
    ));
  }

  render() {
    const { showModal, showRenameModal, newName } = this.state;

    return (
      <Container className="shadow-lg p-3 mb-5 bg-body rounded">
        <h2>File Manager</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableBody()}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Rename Modal */}
        <Modal show={showRenameModal} onHide={() => this.setState({ showRenameModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Rename File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="fileNewName">
                <Form.Label>New Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newName}
                  onChange={this.handleNewNameChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showRenameModal: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.confirmRename}>
              Rename
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default FileManager;
