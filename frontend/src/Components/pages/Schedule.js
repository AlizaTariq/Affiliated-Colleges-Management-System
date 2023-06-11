import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import username from "../images/profilepic-2.jpg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/scheduler.css";
import { useState, useEffect } from "react";
import SendDuty from "./SendDuty";
import axios from "axios";
import Login from "./Login";
import NavBar from "./NavBar";
const Schedule = () => {
  const [listd1, setListd1] = useState([]);
  const [ClgDropdownValue, setClgDropdownValue] = useState("");
  const [deptValue, setDeptValue] = useState("");
  const [courseValue, setCourseValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const [ClgCrsData, setClgCrsData] = useState([]);
  const [CrsDropdownValue, setCrsDropdownValue] = useState([]);
  const [CrsNameValue, setCrsNameValue] = useState("");
  const [submitValue, setSubmitValue] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getAllCollegeList")
      .then((response) => response.json())
      .then((data) => {
        setListd1(data);
        //********************************************
        setClgDropdownValue(data[0][0]);
        console.log("data 0 is : ", data[0][0], "list", data);
        setDeptValue("cs");
      })
      .then((data1) => console.log("college list is ", listd1));
  }, []);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:5000/updateCrs?clgname=" +
        ClgDropdownValue.toString() +
        "&dept=" +
        deptValue.toString()
    )
      .then((response) => response.json())
      .then((data) => {
        setCrsDropdownValue(data);
        setCourseValue(data[0]);

        if (data == null || data.length == 0) {
          console.log("True true");
          setDisableBtn(true);
          setTextValue("No Duties to Assign!!");
        } else {
          setDisableBtn(false);
          setTextValue("");
        }
      })
      .then((data1) =>
        console.log("ClgDropdownValue list is ", ClgDropdownValue)
      );
  }, []);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:5000/updateCrs?clgname=" +
        ClgDropdownValue.toString() +
        "&dept=" +
        deptValue.toString()
    )
      .then((response) => response.json())
      .then((data) => {
        setCrsDropdownValue(data);
        setCourseValue(data[0]);
        console.log("data on chnage college ", data);
        if (data == null || data.length == 0) {
          console.log("True true");
          setDisableBtn(true);
          setTextValue("No Duties to Assign!!");
        } else {
          setDisableBtn(false);
          setTextValue("");
        }
      })
      .then((data1) =>
        console.log("ClgDropdownValue list is ", ClgDropdownValue)
      );
  }, [ClgDropdownValue, deptValue]);

  const handleSubmitInfo = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:5000/getCrsInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ClgDropdownValue: ClgDropdownValue,
        deptValue: deptValue,
        courseValue: courseValue,
      }),
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.success) {
          setSubmitValue(true);
          setClgCrsData(data1.data);
        }
      })
      .then((data1) => console.log(data1));
  };
  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  if (submitValue == true) {
    console.log("submit valu state true===> ", ClgCrsData);
    return <SendDuty ClgCrsData={ClgCrsData} />;
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
              <div className="schHeading">SEND REQUEST</div>
            </Col>
            <Col lg="1"></Col>
          </Row>{" "}
          <br />
          <br />
          <Row className="courseInfo">
            <Col lg="1"></Col>

            <Col lg="10">
              <h3>{textValue}</h3>
              <div className="schHeading">ADD COURSE INFORMATION</div>
              <br />
              <br />

              <Form onSubmit={handleSubmitInfo}>
                {/* ROW 1 */}
                <Container>
                  <Row>
                    <Col lg="6">
                      <Form.Group className="mb-3" controlId="formBasicCkgName">
                        <Form.Label>College Name</Form.Label>
                        <Form.Select
                          value={ClgDropdownValue}
                          name="ClgDropdownValue"
                          onChange={(e) => setClgDropdownValue(e.target.value)}
                        >
                          {listd1.map((num, index) => {
                            return (
                              <option key={index} value={num}>
                                {num}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        inline
                      >
                        <Form.Label>Department</Form.Label>

                        <Form.Select
                          aria-label="Default select example"
                          value={deptValue}
                          name="deptValue"
                          onChange={(e) => setDeptValue(e.target.value)}
                        >
                          <option value="cs">CS</option>
                          <option value="it">IT</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {CrsDropdownValue.length > 0 ? (
                    <Row>
                      <Col lg="9">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCourseCode"
                          inline
                        >
                          <Form.Label>Course Code</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={courseValue}
                            name="CrsDropdownValue"
                            onChange={(e) => setCourseValue(e.target.value)}
                          >
                            {CrsDropdownValue.map((course, index) => {
                              return (
                                <option key={index} value={course}>
                                  {course}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  ) : null}

                  <Row>
                    <Col lg="10"></Col>
                    <Col lg="2">
                      <Button
                        className="schButton"
                        type="Submit"
                        value="Submit"
                        disabled={disableBtn}
                      >
                        NEXT
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

export default Schedule;
