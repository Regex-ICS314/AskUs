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
    <Container id="admin-page"> {/* Retained from HEAD branch */}
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
          <AdminPaginationTable id="admin-pagination-table" itemsPerPage={10} /> {/* ID added */}
          <Card className="mt-3" id="bar-chart-card"> {/* Assuming we keep the session-manager branch's chart, ID added */}
            <BarChartComponent data={testData} />
          </Card>
        </Col>

        <Col lg={6}>
          {/* Combining elements from both branches for this section */}
          <Card className="shadow-lg p-3 mb-5 bg-body rounded" id="status-card"> {/* ID added */}
            <Card.Header><h5>Startup Requirements</h5></Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <EmbeddedButton id="embedded-button" /> {/* ID added */}
                </Col>
                <Col lg={2}>
                  <StatusSquare id="status-square-1" complete={complete} size={1} /> {/* ID added */}
                </Col>
              </Row>
              <Row className="align-items-center mt-2">
                <Col>
                  <UpdateDatabaseButton id="update-db-button" /> {/* ID added */}
                </Col>
                <Col lg={2}>
                  <StatusSquare id="status-square-2" complete={complete2} /> {/* ID added */}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <AdminAvgResp id="admin-avg-resp" /> {/* Keeping this from the session-manager branch, ID added */}

          <AdminDragNDrop id="admin-drag-n-drop" /> {/* ID added */}
          <FileManager id="file-manager" /> {/* ID added */}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
