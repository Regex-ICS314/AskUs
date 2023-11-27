import React, { Component } from 'react';
import { MyFiles } from '../../api/fileupload/FilesCollection';
import FileItem from './FileItem'; // Assuming FileItem is in the same directory

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
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

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <ul>{this.renderUploadedFiles()}</ul>
      </div>
    );
  }
}

export default FileUploadComponent;
