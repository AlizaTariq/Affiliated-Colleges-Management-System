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
          <p>Profile</p>

          <div className="sub-main">
            <div className="back">
              <div className="imgs">
                <div className="container-image">
                  <img src={profile} alt="profile" className="profile" />
                </div>
                <br></br>
                <div>
                  <button type="submit" className="profilebtn" id="profilebtn">
                    Edit Profile Picture Profile
                  </button>
                </div>
              </div>
              <br></br>
              <div className="forming text-center mb-3">
                <form action="#" method="post">
                  <div className="block_container">
                    <div id="p1">
                      <label className="labelText">First Name </label>
                      <input
                        type="text"
                        className="textField"
                        id="fname"
                        name="fname"
                        placeholder="First Name"
                      />
                    </div>
                    <div id="p2">
                      <label className="labelText">Last Name </label>
                      <input
                        type="text"
                        className="textField"
                        id="lname"
                        name="lname"
                        placeholder="Last Name"
                      />
                    </div>
                    <div id="p3">
                      <label className="labelText">Username </label>
                      <input
                        type="text"
                        className="textField"
                        id="username"
                        name="username"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="block_container">
                    <div id="p1">
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
                    <div id="p2">
                      <label className="labelText">Password </label>
                      <input
                        type="text"
                        className="textField"
                        id="password"
                        name="password"
                        placeholder="password"
                      />
                    </div>
                    <div id="p3">
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
                  <div className="block_container">
                    <div id="p1">
                      <label className="labelText">CNIC </label>
                      <input
                        type="text"
                        className="textField"
                        id="cnic"
                        name="cnic"
                        placeholder="cnic"
                      />
                    </div>
                    <div id="p3">
                      <label className="labelText">Address </label>
                      <input
                        type="text"
                        className="textField"
                        id="address"
                        name="address"
                        placeholder="address"
                      />
                    </div>
                    <div id="p3">
                      <label className="labelText">Gender </label>
                      <select name="selectGender" id="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">other</option>
                      </select>
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
