import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import username from "../images/profilepic-2.jpg";
import Home from "./Home";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/scheduler.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import Schedule from "./Schedule";
import NavBar from "./NavBar";
import { useNavigate, createSearchParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import profile from "../images/profilepic-2.jpg";

const SendDuty = (props) => {
  const [teacherName, setTeacherName] = useState(
    props.ClgCrsData.examiners[0][1]
  );
  const [teacherRank, setTeacherRank] = useState(
    props.ClgCrsData.examiners[0][4]
  );

  const [teacherEmail, setTeacherEmail] = useState(
    props.ClgCrsData.examiners[0][2]
  );

  const [moreInfo, setMoreInfo] = useState("");

  const [sendValue, setSendValue] = useState(false);
  const [backBtnValue, setBackBtnValue] = useState(false);
  const [selectedExaminer, setSelectedExaminer] = useState(
    props.ClgCrsData.examiners[0][2]
  );
  const [profileData, setProfileData] = useState([]);
  const [lgShow, setLgShow] = useState(false);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const handleTeacherNameChange = (event) => {
    const selectedName = event.target.value;
    setTeacherName(selectedName);
    const selectedRow = props.ClgCrsData.examiners.find(
      (teacher) => teacher[1] === selectedName
    );
    setTeacherRank(selectedRow[4]);
    setTeacherEmail(selectedRow[2]);
    setSelectedExaminer(selectedRow[2]);
  };

  const handleTeacherRankChange = (event) => {
    console.log("Teacher rank changed");
    const selectedRank = event.target.value;
    setTeacherRank(selectedRank);
    console.log("Here123", selectedRank);

    const selectedRow = props.ClgCrsData.examiners.find(
      (teacher) => teacher[4] === parseInt(selectedRank)
    );

    console.log("selected name is :", selectedRow, selectedRank);
    setTeacherName(selectedRow[1]);
    setTeacherEmail(selectedRow[2]);
    setSelectedExaminer(selectedRow[2]);
  };

  const handleTeacherEmailChange = (event) => {
    const selectedEmail = event.target.value;
    setTeacherEmail(selectedEmail);
    const selectedRow = props.ClgCrsData.examiners.find(
      (teacher) => teacher[2] === selectedEmail
    );
    console.log("selected name is :", selectedRow, selectedEmail);
    setTeacherName(selectedRow[1]);
    setTeacherRank(selectedRow[4]);
    setSelectedExaminer(selectedEmail);
  };

  const handleSendPracticalDuty = (event) => {
    event.preventDefault();
    console.log("In hanle send pract duty");
    fetch("http://127.0.0.1:5000/sendPracticalDuty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examiner: props.ClgCrsData.examiners.find(
          (teacher) => teacher[2] === teacherEmail
        ),
        college: props.ClgCrsData.ClgDropdownValue,
        deptValue: props.ClgCrsData.deptValue,
        courseValue: props.ClgCrsData.courseValue,
        moreInfo: moreInfo,
      }),
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.success) {
          setSendValue(true);
          console.log("success", data1);
        }
      })
      .then((data1) => console.log("practical sending data ", data1));
  };

  const handleExaminerProfile = () => {
    fetch("http://127.0.0.1:5000/getProfileInfoExm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: selectedExaminer,
      }),
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.success) {
          setProfileData(data1.data);
          console.log("success", data1.data);
          console.log("practical examiner data ", data1.data); // Move the console.log here
        }
      });
  };

  const handleClose = () => {
    setLgShow(false);
  };

  const handleBackBtn = (event) => {
    console.log("back btn clicked");
    setBackBtnValue(true);
  };
  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  if (backBtnValue === true) {
    console.log("going back duties");
    return <Schedule />;
  }

  if (sendValue === true) {
    console.log("practical send value state true===> ");
    return <Home />;
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
              <div className="schHeading">Send Duty</div>
            </Col>
            <Col lg="1"></Col>
          </Row>{" "}
          <br />
          <br />
          <Row className="courseInfo">
            <Col lg="1"></Col>

            <Col lg="10">
              <div className="schHeading">Course College Detail</div>
              <div>
                <h5>
                  <b>
                    <br />
                    College : {props.ClgCrsData.ClgDropdownValue}
                    <br />
                    <br />
                    Department : {props.ClgCrsData.deptValue}
                    {props.dept}
                    <br />
                    <br />
                    Course : {props.ClgCrsData.courseValue}
                  </b>
                </h5>
              </div>
              <br />
              <br />

              <Form onSubmit={handleSendPracticalDuty}>
                {/* ROW 1 */}
                <Container>
                  <br />
                  <br />
                  <div className="schHeading">Add Teacher Information</div>
                  <br />
                  <br />

                  <Row>
                    <Col lg="8">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={teacherName}
                          name="teacherName"
                          onChange={handleTeacherNameChange}
                        >
                          {props.ClgCrsData.examiners.map((item, index) => {
                            return (
                              <option key={index} value={item[1]}>
                                {item[1]}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="mb-3" controlId="formBasicEmail2">
                        <Form.Label>Rank</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={teacherRank}
                          name="teacherRank"
                          onChange={handleTeacherRankChange}
                        >
                          {props.ClgCrsData.examiners.map((item, index) => {
                            return (
                              <option key={index} value={item[4]}>
                                {item[4]}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="6">
                      <Form.Group className="mb-3" controlId="formBasicEmail3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={teacherEmail}
                          name="teacherEmail"
                          onChange={handleTeacherEmailChange}
                        >
                          {props.ClgCrsData.examiners.map((item, index) => {
                            return (
                              <option key={index} value={item[2]}>
                                {item[2]}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <br />
                      <Button
                        className="schButton"
                        onClick={() => {
                          handleExaminerProfile();
                          setLgShow(true);
                        }}
                      >
                        View Profile
                      </Button>{" "}
                      <Modal
                        size="lg"
                        onHide={handleClose} // Add onHide prop to handle close action
                        show={lgShow}
                        aria-labelledby="example-modal-sizes-title-lg"
                      >
                        <Modal.Header
                          style={{ backgroundColor: "#01263a", color: "#fff" }}
                          closeButton
                          className="custom-header"
                        >
                          <Modal.Title
                            className="modalHeader"
                            style={{
                              backgroundColor: "#01263a",
                              color: "#fff",
                            }}
                            id="example-modal-sizes-title-lg"
                          >
                            <center>
                              <b className="PrfHead">Profile</b>
                            </center>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                          style={{ backgroundColor: "#01263a", color: "#fff" }}
                        >
                          {profileData && profileData[0] && (
                            <>
                              <div className="profileimgDiv">
                                <img
                                  src={profile}
                                  alt="profile"
                                  className="profile"
                                />
                              </div>
                              <div className="parentone">
                                <div className="child">
                                  <h6>
                                    <b className="PrfHead">Name: </b>
                                    {profileData[0][2]}
                                  </h6>
                                  {/* <p className="ptexthere">{profileData[0][2]}</p> */}
                                </div>
                                <div className="child">
                                  <h6>
                                    <b className="PrfHead">CNIC: </b>
                                    {profileData[0][3]}
                                  </h6>
                                  {/* <p className="ptexthere">{profileData[0][3]}</p> */}
                                </div>
                              </div>
                              <div className="scrollable-content">
                                <h6>
                                  <b className="PrfHead">Email: </b>
                                  {profileData[0][4]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][4]}</p> */}
                                <h6>
                                  <b className="PrfHead">Address: </b>
                                  {profileData[0][5]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][5]}</p> */}
                                <h6>
                                  <b className="PrfHead">Bio: </b>
                                  {profileData[0][6]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][6]}</p> */}
                                <h6>
                                  <b className="PrfHead">Gender: </b>
                                  {profileData[0][7]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][7]}</p> */}
                                <h6>
                                  <b className="PrfHead">Institute: </b>
                                  {profileData[0][10]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][10]}</p> */}
                                <h6>
                                  <b className="PrfHead">Ranking: </b>
                                  {profileData[0][11]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][11]}</p> */}
                                <h6>
                                  <b className="PrfHead">Resume: </b>
                                  {profileData[0][12]}
                                </h6>
                                {/* <p className="ptexthere">{profileData[0][12]}</p> */}
                                <div className="Parent">
                                  <div className="child1">
                                    <h6>
                                      <b>Acceptance Count: </b>
                                    </h6>
                                    <p className="ptexthere">
                                      {profileData[0][13]}
                                    </p>
                                  </div>
                                  <div className="child2">
                                    <h6>
                                      <b>Rejection Count: </b>
                                    </h6>
                                    <p className="ptexthere">
                                      {profileData[0][14]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </Modal.Body>
                      </Modal>
                    </Col>
                  </Row>

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
                        <center>
                          <h5>Also Notify Through Email</h5>
                        </center>
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
                      >
                        Send Request
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>

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

export default SendDuty;
