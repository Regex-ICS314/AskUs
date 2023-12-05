import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Image, Nav, Navbar, Row, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Facebook, Instagram, List, PersonFill, PersonPlusFill, Twitter, Youtube } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** Component that Loads the navbar for all pages.
 * a mix of the UH website navbar and our own additions to the navbar.
 * Rendered by the App Layout component. */
const NavBar = () => {
// useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <div>
      {/* the top Navbar based on the UH website */}
      <Navbar className="navbarColor" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav">Navigation <List /></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav variant="underline" className="me-auto justify-content-start">
              <Nav.Link href="https://www.hawaii.edu/">UH Home</Nav.Link>
              <Nav.Link href="https://www.hawaii.edu/directory/">Directory</Nav.Link>
              <Nav.Link href="https://myuh.hawaii.edu/">MyUH</Nav.Link>
              <Nav.Link href="https://workatuh.hawaii.edu/">Work at UH</Nav.Link>
              <Nav.Link href="https://apply.hawaii.edu/">Apply</Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              <Nav.Link href="https://twitter.com/UHawaiiNews"><Twitter /></Nav.Link>
              <Nav.Link href="https://www.facebook.com/universityofhawaii"><Facebook /></Nav.Link>
              <Nav.Link href="https://www.instagram.com/uhawaiinews/"><Instagram /></Nav.Link>
              <Nav.Link href="https://www.flickr.com/photos/uhawaii"><Image src="/images/icon-flickr.png" width={15} /></Nav.Link>
              <Nav.Link href="https://www.youtube.com/user/uhmagazine"><Youtube /></Nav.Link>

              <Nav className="justify-content-end">
                {currentUser === '' ? (
                  <NavDropdown id="basic-nav-dropdown" title={<PersonFill />} className="unique-dropdown-class">
                    <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                      <PersonFill />
                      Sign
                      in
                    </NavDropdown.Item>
                    <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                      <PersonPlusFill />
                      Sign
                      up
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown id="navbar-current-user" title={currentUser}>
                    <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                      <BoxArrowRight />
                      {' '}
                      Sign
                      out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Logo for the UH website */}
      <div>
        <Container>
          <Row>
            <Col lg={7} className="mt-4 ms-2 mb-5">
              <Container>
                {/* Show this image on extra-small screens */}
                <Image
                  src="/images/uh-nameplate.png"
                  alt="Image for Extra Small Screens"
                  className="d-block d-sm-none mt-3"
                  width={300}
                />

                {/* Show this image on small and larger screens */}
                <Image
                  src="/images/uh-nameplate.png"
                  alt="Image for Small and Larger Screens"
                  className="d-none d-sm-block mt-3"
                  width={450}
                />
              </Container>
            </Col>
          </Row>
        </Container>
        {/* Banner for the Department of technology for UH */}
        <div className="gray-background">
          <Container>
            <Nav variant="underline" className="bottom-nav"><Nav.Link className="ms-2" href="https://www.hawaii.edu/its"><h3>Information Technology Services</h3></Nav.Link></Nav>
            <Nav.Link className="ms-2"><p>University of Hawaii System</p></Nav.Link>
          </Container>
        </div>
      </div>
      {/* Our own navbar that includes the components and pages that
       we personally had added */}
      <div className="bottom-nav">
        <Navbar expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggler-bottom">MENU<List className="pb-1" /></Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav variant="underline" className="justify-content-start bottom-nav ms-2">
                <Nav.Link id="landing" as={NavLink} to="/" key="landing">Home</Nav.Link>
                <Nav.Link id="infosec" as={NavLink} to="/infosec" key="infosec">Infosec</Nav.Link>
                <Nav.Link id="chatbot-nav" as={NavLink} to="/chatbot" key="chatbot">Chatbot</Nav.Link>
                <Nav.Link id="user-panel" as={NavLink} to="user" key="user">User Panel</Nav.Link>
                {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
                  <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>
                ) : ''}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

export default NavBar;
