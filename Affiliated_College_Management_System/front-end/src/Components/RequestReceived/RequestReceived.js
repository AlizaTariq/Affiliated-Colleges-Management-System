import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./requestReceived.css";

const RequestReceived = () => {
  const [getData, setData] = useState([]);
  const [selection, setSelection] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const handleAccept = () => {
    setSelection("accept");
    sendSelection("accept");
  };

  const handleReject = () => {
    setSelection("reject");
    sendSelection("reject");
  };

  const sendSelection = (selectedOption) => {
    axios
      .post(
        "http://127.0.0.1:5000/UpdateStatus",
        { selection: selectedOption },
        { headers }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetch("http://127.0.0.1:5000/DutyDetails")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);
  // if (!accessToken) {
  //   return navigate("/"); // Render the Login component if access token doesn't exist
  // }

  return (
    <>
      <Navbar></Navbar>
      <div className="My-body7">
        <div className="container">
          <div className="row RequestheaderRR">
            <div className="courseTitleRR col-9">
              CMP-100 Introduction to Computing
              <br></br>
              <div className="requestdateRR col-3">requested date</div>
            </div>
            <div className="deadlineRR col-3">deadline of paper upload</div>
          </div>
          <div className="row">
            <div className="requestBodyRR">
              <div className="bookRecomended">
                <label className="outlineTitleRR">Book recomended: </label>
                Nell Dale, John Lewis, Computer Science Illuminated, 5th
                Edition, Jones & Bartlett Learning, 2012, ISBN-10: 1449672841,
                ISBN-13: 978-1449672843.
              </div>
              <div className="CourseOutlineRR">
                <label className="outlineTitleRR">Outline:</label>
                Introduction to Information Technology, The Internet and World
                Wide Web, Software, Types of software, Application Software,
                Productivity Software, System Software, Digital Logic Design,
                Computer Organization, Operating System, Utility Programs,
                Hardware, Storage, Computer Networks, Software development,
                Command Line, Little Man Computer, Database Systems, Software
                Engineering Problem Solving, Algorithms, HTML.
              </div>
            </div>
          </div>
          <div className="row requestFooterRR">
            <button
              type="accept"
              className="col-4 AcceptBtn"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              type="accept"
              className="col-4 RejectBtn"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestReceived;
