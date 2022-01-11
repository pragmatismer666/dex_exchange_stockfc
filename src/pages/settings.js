import React, { useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase, { auth } from "../components/firebase/firebase";
import { doGetAnUser } from "../components/firebase/auth";
import { useHistory } from "react-router-dom";

export default function Settings() {
  const [mfa, setMfa] = useState(false);
  const history = useHistory();
  const account = localStorage.getItem("account-info");
  const currentUser = auth.currentUser;

  if (!account || !currentUser) {
    localStorage.clear();
    history.push("/login");
  }
  const changeMfa = () => {
    setMfa(!mfa);
  };
  return (
    <>
      <div className="settings mtb15">
        <div className="container-fluid">
          <Tab.Container defaultActiveKey="settings">
            <Row>
              <Col lg={3}>
                <Nav variant="pills" className="settings-nav">
                  <Nav.Item>
                    <Link className="nav-link " to="/profile">
                      Profile
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link className="nav-link " to="/wallet">
                      Wallet
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="settings">

                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}
