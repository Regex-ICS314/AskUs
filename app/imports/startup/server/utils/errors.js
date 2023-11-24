import { Meteor } from 'meteor/meteor';

/**
 * Throws a formatted Meteor error and logs the message.
 * @param {string} type - The error type.
 * @param {string} message - The error message.
 * @throws {Meteor.Error} Throws a Meteor.Error with the specified type and message.
 */

const throwError = (type, message) => {
  console.error(message);
  throw new Meteor.Error(type, message);
};

export default throwError;
