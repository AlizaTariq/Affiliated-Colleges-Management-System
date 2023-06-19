import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/CourseCard.css";
import Login from "./Login";
import NavBar from "./NavBar";
export default function CourseCard() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [duty, setDuty] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const url = "http://127.0.0.1:5000/getDutyDetail";
    console.log(state.data.responseData);
    axios
      .post(url, { Id: state.data.responseData })
      .then((res) => {
        const resData = res.data;
        setDuty(resData);
      })
      .catch((err) => alert(err + "  OOPS! BAD REQUEST CC"));
  }, []);
  function sendDutyExaminer() {
    const retrieve = async () => {
      await axios.post("http://127.0.0.1:5000/sendDuty", {
        Id: state.data.responseData,
      });
    };
    navigate("/ShowDutiesEx");
    retrieve();
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      {/* <div className="container"> */}
      {console.log("duties ==> ", duty)}
      <div className="ntfPagehere">{duty.map((item) => console.log(item))}</div>
      <div className="showDutyDetailPrac">
        <div className="mainHeading">
          <h1>Duty Information</h1>
        </div>
        <div className="mainDiv">
          <div className="One">
            <div className="card mb-3">
              <div className="row g-0">
                <div>
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Duty Detail</b>
                    </h5>
                    <br />
                    <h5>
                      <b>Duty Id: </b>
                      {state.data.responseData}
                    </h5>
                    <h5>
                      <b>Course Name: </b>
                      {duty[4]}
                    </h5>
                    <h5>
                      <b>Semester: </b>
                      {duty[3]}
                    </h5>
                    <h5>
                      <b>Examiner: </b>
                      {duty[0]}
                    </h5>
                    <h5>
                      <b>email: </b>
                      {duty[1]}
                    </h5>
                    <h5>
                      <b>Institute: </b>
                      {duty[2]}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttonsDiv">
        <button
          className="back"
          style={{ borderRadius: "6px" }}
          onClick={sendDutyExaminer}
        >
          <b>Send</b>{" "}
        </button>
        <button
          className="back"
          style={{ borderRadius: "6px" }}
          onClick={() => {
            navigate("/ShowDutiesEx");
          }}
        >
          Back
        </button>
      </div>
      {/* </div> */}
    </>
  );
}
