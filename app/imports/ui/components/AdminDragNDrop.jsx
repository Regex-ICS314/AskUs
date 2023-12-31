import React, { useState, useMemo } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { MyFiles } from '../../api/fileupload/FilesCollection';

// Styling for dropzone.
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '50px',
  paddingBottom: '20px',
  borderWidth: 1,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fbfbfb',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

/** This component renders a drag and drop upload zone for the admin page, enabling uploads to database.
 * @returns Card containing a dropzone container that uploads files. */
const AdminDragNDrop = () => {
  const [progress, setProgress] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handles file upload event.
  const onDrop = (acceptedFiles) => {
    // Assuming you want to upload the first accepted file
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const uploadInstance = MyFiles.insert({
        file: file,
        chunkSize: 'dynamic',
      }, false);

      setInProgress(true);
      setProgress(0); // Initialize progress

      uploadInstance.on('end', (error, fileObj) => {
        if (!error) {
          console.log('File Uploaded:', fileObj);
          setUploadedFiles(prevFiles => [...prevFiles, fileObj]);
          alert('File uploaded successfully!'); // Provide user feedback
        } else {
          console.error('Error during upload:', error);
          alert('Error during file upload.'); // Display error message
        }
        setInProgress(false);
      });

      uploadInstance.on('progress', (prog) => {
        setProgress(prog); // Update progress
      });

      uploadInstance.start();
    }
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { 'application/json': [] }, // Accept only JSON files
  });

  // Destructure props from getRootProps and getInputProps
  const { onKeyDown, onFocus, onBlur, onClick, onDragEnter, onDragOver, onDragLeave } = getRootProps();
  const { type, accept, multiple } = getInputProps();

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [isFocused, isDragAccept, isDragReject]);

  // Renders a progress bar.
  const renderProgressBar = () => {
    if (!inProgress) return null;
    return (
      <div>
        <div style={{ width: `${progress}%` }} className="progress-bar">
          {progress}%
        </div>
      </div>
    );
  };

  // Renders which files have been uploaded in dropzone container.
  const renderUploadedFiles = () => uploadedFiles.map(file => (
    <li key={file._id}>
      {file.name}
      {/* Add a link to view/download the file if public */}
    </li>
  ));

  return (
    <Card className="p-2 shadow-lg mb-3 bg-body rounded">
      <Container
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{ ...style, ...getRootProps().style }}
      >
        <input className="visually-hidden" type={type} accept={accept} multiple={multiple} />
        <p>Click or drop files here to upload</p>
        {renderProgressBar()}
        <ul>
          { renderUploadedFiles() }
        </ul>
      </Container>
    </Card>
  );
};
export default AdminDragNDrop;
