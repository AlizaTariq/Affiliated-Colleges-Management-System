import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './settings.css';
import '../ExaminerInterest/ExaminerInterest.css';

function Settings() {
  const [usr_name, setUserName] = useState('');
  const [usr_cnic, setCNIC] = useState('');
  const [usr_email, setEmail] = useState('');
  const [usr_address, setAddress] = useState('');
  const [usr_bio, setBio] = useState('');
  const [usr_gender, setGender] = useState('');
  const [usr_active_status, setStatus] = useState('');
  const resumeFile = useRef(null);
  const ProfilePic = useRef(null);
  const [usr_phone, setPhone] = useState('');
  const [errorP, setErrorP] = useState('');

  const [dataList, setDataList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [errorI, setErrorI] = useState('');
  const [textInput, setTextInput] = useState('');
  const [userDetails, setUserDetails] = useState({});

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('access_token');
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };
  const handleEditPersonal = async (e) => {
    const formData = new FormData();
    formData.append('resume', resumeFile.current.files[0]);
    formData.append('profile', ProfilePic.current.files[0]);
    formData.append('usr_name', usr_name);
    formData.append('usr_cnic', usr_cnic);
    formData.append('usr_email', usr_email);
    formData.append('usr_address', usr_address);
    formData.append('usr_bio', usr_bio);
    formData.append('usr_gender', usr_gender);
    formData.append('usr_phone', usr_phone);
    formData.append('usr_active_status', usr_active_status);
    console.log(formData['resume']);
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/UpdateExaminer', formData , { headers: headers });
        setErrorP(response.data["message"]);
    } catch (error) {
      console.error("error: ", error);
    }
  };
  
  useEffect(() => {
    console.log("use effect")
    getData();
    fetchCourses();
    if (!accessToken) {
      return navigate("/");
    }
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/profile', { headers: headers });
      setUserDetails(res.data)
      setUserName(res.data["personal_details"]["usr_name"])
      setCNIC(res.data["personal_details"]["usr_cnic"])
      setEmail(res.data["personal_details"]["usr_email"])
      setPhone(res.data["personal_details"]["usr_phoneno"])
      setAddress(res.data["personal_details"]["usr_address"])
      setGender(res.data["personal_details"]["usr_gender"])
      setStatus(res.data["personal_details"]["usr_active_status"])
      setBio(res.data["personal_details"]["usr_bio"])
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/AllCourses', { headers: headers });
      setDataList(response.data);
    } catch (error) {

    }
  };
  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setTextInput((prevText) => prevText + ", " + selectedOption);
  };
  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };
  const handleSubmitInterest = async (event) => {
    event.preventDefault();
    console.log(textInput)
    try {
      const response = await axios.post('http://127.0.0.1:5000/UpdateExaminerCourse', { data: textInput }, { headers: headers });
      setErrorI(response.data["message"]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="settings_body">
        <h1>Settings</h1>
        <h2>Personal Information</h2>
        <div className="PersonalForm">
          <form onSubmit={handleEditPersonal}>
            <div className="PersonalEditForm">
              <span className="label_">User Name: </span>
              <input type="text" className="PersonalEditInput" placeholder='Enter User Name' name='name_' value={usr_name} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Email Address: </span>
              <input type="email" className="PersonalEditInput" placeholder='Enter Email Address' name='email' value={usr_email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">CNIC: </span>
              <input type="text" className="PersonalEditInput" placeholder='Enter CNIC (00000-0000000-0)' name='cnic' value={usr_cnic} onChange={(e) => setCNIC(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Phone Number: </span>
              <input type="text" className="PersonalEditInput" placeholder='Enter Phone Number (+92 0000000000)' name='phone' value={usr_phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Address: </span>
              <input type="text" className="PersonalEditInput" placeholder='Enter Address' name='address' value={usr_address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Gender: </span>
              <select className="form-label designLable" name="gender" value={usr_gender} onChange={(e) => setGender(e.target.value)}  >
                <option value="Select">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not prefer to say">Not prefer to say</option>
              </select>
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Active Status: </span>
              <select className="form-label designLable" name="status" value={usr_active_status} onChange={(e) => setStatus(e.target.value)}  >
                <option value="Select">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Bio: </span>
              <input type="text" className="PersonalEditInput" placeholder='Enter Bio' name='bio' value={usr_bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Resume: </span>
              <input type="file" name="resume" className="form-control" ref={resumeFile} />
            </div>
            <div className="PersonalEditForm">
              <span className="label_">Profile Pic: </span>
              <input type="file" name="pfp" className="form-control" ref={ProfilePic} />
            </div>
            <div style={{ textAlign: "right" }}>
              <button type="submit" className="PersonalEditSubmitt" >Update data</button>
            </div>
            <div>
              {errorP && <div className='update_msj'>{errorP}</div>}
            </div>
          </form>
        </div>
        <h2>Interests</h2>
        <div className="PersonalForm">
          <div className='option_'>
            <form onSubmit={handleSubmitInterest}>
              <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select an option</option>
                {dataList.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </select>
              <br />
              <input className='input-box' type="text" value={textInput} onChange={handleTextChange} readOnly />
              <br />
              <div style={{ textAlign: "right" }}>
                <button type="submit" className="PersonalEditSubmitt" >Update Courses</button>
              </div>
              <div>
                {errorI && <div className='update_msj'>{errorI}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}

export default Settings;