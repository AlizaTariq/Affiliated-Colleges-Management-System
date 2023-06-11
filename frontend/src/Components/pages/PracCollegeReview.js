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
import "../css/PracCollegeReview.css";
import Modal from "react-bootstrap/Modal";

const PracCollegeReview = (props) => {
  const [reviewList, setReviewList] = useState([]);
  const [values, setSearchValue] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [currentRow, setCurrentRow] = useState([]);

  const accessToken = localStorage.getItem("access_token");
  useEffect(() => {
    fetch("http://127.0.0.1:5000/getCollegeReview")
      .then((response) => response.json())
      .then((data) => {
        setReviewList(data);
      })
      .then((data1) => console.log("Review List data", reviewList));
  }, []);

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
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
          <h1>{currentRow[4]}</h1>
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
      {/* <div>Practical College Review</div> */}

      <div className="container">
        <div className="d-flex flex-row-reverse bd-highlight">
          <p className="form-inline">
            {/* onChange={event => setSearchValue(event.target.value)}  */}
            <input
              id="searching"
              className="form-control mr-sm-2 mt-"
              onChange={(event) => setSearchValue(event.target.value)}
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
                <td>College Review Id</td>
                <td>Examiner Id</td>
                <td>Examiner Name</td>
                <td>College Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {reviewList
                ? reviewList
                    .filter((item) => {
                      if (values === "") {
                        //if query is empty
                        return item;
                      } else if (
                        item[0].toString().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[1].toString().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[2].toLowerCase().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[3].toLowerCase().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[4].toLowerCase().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      }
                    })
                    .map((item) => (
                      <tr style={{ border: "1px" }} key={item[0]} id={item[0]}>
                        <td className="tableText">{item[0]}</td>
                        <td className="tableText">{item[1]}</td>
                        <td className="tableText">{item[2]}</td>
                        <td className="tableText">{item[3]}</td>

                        <td className="tableText">
                          <Button
                            variant="primary"
                            className="collegeReviewDetail"
                            onClick={() => {
                              setCurrentRow(item);
                              setModalShow(true);
                            }}
                          >
                            Show Complain
                          </Button>

                          <MyVerticallyCenteredModal
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
export default PracCollegeReview;
