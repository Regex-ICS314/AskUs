import { Meteor } from 'meteor/meteor';
// Unused import creates the collection, even though it does not add any items here.
// eslint-disable-next-line no-unused-vars
import { RespTimes } from '../../api/resptime/RespTimes';
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

// Function to add data to the Visits collection.
const addDataToVisits = (data) => {
  console.log(`Adding: ${data.pageName} (Visits: ${data.visitCount})`);
  Visits.collection.insert(data);
};

// Initialize the VisitCollection collection if empty.
Meteor.startup(() => {
  if (Visits.collection.find().count() === 0) {
    console.log('No data found in Visits collection. Initializing with default data.');
    const d = new Date();
    addDataToVisits({
      page: 'chatbot',
      date: d,
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDay(),
      visitCount: 0,
    });
  }
});
