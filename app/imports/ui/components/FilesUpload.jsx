import React, { Component } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Using Bootstrap icons
import { MyFiles } from '../../api/fileupload/FilesCollection';
import FileItem from './FileItem'; // Assuming FileItem is in the same directory

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      showModal: false,
      fileToDelete: null,
    };
  }

  handleFileUpload = (event) => {
    event.preventDefault();
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];

      const uploadInstance = MyFiles.insert({
        file: file,
        chunkSize: 'dynamic',
      }, false);

      uploadInstance.on('start', () => {
        console.log('Upload started');
      });

      uploadInstance.on('end', (error, fileObj) => {
        if (error) {
          console.error('Error during upload:', error);
        } else {
          console.log('File Uploaded:', fileObj);
          this.setState(prevState => ({
            uploadedFiles: [...prevState.uploadedFiles, fileObj],
          }));
        }
      });

      uploadInstance.start(); // Start the upload
    }
  };

  handleFileRemove = (fileId) => {
    this.setState(prevState => ({
      uploadedFiles: prevState.uploadedFiles.filter(file => file._id !== fileId),
    }));
  };

  renderUploadedFiles() {
    const { uploadedFiles } = this.state;
    return uploadedFiles.map(file => (
      <FileItem key={file._id} file={file} onRemove={this.handleFileRemove} />
    ));
  }

  showDeleteModal = (file) => {
    this.setState({ showModal: true, fileToDelete: file });
  };

  confirmDelete = () => {
    const { fileToDelete } = this.state;
    if (fileToDelete) {
      // Call delete method or perform deletion
      console.log('Deleting:', fileToDelete._id);
      this.handleFileRemove(fileToDelete._id);
    }
    this.setState({ showModal: false, fileToDelete: null });
  };

  renderTableBody() {
    const { uploadedFiles } = this.state;
    return uploadedFiles.map(file => (
      <tr key={file._id}>
        <td>{file.name}</td>
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
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
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

        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
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
      </div>
    );
  }
}

export default FileUploadComponent;
