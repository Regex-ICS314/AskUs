import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Button } from 'react-bootstrap';
import { MyFiles } from '../../api/fileupload/FilesCollection';

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] }; // State initialization moved to constructor
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

  handleDelete = (fileId) => {
    Meteor.call('files.remove', fileId, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
        // Handle the error appropriately
      } else {
        // Optionally, update state or use reactivity for UI update
      }
    });
  };

  renderFiles() {
    const { files } = this.state;
    return files.map(file => (
      <div key={file._id}>
        {file.name}
        <Button onClick={() => this.handleDelete(file._id)}>Delete</Button>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h2>File Manager</h2>
        {this.renderFiles()}
      </div>
    );
  }
}

export default FileManager;
