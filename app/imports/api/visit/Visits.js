import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Collection to track the amount of page visits of the chatbot page, to be displayed on admin dashboard. */
class VisitCollection {
  constructor() {
    // The name of this collection.
    this.name = 'VisitCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      page: String,
      date: Date,
      year: Number,
      day: Number,
      visitCount: Number,
    });
    // Attach the schema to the collection.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the VisitCollection.
 * @type {VisitCollection}
 */
export const Visits = new VisitCollection();
