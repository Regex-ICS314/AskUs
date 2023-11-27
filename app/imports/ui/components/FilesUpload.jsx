import React, { Component } from 'react';
import { MyFiles } from '../../api/fileupload/JsonFilesCollection';

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: [],
      progress: 0,
      inProgress: false,
      uploadedFiles: [],
    };
  }

  handleFileUpload(event) {
    event.preventDefault();
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];

      const uploadInstance = MyFiles.insert({
        file: file,
        chunkSize: 'dynamic',
      }, false);

      this.setState({
        uploading: uploadInstance, // track uploading progress
        inProgress: true,
      });

      uploadInstance.on('start', () => this.setState({ progress: 0 }));

      uploadInstance.on('end', (error, fileObj) => {
        if (error) {
          console.error('Error during upload:', error);
          this.setState({ inProgress: false });
        } else {
          console.log('File Uploaded:', fileObj);
          this.setState(prevState => ({
            uploadedFiles: [...prevState.uploadedFiles, fileObj],
            inProgress: false,
          }));
        }
      });

      uploadInstance.on('progress', (progress, fileObj) => {
        console.log(`Upload Percentage: ${progress}`);
        this.setState({ progress });
      });

      uploadInstance.start(); // Start the upload
    }
  }

  renderUploadedFiles() {
    return this.state.uploadedFiles.map(file => (
      <li key={file._id}>{file.name}</li>
    ));
  }

  renderProgressBar() {
    if (!this.state.inProgress) {
      return null;
    }

    return (
      <div>
        <div style={{ width: `${this.state.progress}%` }} className="progress-bar">
          {this.state.progress}%
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload.bind(this)} disabled={this.state.inProgress} />
        {this.renderProgressBar()}
        <ul>
          {this.renderUploadedFiles()}
        </ul>
      </div>
    );
  }
}

export default FileUploadComponent;
