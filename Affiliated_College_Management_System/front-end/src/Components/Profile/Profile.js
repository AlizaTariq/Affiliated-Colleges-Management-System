import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Avatar from "./avatar";
import ExperienceDetails from "./experience-details";
import QualificationDetails from "./qualification-details";
import UserDetails from "./user-details";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import QuaTable from "./Qua_table";
import ExpTable from "./Exp_table";
import "./profile.css"

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [QualificationsList, setQualificationsList] = useState([]);
  const [ExperienceList, setExperienceList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token');
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  const getUserDetails = async () => {
    try {
      console.log("in try");
      const response = await axios.get('http://127.0.0.1:5000/profile', { headers: headers });
      setUserDetails(response.data)
    } catch (error) {
      // document.getElementById("msj").textContent = error;
      console.error(error);
      setError("Error loading data");
    }
  };
  const getQualifications = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/NewQualifications', { headers: headers });
      setQualificationsList(response.data);
    } catch (error) {
    }
  };
  const getExperience = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/NewExperience', { headers: headers });
      setExperienceList(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getExperience();
    getQualifications();
    getUserDetails();
    if (!accessToken) {
      return navigate("/");
    }
  }, []);

  return (
    < >
      <Navbar></Navbar>
      <div className="container py-5 profile_container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <Avatar
              src={userDetails?.personal_details?.usr_profile_pic}
              name={userDetails?.personal_details?.usr_name}
            />
          </div>
          <div className="col-lg-9 col-md-6" style={{ color: "black" }}>
            <h2 className="mb-4 mt-4 mt-md-0">User Details</h2>
            <div className="card mb-4">
              <UserDetails data={userDetails?.personal_details} />
            </div>
            <div className="row">
              <div className="col-12">
                <h2 className="mb-4">Qualification Details</h2>
                <div className="card">
                  <table className='TableStyleEQ' border="1">
                    <thead>
                      <tr>
                        <th>Sr #</th>
                        <th>Degree Title</th>
                        <th>Institute Name</th>
                        <th>Starting Date</th>
                        <th>Ending Date</th>
                        <th>Trancript</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QualificationsList.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item[2]}</td>
                          <td>{item[3]}</td>
                          <td>{item[4]}</td>
                          <td>{item[5]}</td>
                          <td>{item[6]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-12">
                <h2 className="mb-4 mt-4 mt-md-0">Experience Details</h2>
                <div className="card">
                  <table className='TableStyleEQ' border="1">
                    <thead>
                      <tr>
                        <th>Sr #</th>
                        <th>Job Title</th>
                        <th>Organization Name</th>
                        <th>Reference Email</th>
                        <th>Starting Date</th>
                        <th>Ending Date</th>
                        <th>Experiance Letter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ExperienceList.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item[2]}</td>
                          <td>{item[3]}</td>
                          <td>{item[4]}</td>
                          <td>{item[5]}</td>
                          <td>{item[6]}</td>
                          <td>{item[7]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

{
  /* <QualificationDetails
                    data={userDetails?.qualification_details}
  />*/
}
