import React from "react";

import "../css/Profile.css";

import profile from "../images/profilepic-2.jpg";
import Login from "./Login";
import NavBar from "./NavBar";

const Profile = () => {
  if (!localStorage.getItem("access_token")) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      <div className="main">
        <div className="heading">
          <h2 className="headinghere">Profile</h2>

          <div className="sub-main">
            <div className="secSubMain">
              <div className="imgs">
                <div className="container-image">
                  <img src={profile} alt="profile" className="profile" />
                </div>
                <br></br>
                <div>
                  <button type="submit" className="profilebtn" id="profilebtn">
                    Edit Profile Picture
                  </button>
                </div>
              </div>
              <br></br>
              <div className="forming text-center mb-3">
                <form action="#" method="post">
                  <div className="containerhere">
                    <div className="top-rowhere">
                      <div className="div1here">
                        <label className="labelText">First Name </label>
                        <input
                          type="text"
                          className="textField"
                          id="fname"
                          name="fname"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="div2here">
                        <label className="labelText">Last Name </label>
                        <input
                          type="text"
                          className="textField"
                          id="lname"
                          name="lname"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div className="middle-rowhere">
                      <div className="div3here">
                        <label className="labelText">Username </label>
                        <input
                          type="text"
                          className="textField"
                          id="username"
                          name="username"
                          placeholder="username"
                        />
                      </div>
                      <div className="div4here">
                        <label className="labelText">Email </label>
                        <input
                          type="text"
                          className="textField"
                          id="email"
                          name="email"
                          placeholder="Email"
                          email
                        />
                      </div>
                    </div>
                    <div className="bottom-rowhere">
                      <div className="div5here">
                        <label className="labelText">Password </label>
                        <input
                          type="text"
                          className="textField"
                          id="password"
                          name="password"
                          placeholder="password"
                        />
                      </div>
                      <div className="div6here">
                        <label className="labelText">Contact no. </label>
                        <input
                          type="text"
                          className="textField"
                          id="contactNum"
                          name="contactNum"
                          placeholder="contactNum"
                        />
                      </div>
                    </div>
                  </div>

                  <br></br>
                  <div className="textArea">
                    <label className="labelText">Bio{"  "}</label>
                    <br />
                    <textarea
                      id="textArea"
                      name="textArea"
                      placeholder="Enter text here..."
                    ></textarea>
                  </div>
                  <div className="containerhere">
                    <div className="last-rowhere">
                      <div className="div7here">
                        <label className="labelText">CNIC </label>
                        <input
                          type="text"
                          className="textField"
                          id="cnic"
                          name="cnic"
                          placeholder="cnic"
                        />
                      </div>
                      <div className="div8here">
                        <label className="labelText">Address </label>
                        <input
                          type="text"
                          className="textField"
                          id="address"
                          name="address"
                          placeholder="address"
                        />
                      </div>
                      <div className="div9here">
                        <label className="labelText">Gender </label>
                        <select name="selectGender" id="gender">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <div>
                    <button type="submit" className="submitbtn" id="submitbtn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
