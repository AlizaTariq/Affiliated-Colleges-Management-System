import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

import Avatar from "./avatar";
import ExperienceDetails from "./experience-details";
import QualificationDetails from "./qualification-details";
import UserDetails from "./user-details";

import axios from 'axios';
import QuaTable from './Qua_table';
import ExpTable from "./Exp_table";
import { useNavigate } from 'react-router-dom';


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
      const response = await axios.get('http://127.0.0.1:5001/profile', { headers: headers });
      setUserDetails(response.data)
    } catch (error) {
      console.error(error);
      setError("Error loading data");
    }
  };
  var abc = "123";
  const getQualifications = async () => {
    // let abc=[];
    QualificationsList = ["abc"]
    setQualificationsList(["abc"]);

    try {
      const response = await axios.get('http://127.0.0.1:5001/NewQualifications', { headers: headers });
      setQualificationsList(response.data);
    } catch (error) {
    }
  };
  const getExperience = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5001/NewExperience', { headers: headers });
      setExperienceList(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getExperience();
    getQualifications();
    getUserDetails();
    // if (!accessToken) {
    //   return navigate("/");
    // }
  }, []);

  // if (!accessToken) {
  //   return navigate("/"); // Render the Login component if access token doesn't exist
  // }

  return (
    <>
      <Navbar />
      <div className="profile_container py-5" style={{ margin: "auto" }}>

        <div className="row">
          <div className="col-3 mt-5">

            <Avatar
              src={userDetails?.personal_details?.usr_profile_pic}
              name={userDetails?.personal_details?.usr_name}
            />
          </div>
          <div className="col-6 " style={{ color: "black" }}>
            <h2 className="mb-4 mt-4 mt-md-0">User Details</h2>
            <div className="card mb-4">

              <UserDetails data={userDetails?.personal_details} />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4">Qualification Details</h2>
              <div className="card">
                <table className='TableStyle' border="1">
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

                        <td >
                          <a href="/assets/Resumes/31.pdf" target='_blank'>click here</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12">
              <h2 className="mb-4 mt-4 mt-md-0">Experience Details</h2>
              <div className="card">
                <table className='TableStyle' border="1">
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
                        <td >
                          <a href="/assets/Resumes/31.pdf" target='_blank'>click here</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;