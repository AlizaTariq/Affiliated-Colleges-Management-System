import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import username from "../images/profilepic-2.jpg";
import userpic from "../images/avatar.svg";
import "../css/showDutyDetail.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ShowDuties from "./ShowDuties";
import Login from "./Login";
import NavBar from "./NavBar";

const ShowDutyDetail = (props) => {
  const [duty, setDuty] = useState(props.data);
  const [backBtnValue, setBackBtnValue] = useState(false);
  const [teacherDetail, setTeacherDetail] = useState([]);
  const [teacherStatus, setTeacherStatus] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(
      "http://localhost:3000/getTeacherDetail?acId=" +
        duty[0] +
        "&dept=" +
        duty[2] +
        "&crsCode=" +
        duty[3]
    )
      .then((response) => response.json())
      .then((data) => {
        setTeacherDetail(data);
        if (data.success) {
          setTeacherStatus(true);
        }
      })
      .then((data1) => console.log("Specific duty list is ", teacherDetail));
  }, []);

  const handleBackBtn = (event) => {
    console.log("back btn clicked");
    setBackBtnValue(true);
  };

  if (backBtnValue === true) {
    console.log("going back show duties");
    return <ShowDuties />;
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      {console.log("duties ==> ", duty)}
      <div className="ntfPagehere">{duty.map((item) => console.log(item))}</div>
      <div className="showDutyDetailPrac">
        <div className="mainHeading">
          <h1>Duty Information</h1>
        </div>
        <div className="mainDiv">
          <div className="childOne">
            <div className="card mb-3" style={{ maxWidth: "540px" }}>
              <div className="row g-0">
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Duty Detail</b>
                    </h5>
                    <br />
                    <h5>
                      <b>College Name: </b>
                      {duty[1]}
                    </h5>
                    <h5>
                      <b>Department: </b>
                      {duty[2]}
                    </h5>
                    <h5>
                      <b>Course code: </b>
                      {duty[3]}
                    </h5>
                    <h5>
                      <b>Course Name: </b>
                      {duty[4]}
                    </h5>
                    <h5>
                      <b>Semester: </b>
                      {duty[5]}
                    </h5>
                    <h5>
                      <b>Total Batches: </b>
                      {duty[6]}
                    </h5>
                    <h5>
                      <b>Duty Status: </b>
                      {duty[7]}
                    </h5>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated 3 mins ago
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="childTwo">
            <div className="card mb-3" style={{ maxWidth: "540px" }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={userpic}
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Teacher Detail</b>
                    </h5>
                    <h5>
                      <b>Name:</b>{" "}
                      {teacherStatus && teacherDetail.examiner !== null
                        ? teacherDetail.examiner[1]
                        : "Not Assigned"}
                    </h5>
                    <h5>
                      <b>ID</b>:{" "}
                      {teacherStatus && teacherDetail.examiner !== null
                        ? teacherDetail.examiner[0]
                        : "Not Assigned"}
                    </h5>
                    <h5>
                      <b>Email:</b>{" "}
                      {teacherStatus && teacherDetail.examiner !== null
                        ? teacherDetail.examiner[2]
                        : "Not Assigned"}
                    </h5>
                    <h5>
                      <b>Institution:</b>{" "}
                      {teacherStatus && teacherDetail.examiner !== null
                        ? teacherDetail.examiner[3]
                        : "Not Assigned"}
                    </h5>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated 3 mins ago
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="backButton">
          <button id="backBtn" onClick={handleBackBtn}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ShowDutyDetail;
