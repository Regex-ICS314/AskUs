import React from 'react';
import { Meteor } from 'meteor/meteor';
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
import LoadingSpinner from './LoadingSpinner';
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

const processData = (things) => {
  const stuff = things.map((thing) => (
    {
      label: `${thing.date.getMonth() + 1}/${thing.date.toString().substring(8, 10)}/${thing.date.getFullYear()}`,
      value: thing.visitCount,
    }));
  const chartData = {
    labels: stuff.map(d => d.label),
    datasets: [
      {
        label: 'Chatbot Page Views',
        data: stuff.map(d => d.value),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderWidth: 1,
      },
    ] };
  return (chartData);
};

const BarChartComponent = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, data } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Visits.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const items = Visits.collection.find(
      {},
      { sort: { year: 1, day: 1 } },
    ).fetch();
    let processedData;
    if (rdy) {
      processedData = processData(items);
      // console.log(processedData);
    }
    return {
      data: processedData,
      ready: rdy && processedData,
    };
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return ready ? (<Bar data={data} options={options} />) : (<LoadingSpinner />);
};

export default BarChartComponent;
