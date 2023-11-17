/* import { Meteor } from 'meteor/meteor';
import { Times } from '../../api/time/Times';

// Function to add data to the Times collection.
const addDataToVisits = (data) => {
  console.log(`  Adding: ${data.pageName} (Visits: ${data.visitCount})`);
  Times.collection.insert(data);
};

// Initialize the Askus collection if empty.
Meteor.startup(() => {
  if (Times.collection.find().count() === 0) {
    console.log('No data found in Times collection. Initializing with default data.');
    addDataToVisits({
      pageUrl: 'chatbot',
      pageName: 'Chatbot',
      visitCount: 0,
    });
  }
}); */
