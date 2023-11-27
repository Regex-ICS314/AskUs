import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Card } from 'react-bootstrap';
import BarChartComponent from '../components/AdminBarChart';
import StatusSquare from '../components/StatusSquare';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';
import AdminPaginationTable from '../components/AdminPaginationTable';
import AdminAvgResp from '../components/AdminAvgResp';
// eslint-disable-next-line no-unused-vars
import AdminDragNDrop from '../components/AdminDragNDrop';
import FileUploadComponent from '../components/FilesUpload';
import FileManager from '../components/FileManager';

/* Renders a table containing all of the Stuff documents. Use <AdminPaginationTableItem> to render each row. */
const AdminPage = () => {
  const [complete, setComplete] = useState(false);
  const [complete2, setComplete2] = useState(false);

  // Replace this when send times are implemented in message collection
  const testData = [{ label: 'Week 1', value: 13 }, { label: 'Week 2', value: 57 }, { label: 'Week 3', value: 32 }, { label: 'Week 4', value: 79 }];

  // Retrieve status of db using meteor functions.
  useEffect(() => {
    Meteor.call('embedExist', (error, result) => {
      if (error) {
        console.log('Error getting embed status:', error);
      } else {
        // console.log('Status:', result);
        setComplete(result);
      }
    });
  });

  // Retrieve status of FERPA using meteor functions.
  useEffect(() => {
    Meteor.call('otherDbExist', (error, result) => {
      if (error) {
        // console.log('FERPA not found.');
      } else {
        // console.log('Status:', result);
        setComplete2(result);
      }
    });
  });

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2 className="text-center my-4" style={{ textDecoration: 'underline' }}>System Dashboard</h2>
        </Col>
      </Row>

      <Row>
        {/* Table and Charts Section */}
        <Col lg={6}>
          <AdminPaginationTable itemsPerPage={10} />
          <Card className="mt-3">
            <BarChartComponent data={testData} />
          </Card>
        </Col>

        {/* System Status and File Management Section */}
        <Col lg={6}>
          <Card className="mb-3">
            <Card.Header><h5>Startup Requirements</h5></Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <EmbeddedButton />
                </Col>
                <Col lg={2}>
                  <StatusSquare complete={complete} size={1} />
                </Col>
              </Row>
              <Row className="align-items-center mt-2">
                <Col>
                  <UpdateDatabaseButton />
                </Col>
                <Col lg={2}>
                  <StatusSquare complete={complete2} />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <AdminAvgResp />

          <AdminDragNDrop />

          <FileUploadComponent />
          <FileManager />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
