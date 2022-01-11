import React from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ThemeConsumer } from "../context/ThemeContext";
export default function wallet() {
  return (
    <>
      <div className="settings mtb15">
        <div className="container-fluid">
          <Tab.Container defaultActiveKey="wallet">
            <Row>
              <Col lg={3}>
                <Nav variant="pills" className="settings-nav">
                  <Nav.Item>
                    <Link className="nav-link " to="/profile">
                      Profile
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="wallet">Wallet</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link className="nav-link " to="/settings">
                      Settings
                    </Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="wallet">
                    <div className="wallet">
                      
                    </div>
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
