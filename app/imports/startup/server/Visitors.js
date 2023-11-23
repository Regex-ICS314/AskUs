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
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    // day is out of 365.
    const day = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    addDataToVisits({
      page: 'chatbot',
      date: currentDate,
      year: currentDate.getFullYear(),
      day: day,
      visitCount: 0,
    });
  }
});
