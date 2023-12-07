import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { RespTimes } from '../../api/resptime/RespTimes';
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

/** Helper function to add data to the Visits collection.
 * @param {object} data - Object containing data to be added. */
const addDataToVisits = (data) => {
  console.log(`Adding: ${data.page} (Visits: ${data.visitCount})`);
  Visits.collection.insert(data);
};

Meteor.methods({
  /** If user is an admin, returns the average amount of time it takes for chatbot to respond using RespTimes collection.
   * @returns number - Average response time of chatbot. */
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

  /** Helper function to increment visit count when someone visits chatbot page. Also initializes data if needed. */
  increaseVisitCount() {
    const current = new Date();
    const startDate = new Date(current.getFullYear(), 0, 1);
    // day is out of 365.
    const day = Math.floor((current - startDate) / (24 * 60 * 60 * 1000));

    // Creates a new date in Visits collection if current date not found.
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
      console.log('Created new date entry.');
    }

    // Adds date data with zero for visitCount for last 20 days if not found (for graphing purposes).
    for (let i = 1; i < 20; i++) {
      const prevDate = new Date(new Date().setDate(current.getDate() - i));

      if (Visits.collection.find(
        { year: current.getFullYear(),
          day: day - i,
        },
      ).count() === 0) {
        console.log(`Empty date ${day - i} not found in Visits collection. Initializing with default data.`);
        addDataToVisits({
          page: 'chatbot',
          date: prevDate,
          year: prevDate.getFullYear(),
          day: day - i,
          visitCount: 0,
        });
        console.log('Created new date entry.');
      }
    }

    const id = Visits.collection.find({ year: current.getFullYear(), day: day }).fetch()[0]._id;
    const visits = Visits.collection.find({ year: current.getFullYear(), day: day }).fetch()[0].visitCount;
    Visits.collection.update(id, { $set: { visitCount: visits + 1 } }, (error) => (error ?
      console.log('Error', error.message, 'error') :
      console.log(/* `Increasing ${id} visits to ${visits + 1}.` */)));
    return ('Incremented date successfully.');
  },
});
