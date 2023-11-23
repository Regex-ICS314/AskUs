import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { RespTimes } from '../../api/resptime/RespTimes';
// eslint-disable-next-line no-unused-vars
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

// Function to add data to the Visits collection.
const addDataToVisits = (data) => {
  console.log(`Adding: ${data.page} (Visits: ${data.visitCount})`);
  Visits.collection.insert(data);
};

Meteor.methods({
  // Gets the average amount of time it takes for chatbot to respond using RespTimes collection.
  getAvgRespTime() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      let total = 0;
      RespTimes.collection.find().forEach(item => {
        total += item.responseTimeMs;
      });
      const denom = RespTimes.collection.find().count();
      total /= denom;
      return total;
    }
    return (0);
  },

  increaseVisitCount() {
    const current = new Date();
    const startDate = new Date(current.getFullYear(), 0, 1);
    // day is out of 365.
    const day = Math.floor((current - startDate) / (24 * 60 * 60 * 1000));
    if (Visits.collection.find(
      { year: current.getFullYear(),
        day: day,
      },
    ).count() === 0) {
      console.log('Current date not found in Visits collection. Initializing with default data.');
      addDataToVisits({
        page: 'chatbot',
        date: current,
        year: current.getFullYear(),
        day: day,
        visitCount: 1,
      });
      return ('Created new date entry.');
    }
    const id = Visits.collection.find({ year: current.getFullYear(), day: day }).fetch()[0]._id;
    const visits = Visits.collection.find({ year: current.getFullYear(), day: day }).fetch()[0].visitCount;
    Visits.collection.update(id, { $set: { visitCount: visits + 1 } }, (error) => (error ?
      console.log('Error', error.message, 'error') :
      console.log(/* `Increasing ${id} visits to ${visits + 1}.` */)));
    return ('Incremented date successfully.');
  },
});
