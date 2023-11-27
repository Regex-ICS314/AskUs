import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MyFiles } from '../../api/fileupload/JsonFilesCollection';

const FilesList = ({ files }) => (
  <div>
    {files.map(file => {
      // Ensure `file` is a FileCursor and has `link` method
      if (typeof MyFiles.link === 'function') {
        const fileLink = file.link(); // Get the file link
        return (
          <div key={MyFiles._id}>
            <a href={fileLink} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </div>
        );
      }
      // If `file.link` is not a function, handle accordingly
      console.error('File does not have a link method:', file);
      return null; // or some placeholder

    })}
  </div>
);

FilesList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesList;
