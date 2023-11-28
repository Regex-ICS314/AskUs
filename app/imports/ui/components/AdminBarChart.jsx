// BarChartComponent.js
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Visits } from '../../api/visit/Visits';

// Registering the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChartComponent = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, data } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Visits.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const items = Visits.collection.find().fetch();
    // Replace this when send times are implemented in message collection
    const testData = [{ label: 'Week 1', value: 13 }, { label: 'Week 2', value: 57 }, { label: 'Week 3', value: 32 }, { label: 'Week 4', value: 79 }];
    return {
      data: testData,
      ready: rdy,
    };
  }, []);
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Page Visits (Still fake data, will connect backend data to this later)',
        data: data.map(d => d.value),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartComponent;
