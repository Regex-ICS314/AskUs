import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { AskUs } from '../../api/askus/AskUs';
import { Messages } from '../../api/message/Messages';
import { ChatSessions } from '../../api/session/ChatSessions';
import { Visits } from '../../api/visit/Visits';
import { MyFiles } from '../../api/fileupload/FilesCollection';
import { UserSessions } from '../../api/session/UserSessions';

/** Publishes the most recent 15 days of the page visit collection, for use in admin page graph.
 * @returns Pointer - Pointer to the Visit collection containing the 15 most recent days. */
Meteor.publish(Visits.userPublicationName, function () {
  return Visits.collection.find(
    {},
    { sort: { year: -1, day: -1 }, limit: 15 },
  );
});

/** Publishes the top 8 most frequently visited articles, for use in landing page cards.
 * @returns Pointer - Pointer to the AskUs collection containing the top 8 most FAQ. */
Meteor.publish(AskUs.userPublicationName, function () {
  return AskUs.collection.find(
    {},
    { sort: { freq: -1 }, limit: 8 },
  );
});

/** If logged in and with admin role, then publish a subset of the AskUs collection based on input.
 * @param {number} start - Starting index of articles to be published.
 * @param {number} num - Amount of articles to be published.
 * @returns Pointer - Pointer to the AskUs collection containing requested subset of collection. */
Meteor.publish(AskUs.adminPublicationName, function (start, num) {
  check(start, Number);
  check(num, Number);

  if (Roles.userIsInRole(this.userId, 'admin')) {
    return AskUs.collection.find(
      {},
      { sort: { filename: 1 }, skip: start, limit: num },
    );
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

// Return all the chats in the database sorted by earliest date
Meteor.publish(Messages.userPublicationName, function () {
  return Messages.collection.find(
    {},
    { sort: { sentAt: 1 } },
  );
});

// Return all the history in the database sorted by latest date
Meteor.publish(ChatSessions.userPublicationName, function () {
  return ChatSessions.collection.find(
    {},
    { sort: { sentAt: 1 } },
  );
});

Meteor.publish('files.all', function () {
  return MyFiles.find().cursor;
});

Meteor.publish(UserSessions.userPublicationName, function () {
  return UserSessions.collection.find();
});

// eslint-disable-next-line consistent-return
Meteor.publish('users', function () {
  if (this.userId) {
    return Meteor.users.find({}, { fields: { services: 0 } });
  }
});
