import React, { Component } from 'react';
import { MyFiles } from '../../api/fileupload/JsonFilesCollection';

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

      uploadInstance.on('end', (error) => {
        if (error) {
          console.error('Error during upload:', error);
          this.setState({ inProgress: false });
        } else {
          console.log('File Uploaded');
          this.setState(prevState => ({
            uploadedFiles: [...prevState.uploadedFiles],
            inProgress: false,
          }));
        }
      });

      uploadInstance.start(); // Start the upload
    }
  }

  renderUploadedFiles() {
    const { uploadedFiles } = this.state; // Destructure state
    return uploadedFiles.map(file => (
      <li key={file._id}>{file.name}</li>
    ));
  }

  renderProgressBar() {
    const { inProgress, progress } = this.state; // Destructure state
    if (!inProgress) {
      return null;
    }

    return (
      <div>
        <div style={{ width: `${progress}%` }} className="progress-bar">
          {progress}%
        </div>
      </div>
    );
  }

  render() {
    const { inProgress } = this.state; // Destructure state
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload.bind(this)} disabled={inProgress} />
        {this.renderProgressBar()}
        <ul>
          {this.renderUploadedFiles()}
        </ul>
      </div>
    );
  }
}

export default FileUploadComponent;
