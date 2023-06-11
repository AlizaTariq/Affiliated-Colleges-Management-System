import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import username from "../images/profilepictures/profilepic-3.jpg";
import "../css/showNtf.css";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Login from "./Login";
import NavBar from "./NavBar";

const Notifications = () => {
  const [ntfValue, setNtfValue] = useState("");
  const [ntfList, setNtfList] = useState([]);
  const [ntfCloseStatus, setNtfCloseStatus] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  var dutyStaus = "";
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getAdminNtfList")
      .then((response) => response.json())
      .then((data) => setNtfList(data))
      .then((data1) => console.log("notification list ::", ntfList));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getAdminNtfList")
      .then((response) => response.json())
      .then((data) => setNtfList(data))
      .then((data1) => console.log("notification list ::", ntfList));
  }, [ntfList]);

  const handleAdminNtf = (event, pracId) => {
    event.preventDefault();

    console.log(
      "In hanle send notification sendinf delete",
      event.target.value,
      " parctical id = ",
      pracId
    );

    fetch("http://127.0.0.1:5000/updateAdminNtf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        practId: pracId,
      }),
    })
      .then((response) => response.json())
      .then((data1) => {
        if (data1.success) {
          setNtfCloseStatus(true);
          var idx = ntfList.findIndex((ntf) => ntf[1] === pracId);
          console.log("success  ntofication", data1, "---");
          console.log("indx s : ", idx);
          if (idx >= 0) {
            ntfList.splice(idx, 1);
            setNtfList(ntfList);
          }
          console.log("after  ntofication", data1, "---");
        }
      })
      .then((data1) => console.log("notification data is  ", data1));
  };

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }
  return (
    <>
      <NavBar />
      {ntfList ? (
        <div className="ntfPage">
          {console.log("list -->> ")}
          {console.log(ntfList)}
          {ntfList.map((item) => (
            <Form onSubmit={(event) => handleAdminNtf(event, item[1])}>
              <Container className="ntfContainer m=10 p-10" fluid>
                <br />
                <br />
                <Row className="notificationsPr">
                  <Col sm="3"></Col>

                  <Col sm="6" className="ntfCard">
                    <Card className="ntfCardPractical">
                      <Container className="ntfCardPr">
                        <Row className="mycard">
                          <Col sm="3">
                            {console.log(
                              "../images/profilepictures/" + item[7]
                            )}
                            <Card.Img
                              variant="top"
                              src={username}
                              className="ntfImg"
                            />
                          </Col>
                          <Col sm="9">
                            <Card.Header className="ntfHeading">
                              Admin Notification
                            </Card.Header>
                            <Card.Body>
                              <Card.Title className="ntfHeading">
                                Practical Teacher Name: {item[6]}
                              </Card.Title>
                              <Card.Text id="ntfText">
                                {item[6]} has{" "}
                                <b>
                                  {item[2] == 2 ? "ACCEPTED " : "REJECTED "}
                                </b>
                                your Practical Assignmnet having Practical{" "}
                                {item[1]}
                                of Course Code {item[5]}.
                              </Card.Text>
                              <Card.Text>{item[3]}</Card.Text>
                              {"     "}
                              <Button
                                className="ntfButton"
                                type="Submit"
                                value="Submit"
                              >
                                Close Notification
                              </Button>
                              {"     "}
                            </Card.Body>
                          </Col>
                        </Row>
                      </Container>
                    </Card>
                  </Col>

                  <Col sm="3"></Col>
                </Row>
              </Container>
            </Form>
          ))}

          {/* {itemList} */}
        </div>
      ) : (
        <center>
          <h1 id="emptyNtf">No Notifications!</h1>
        </center>
      )}
    </>
  );
};

export default Notifications;
