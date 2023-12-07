import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

/** Small component that displays the average response time of the chatbot.
 * @returns Card that displays average response time in seconds. */
const AdminAvgResp = () => {
  const [respTime, setRespTime] = useState(0);

  // Meteor method that fetches average response time from server.
  useEffect(() => {
    Meteor.call('getAvgRespTime', (error, result) => {
      if (error) {
        console.error('Error getting average response time:', error);
      } else {
        // console.log('Average Response Time:', result);
        const adjusted = Math.round(result / 10) / 100;
        setRespTime(adjusted);
      }
    });
    if (!(respTime > 0)) {
      setRespTime(0);
    }
  });

  return (
    <Card className="text-center shadow-lg bg-body rounded">
      <Card.Header>
        <h5>Average Response Time</h5>
      </Card.Header>
      <h2 className="my-4">{respTime}s</h2>
    </Card>
  );
};

export default AdminAvgResp;
