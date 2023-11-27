import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { MyFiles } from '../../api/fileupload/JsonFilesCollection';

Meteor.methods({
  'files.remove'(fileId) {
    check(fileId, String);

    const file = MyFiles.findOne(fileId);
    if (!file) {
      throw new Meteor.Error('file-not-found', 'File not found');
    }

    // Additional checks like user permissions can be added here
    // Example: if (!this.userId || file.userId !== this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    MyFiles.remove(fileId); // This will also remove the file from the filesystem
  },

  'files.rename'(fileId, newName) {
    check(fileId, String);
    check(newName, String);

    const file = MyFiles.findOne(fileId);
    if (!file) {
      throw new Meteor.Error('file-not-found', 'File not found');
    }

    // Additional checks like user permissions can be added here
    // Example: if (!this.userId || file.userId !== this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    // Update the file name
    MyFiles.update(fileId, {
      $set: {
        name: newName,
        // If you're storing the name in metadata as well
        'meta.name': newName,
      },
    });
  },

  // ... other methods
});
