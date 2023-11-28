import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ChatSessionsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ChatSessionsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      latestQuery: {
        type: String,
        optional: true,
      },
      sentAt: Date,
      userId: String,
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
 * @type {SessionsCollection}
 */
export const ChatSessions = new ChatSessionsCollection();
