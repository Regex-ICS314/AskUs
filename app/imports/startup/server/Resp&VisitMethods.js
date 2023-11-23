import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { RespTimes } from '../../api/resptime/RespTimes';
// eslint-disable-next-line no-unused-vars
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

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
    return ('');
  },
});
