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
// import FileUploadComponent from '../components/FilesUpload';
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
    <Container id="admin-page">
      <Container>
        <p><a href="https://askuh.info">Home</a> &gt; Admin</p>
      </Container>

      <Row>
        <Col>
          <h2 className="text-center my-4" style={{ textDecoration: 'underline' }}>System Dashboard</h2>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <AdminPaginationTable id="admin-pagination-table" itemsPerPage={10} />
        </Col>

        <Col lg={6}>
          <Row className="mb-3">
            <Card className="shadow-lg" id="bar-chart-card">
              <BarChartComponent data={testData} />
            </Card>
          </Row>

          <Row className="mb-3">
            <Col>
              <Card className="shadow-lg bg-body rounded" id="status-card">
                <Card.Header className="justify-content-md-center text-center"><h5>Startup Requirements</h5></Card.Header>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <EmbeddedButton id="embedded-button" />
                    </Col>
                    <Col lg={3}>
                      <StatusSquare id="status-square-1" complete={complete} />
                    </Col>
                  </Row>
                  <Row className="align-items-center mt-1">
                    <Col>
                      <UpdateDatabaseButton id="update-db-button" />
                    </Col>
                    <Col lg={3}>
                      <StatusSquare id="status-square-2" complete={complete2} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <AdminAvgResp id="admin-avg-resp" />
            </Col>
          </Row>
          <AdminDragNDrop id="admin-drag-n-drop" />
          <FileManager id="file-manager" />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
