import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Login from "./Login";
import { title, setTitle } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../css/CollegeReviewFeedback.css";

import react from "react";
import { FaStar } from "react-icons/fa";

import NavBar from "./NavBar";
const colors = {
  orange: "FF8C00",
  grey: "#a9a9a9",
};

const CollegeReview = () => {
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [hoverValue, setHoverValue] = useState(undefined);

  const handleClick = (value) => {
    setCurrentValue(value);
  };
  const handleMouseOver = (value) => {
    setHoverValue(value);
  };
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const accessToken = localStorage.getItem("access_token");

  const showModal = () => {
    setIsOpen(true);
    setTitle("Modal Ready");
    document.body.style.backgroundColor = "white";
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const startTimer = () => {
    setStartTime(Date.now());
  };

  const modalLoaded = () => {
    setEndTime(Date.now());
  };

  const onExit = () => {
    setTitle("Goodbye 😀");
  };

  const onExited = () => {
    document.body.style.backgroundColor = "green";
  };

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar></NavBar>
      <div className="trmodal">
        <button className="modalbtnhere" onClick={showModal}>
          Display College Review Modal
        </button>
      </div>

      <Modal
        show={isOpen}
        onHide={hideModal}
        onEnter={startTimer}
        onEntered={modalLoaded}
      >
        <Modal.Header>
          <Modal.Title>College Review</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>{endTime - startTime} ms</Modal.Body> */}
        <Modal.Body>
          <Container fluid>
            <Row className="courseInfo">
              <Col lg="1"></Col>
              <Col lg="10">
                <Form>
                  <Container>
                    <div style={styles.container}>
                      <div>
                        <label>
                          <b>Rate your Overall Experience </b>
                        </label>
                        <br></br>
                      </div>
                      <div style={styles.stars}>
                        {stars.map((_, index) => {
                          return (
                            <FaStar
                              key={index}
                              size={24}
                              stylw={{
                                marginRight: 10,
                                cursor: "pointer",
                              }}
                              color={
                                (hoverValue || currentValue) > index
                                  ? colors.orange
                                  : colors.grey
                              }
                              onClick={() => handleClick(index + 1)}
                              onMouseOver={() => handleMouseOver(index + 1)}
                              onMouseLeave={handleMouseLeave}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <Row>
                      <Col lg="6"></Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <br></br>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label>
                            <b>What's your Feedback</b>
                          </Form.Label>
                          <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Also Notify Through Email"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="10"></Col>
                      <Col lg="2">
                        <br></br>
                        <Button className="schButton" type="submit">
                          Submit Review
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Form>
                <br />
              </Col>
              <Col lg="1"></Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <button onClick={hideModal}>Cancel</button> */}
          {/* <button>Submit Review</button> */}
          <Button className="schButton" onClick={hideModal} type="submit">
            Cancel
          </Button>
          <Button className="schButton" type="submit">
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CollegeReview;

const styles = {
  container: {
    display: "block8",
    fexDirection: "column",
    alignItems: "center",
  },
};

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
