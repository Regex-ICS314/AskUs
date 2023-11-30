import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class UserSessionsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'UserSessionsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      userId: {
        type: String,
        optional: true,
      },
      messages: {
        type: Array,
        optional: true,
      },
      'messages.$': {
        type: Object,
        optional: true,
      },
      'messages.$.role': {
        type: String,
        optional: true,
      },
      'messages.$.content': {
        type: String,
        optional: true,
      },
      'messages.$.embedding': {
        type: Array,
        optional: true,
      },
      'messages.$.embedding.$': {
        type: Number,
        optional: true,
      },
      currentTopicEmbedding: {
        type: Array, // or Array if you want to accept arrays as well
        optional: true,
        defaultValue: null,
      },
      'currentTopicEmbedding.$': {
        type: String,
        optional: true,
      },

      currentArticles: {
        type: Array, // or Array if you want to accept arrays as well
        optional: true,
        defaultValue: null,
      },
      'currentArticles.$': {
        type: Object,
        optional: true,
      },
      'currentArticles.$._id': {
        type: String,
        optional: true,
      },
      'currentArticles.$.freq': {
        type: Number,
        optional: true,
      },
      'currentArticles.$.filename': {
        type: String,
        optional: true,
      },
      'currentArticles.$.question': {
        type: String,
        optional: true,
      },
      'currentArticles.$.article_text': {
        type: String,
        optional: true,
      },
      createdAt: {
        type: Date,
        optional: true,
      },
      lastUpdatedAt: {
        type: Date,
        optional: true,
      },
      isTemporaryId: {
        type: Boolean,
        optional: true,
      },
      // Add more fields if necessary
    });
    // Attach the schema to the collection.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the SessionsCollection.
 * @type {UserSessionsCollection}
 */
export const UserSessions = new UserSessionsCollection();
