import { Meteor } from 'meteor/meteor';
// Next line creates the collection, even though it does not add anything here.
// eslint-disable-next-line no-unused-vars
import { RespTimes } from '../../api/resptime/RespTimes';
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

// Function to add data to the Visits collection.
const addDataToVisits = (data) => {
  console.log(`  Adding: ${data.pageName} (Visits: ${data.visitCount})`);
  Visits.collection.insert(data);
};

// Initialize the Askus collection if empty.
Meteor.startup(() => {
  if (Visits.collection.find().count() === 0) {
    console.log('No data found in Visits collection. Initializing with default data.');
    addDataToVisits({
      pageUrl: 'chatbot',
      pageName: 'Chatbot',
      visitCount: 0,
    });
  }
});
