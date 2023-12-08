import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

/** uncomment deploy/localhost respectively */
export const MyFiles = new FilesCollection({
  // storagePath: '/json', // for deployed app
  permissions: 0o774,
  parentDirPermissions: 0o774,
  collectionName: 'MyFiles',
  allowClientCode: false, // Disallow remove files from the client
  storagePath: '../../../../../../data/uploadedFiles', // for localhost
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
