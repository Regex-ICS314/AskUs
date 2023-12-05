import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Row, Col } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import FAQCard from './FAQCard';
import LoadingBar from './LoadingBar';

/** Renders the top 8 most frequently asked (answered) questions in a card format.
 * Imports data from the AskUs collection, and displays a loading bar if not finished.
 * @returns A container with a header and a few rows of cards containing top 8 most
 *           frequent articles. If not done loading data, displays a dynamic loading bar. */
const FAQCards = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, articles } = useTracker(() => {
    // Get access to specific AskUs documents.
    const subscription = Meteor.subscribe(AskUs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the AskUs documents
    const items = AskUs.collection.find().fetch();
    return {
      articles: items,
      ready: rdy,
    };
  }, []);

  // Max number of articles loaded, used to display loading bar progress.
  const maxArticles = 8;

  return (ready ? (
    <Container>
      <h4 style={{ textAlign: 'left' }}>Frequently Asked Questions</h4>
      <Row xs={1} md={2} lg={4} className="g-4">
        {articles.map((article, index) => (<Col key={index}><FAQCard article={article} /></Col>))}
      </Row>
    </Container>
  ) : <LoadingBar now={100 * (articles.length / maxArticles)} size={1} />);
};

export default FAQCards;
