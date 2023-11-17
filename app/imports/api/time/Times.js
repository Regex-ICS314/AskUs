import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class TimeCollection {
  constructor() {
    // The name of this collection.
    this.name = 'TimeCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      start: Number,
      end: Number,
      total: Number,
    });
    // Attach the schema to the collection.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the AskUsCollection.
 * @type {TimeCollection}
 */
export const Times = new TimeCollection();
