import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Accordion } from 'react-bootstrap';
import { UserSessions } from '../../api/session/UserSessions';
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import UserSessionsAccordion from './UserSessionsAccordion';

// get a subscription of all the sessions grouped by userID, each index is an array of all the userId's sessions

/** Component that renders the chat history of all users on admin page.
 * @returns Accordion with a section for each user in database's chatbase. */
const AdminChatHistory = () => {
  // eslint-disable-next-line no-unused-vars
  const { ready, users } = useTracker(() => {
    const subscription = Meteor.subscribe(UserSessions.userPublicationName);
    const rdy = subscription.ready();
    const userItems = UserSessions.collection.find({}).fetch();
    // Extract user IDs from the userItems
    const userIds = userItems.map(item => item.userId);
    // Create a Set from the userIds to remove duplicates, then convert back to an array
    const uniqueUserIds = [...new Set(userIds)];
    return {
      users: uniqueUserIds,
      ready: rdy,
    };
  }, []);
  // eslint-disable-next-line no-console
  console.log(users);
  return (
    <Accordion>
      {Array.isArray(users) && users.map((user, index) => (
        <UserSessionsAccordion key={user._id} user={user} eventKey={index.toString()} />
      ))}
    </Accordion>
  );
};

export default AdminChatHistory;
