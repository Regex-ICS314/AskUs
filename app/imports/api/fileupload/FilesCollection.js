import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const MyFiles = new FilesCollection({
  collectionName: 'MyFiles',
  allowClientCode: false, // Disallow remove files from the client
  storagePath: '../../../../../private/data/uploadedFiles', // Specify the storage path
  onAfterUpload(file) {
    // Perform server-side operations here after the file is uploaded
    console.log('File uploaded:', file);
  },
});

if (Meteor.isServer) {
  MyFiles.denyClient();
  Meteor.publish('files.all', function () {
    return MyFiles.find().cursor;
  });
}
