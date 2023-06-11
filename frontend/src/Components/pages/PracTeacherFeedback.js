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
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import Schedule from "./Schedule";
import NavBar from "./NavBar";
import "../css/PracTeacherFeedback.css";
import Modal from "react-bootstrap/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const PracTeacherFeedback = (props) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [valuesfb, setSearchValuefb] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [currentRowFd, setCurrentRowFd] = useState([]);

  const accessToken = localStorage.getItem("access_token");
  useEffect(() => {
    fetch("http://127.0.0.1:5000/getTeacherFeedback")
      .then((response) => response.json())
      .then((data) => {
        setFeedbackList(data);
      })
      .then((data1) => console.log("Feedback List data : ", feedbackList));
  }, []);

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  const generateStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          style={{ color: "yellow" }} // Apply yellow color to the star icon
        />
      );
    }
    return stars;
  };

  function MyVerticallyCenteredModalFeedback(props) {
    return (
      <Modal
        class="bodyModal"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <b>Complain</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>{currentRowFd[6]}</h1>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btnModalClose" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <NavBar />
      {/* <div>Practical Teacher Feedback</div> */}

      <div className="container">
        <div className="d-flex flex-row-reverse bd-highlight">
          <p className="form-inline">
            {/* onChange={event => setSearchValue(event.target.value)}  */}
            <input
              id="searchingfeedback"
              className="form-control mr-sm-2 mt-"
              onChange={(event) => setSearchValuefb(event.target.value)}
              type="search"
              placeholder="Search"
            />
          </p>
        </div>

        <div className="d-flex flex-row bd-highlight">
          <p className="form-inline"></p>
        </div>

        <div>
          <table className="table">
            <thead>
              <tr className="headingTable">
                <td>Id</td>
                <td>Duty Id</td>
                <td>ED System</td>
                <td>Appartus</td>
                <td>Teacher attitude</td>
                <td>Rating</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {feedbackList
                ? feedbackList
                    .filter((item) => {
                      if (valuesfb === "") {
                        //if query is empty
                        return item;
                      } else if (item[0].toString().includes(valuesfb)) {
                        //returns filtered array
                        return item;
                      } else if (item[1].toString().includes(valuesfb)) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[2].toLowerCase().includes(valuesfb.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (item[3].toString().includes(valuesfb)) {
                        //returns filtered array
                        return item;
                      } else if (item[4].toString().includes(valuesfb)) {
                        //returns filtered array
                        return item;
                      } else if (item[5].toString().includes(valuesfb)) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[6].toLowerCase().includes(valuesfb.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      }
                    })
                    .map((item) => (
                      <tr style={{ border: "1px" }} key={item[0]} id={item[0]}>
                        <td className="tableTexthere">{item[0]}</td>
                        <td className="tableTexthere">{item[1]}</td>
                        <td className="tableTexthere">{item[2]}</td>
                        <td className="tableTexthere">{item[3]}</td>
                        <td className="tableTexthere">{item[4]}</td>
                        {/* <td className="tableText">{item[5]}</td> */}
                        <td className="tableTextStars">
                          {generateStarRating(item[5])}
                        </td>

                        <td className="tableTexthere">
                          <Button
                            variant="primary"
                            className="collegeReviewDetail"
                            onClick={() => {
                              setCurrentRowFd(item);
                              setModalShow(true);
                            }}
                          >
                            Show Complain
                          </Button>

                          <MyVerticallyCenteredModalFeedback
                            className="bodyModal"
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                          />
                        </td>
                      </tr>
                    ))
                : "Loading..."}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default PracTeacherFeedback;
