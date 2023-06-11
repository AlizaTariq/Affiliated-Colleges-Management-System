import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Home from "./Home";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/scheduler.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import Exam_Schedule from "./Exam_Schedule";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from "./NavBar";

const SendExamDuty = () => {
  const [moreInfo, setMoreInfo] = useState("");

  const [sendValue, setSendValue] = useState(false);
  const [backBtnValue, setBackBtnValue] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [duty, setDuty] = useState([]);

  useEffect(() => {
    const url = "http://127.0.0.1:5000/getDutyDetail";
    axios
      .post(url, { Id: state.data.responseData })
      .then((res) => {
        const resData = res.data;
        setDuty(resData);
      })
      .catch((err) => alert(err + "  OOPS! BAD REQUEST CC"));
  }, []);
  function sendDuty() {
    const retrieve = async () => {
      await axios.post("http://127.0.0.1:5000/sendDuty", {
        Id: state.data.responseData,
      });
      setSendValue(true);
      navigate("/Home");
    };
    retrieve();
  }
  const handleBackBtn = (event) => {
    console.log("back btn clicked");
    setBackBtnValue(true);
  };

  if (backBtnValue === true) {
    console.log("going back duties");
    return <Exam_Schedule />;
  }

  if (sendValue === true) {
    console.log("duty sent value state true===> ");
    return <Home />;
  }
  if (!localStorage.getItem("access_token")) {
    return <Login />; // Render the Login component if access token doesn't exist
  }
  return (
    <>
      <NavBar />
      <div className="SchedulePage">
        <br />
        <br />
        <Container fluid>
          <Row className="courseInfo">
            <Col lg="1"></Col>
            <Col lg="10">
              <div className="schHeading">SEND DUTY</div>
            </Col>
            <Col lg="1"></Col>
          </Row>{" "}
          <br />
          <br />
          <Row className="courseInfo">
            <Col lg="1"></Col>

            <Col lg="10">
              <div className="schHeading">DUTY DETAIL</div>
              <div>
                <h5>
                  <b>
                    <br />
                    DUTY ID : {state.data.responseData}
                    <br />
                    <br />
                    EXAMINER NAME: {duty[0]}
                    <br />
                    <br />
                    EMAIL : {duty[1]}
                    <br />
                    <br />
                    INSTITUTE : {duty[2]}
                    <br />
                    <br />
                    SEMESTER : {duty[3]}
                    <br />
                    <br />
                    COURSE : {duty[4]}
                  </b>
                </h5>
              </div>
              <br />
              <br />

              {/* <Form onSubmit={sendDuty}>
                <Container>
                  <Row>
                    <Col lg="12">
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>More Info</Form.Label>
                        <Form.Control
                          value={moreInfo}
                          name="moreInfo"
                          onChange={(e) => {
                            setMoreInfo(e.target.value);
                            console.log("more info is : ", moreInfo);
                          }}
                          as="textarea"
                          rows={3}
                        />
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
                    <Col lg="2">
                      <Button className="backBtn" onClick={handleBackBtn}>
                        Back
                      </Button>
                    </Col>
                    <Col lg="8"></Col>
                    <Col lg="2">
                      <Button
                        className="schButton"
                        type="Submit"
                        value="Submit"
                        onClick={sendDuty}
                      >
                        Send Request
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form> */}
              <Row>
                <Col lg="2">
                  <Button className="backBtn" onClick={handleBackBtn}>
                    Back
                  </Button>
                </Col>
                <Col lg="8"></Col>
                <Col lg="2">
                  <Button
                    className="schButton"
                    type="Submit"
                    value="Submit"
                    onClick={sendDuty}
                  >
                    Send Request
                  </Button>
                </Col>
              </Row>
              <br />
              <br />
            </Col>
            <Col lg="1"></Col>
          </Row>
          <br />
          <br />
        </Container>
      </div>
    </>
  );
};

export default SendExamDuty;
