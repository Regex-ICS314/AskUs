import React, { useState, useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { MyFiles } from '../../api/fileupload/FilesCollection';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '40px',
  paddingBottom: '30px',
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

// This component renders a drag and drop zone for the admin page (DOES NOT CURRENTLY UPLOAD ANYTHING)
const AdminDragNDrop = () => {
  const [progress, setProgress] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [isFocused, isDragAccept, isDragReject]);

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

  const renderUploadedFiles = () => uploadedFiles.map(file => (
    <li key={file._id}>
      {file.name}
      {/* Add a link to view/download the file if public */}
    </li>
  ));

  return (
    <Card className="m-1 p-2">
      <div
        {...getRootProps()}
        style={{ ...style, ...getRootProps().style }}
      >
        <input {...getInputProps()} />
        <p>Click or drop files here to upload</p>
        {renderProgressBar()}
        <ul>
          { renderUploadedFiles() }
        </ul>
      </div>
    </Card>
  );
};
export default AdminDragNDrop;
