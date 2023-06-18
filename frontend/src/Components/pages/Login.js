import React, { useState, useEffect } from "react";
import Home from "./Home";
import Notifications from "./Notifications";
import "../css/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/fontawesome-free";
import profilepic from "../images/avatar.svg";
import svgimg from "../images/sidepanel.png";
import accessDenied from "../images/access-denied.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import backgroundVideo from "../video/pixel.mp4";
import svgimgOne from "../images/admin.png";
import svgimgTwo from "../images/profile.png";
import svgimgThree from "../images/assign.png";
import svgimgFour from "../images/software-engineer.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [dutyStatus, setDutyStatus] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(true);
    }, 100);
  }, []);

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:5000/loginData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("access_token", data.access_token);
          console.log("Token---:", localStorage.getItem("access_token"));
          setLoggedIn(true);
        } else {
          setDutyStatus("Invalid Credentials!");
          setOpen(true);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  if (loggedIn) {
    console.log("Login state true ===> ", loggedIn);
    return <Home />;
  }

  const handleClose = () => {
    setOpen(false);
    setDutyStatus("");
  };

  return (
    <>
      <marquee id="marquees">
        <b>Welcome ! TO ADMIN PORTAL LOGIN CAREFULLY</b>
      </marquee>

      <div className="containerhere containers">
        {/* <video className="video-background" autoPlay muted loop>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className="login-content">
          <div className="childO  login-content">
            <form
              className="rounded-5 shadow-5-strong p-5 "
              style={{ border: "solid 2px white" }}
              onSubmit={handleSubmit}
            >
              <div className="forcenter">
                <img className="forcenter pic" src={profilepic} alt="avatar" />
              </div>

              {console.log("Login state false")}
              {console.log("Login status is: -->", loggedIn)}
              <div className="inputDiv">
                <div className="i">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: "white" }}>
                    Enter Email
                  </label>
                  <input
                    type="email"
                    placeholder="username"
                    value={username}
                    onChange={handleChange}
                    name="username"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="inputDiv">
                <div className="i">
                  <FontAwesomeIcon icon={faLock} />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: "white" }}>
                    Enter Password
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="forcenter">
                <button
                  type="submit"
                  className="my-2 myLoginBtn"
                  value="Submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="childT">
            {/* <img id="immg" src={svgimg}></img> */}
            <div style={{ display: "flex" }}>
              <div id="d1" style={{ flex: 1 }}>
                <img id="img1" src={svgimgOne}></img>{" "}
              </div>
              <div id="d2" style={{ flex: 1 }}>
                <img id="img2" src={svgimgTwo}></img>{" "}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div id="d3" style={{ flex: 1 }}>
                <img id="img3" src={svgimgThree}></img>{" "}
              </div>
              <div id="d4" style={{ flex: 1 }}>
                <img id="img4" src={svgimgFour}></img>{" "}
              </div>
            </div>
          </div>

          <Dialog open={open} className="custom-dialog" onClose={handleClose}>
            <div className="forcenterOne">
              <img className="forcenter pic" src={accessDenied} alt="avatar" />
            </div>
            <DialogTitle className="dialogTitle">
              <b>
                <center>Login Status</center>
              </b>
            </DialogTitle>
            <DialogContent>
              <center>{dutyStatus}</center>
            </DialogContent>
            <DialogActions className="custom-dialog-actions">
              <Button className="btnClose" onClick={handleClose}>
                <b>Close</b>
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}
