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
  const [QualList, setQualList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [errorI, setErrorI] = useState('');
  const [textInput, setTextInput] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [ExpList, setExpList] = useState([]);

  const [degree_title, setDegreeTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [starting_dateQ, setStartingDateQ] = useState('');
  const [ending_dateQ, setEndingDateQ] = useState('');
  const Transcript = useRef(null);

  const [job_title, set_job_title] = useState('');
  const [organization, set_organization] = useState('');
  const [reference_email, set_reference_email] = useState('');
  const [starting_date, set_starting_date] = useState('');
  const [ending_date, set_ending_date] = useState('');
  const Experience = useRef(null);

  const [error, setError] = useState('');
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
      const response = await axios.post('http://127.0.0.1:5001/UpdateExaminer', formData, { headers: headers });
      setErrorP(response.data["message"]);
    } catch (error) {
      console.error("error: ", error);
    }
  };
  const handleExaminerQualification = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('degree_title', degree_title);
    formData.append('institution', institution);
    formData.append('starting_date', starting_dateQ);
    formData.append('ending_date', ending_dateQ);
    formData.append('transcript', Transcript.current.files[0]);
    try {
      const response = await axios.post('http://127.0.0.1:5001/ExaminerQualification', formData, { headers: headers });
      if (response.data["status"] === "fail") {
        setError(response.data["message"]);
      } else {
        window.location.href = '/Settings';
      }
    } catch (error) {
    }
  };
  const handleExaminerExper = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('job_title', job_title);
    formData.append('organization', organization);
    formData.append('reference_email', reference_email);
    formData.append('starting_date', starting_date);
    formData.append('ending_date', ending_date);
    formData.append('ExperianceLetter', Experience.current.files[0]);
    try {
        const response = await axios.post('http://127.0.0.1:5001/ExaminerExperience', formData, { headers: headers });
        if (response.data["status"] === "fail") {
            setError(response.data["message"]);
        } else {
            window.location.href = '/Settings';
        }
        // Redirect the user to the protected route
    } catch (error) {
        console.error("error: ", error);
    }
};
  useEffect(() => {
    console.log("use effect")
    getData();
    fetchCourses();
    fetchQualificatoins();
    fetchExperience();
    if (!accessToken) {
      return navigate("/");
    }
    const modalQ = document.getElementById("AddNewQualification");
    const btnQ = document.getElementById("newQua");
    const spanQ = document.getElementsByClassName("closeQ")[0];
    btnQ.onclick = function () {
      modalQ.style.display = "block";
    }
    spanQ.onclick = function () {
      modalQ.style.display = "none";
    }
    window.onclick = function (event) {
      if (event.target === modalQ) {
        modalQ.style.display = "none";
      }
    }
    const modal = document.getElementById("AddNewExp");
    const btn = document.getElementById("newExp");
    const span = document.getElementsByClassName("closeE")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
  }, []);
  const fetchExperience = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5001/NewExperience', { headers: headers });
      setExpList(response.data);
    } catch (error) {
    }
  };
  const fetchQualificatoins = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5001/NewQualifications', { headers: headers });
      setQualList(response.data);
    } catch (error) {
    }
  };
  const getData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/profile', { headers: headers });
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
      const response = await axios.get('http://127.0.0.1:5001/AllCourses', { headers: headers });
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
      const response = await axios.post('http://127.0.0.1:5001/UpdateExaminerCourse', { data: textInput }, { headers: headers });
      if (response.data["status"] === "fail") {
        setErrorI(response.data["message"]);
    } else {
        window.location.href = '/Settings';
    }
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
        <h2>Qualification</h2>
        <div className="PersonalForm">
          <table className='TableStyleQuali' border="1">
            <thead>
              <tr>
                <th>Sr #</th>
                <th>Degree Title</th>
                <th>Institute Name</th>
                <th>Starting Date</th>
                <th>Ending Date</th>
              </tr>
            </thead>
            <tbody>
              {QualList.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>{item[4]}</td>
                  <td>{item[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" id='newQua' style={{ width: "190px", float: "right" }}>Add New</button>
        </div>
        <div id="AddNewQualification" className="Setting-Modal">
          <div className="Setting-Modal-content" style={{ backgroundColor: "#232323" }}>
            <span className="closeQ">&times;</span>
            <div>
              <form style={{ width: "90%" }} onSubmit={handleExaminerQualification}>
                <div className="mainSettdiv">
                  <span></span>
                  <input type="text" className='inputQuabox' placeholder='Enter Degree Title' name='degree_title' onChange={(e) => setDegreeTitle(e.target.value)} required />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <input type="text" className='inputQuabox' placeholder='Enter Institute Name' name='institution' onChange={(e) => setInstitution(e.target.value)} required />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <label className='label_' htmlFor="starting_date">Starting Date:</label>
                  <input className="form-control inputQuabox" type="date" name="starting_date" runat="server" onChange={(e) => setStartingDateQ(e.target.value)}
                    style={{ height: "30px", width: "fit-content" }} />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <label className='label_' htmlFor="ending_date">Ending Date:</label>
                  <input className="form-control inputQuabox" type="date" name="ending_date" runat="server" onChange={(e) => setEndingDateQ(e.target.value)}
                    style={{ height: "30px", width: "fit-content" }} />
                </div>
                <div className="mainSettdiv">
                  <label className='label_' htmlFor="Certificate">Transcript: </label>
                  <input type="file" name="transcript" className="form-control" ref={Transcript} required />
                </div>
                <div className="AddBtn">
                  <input type="submit" value="Add" />
                </div>
                <div>
                  {error && <div style={{ color: "#cc4444" }}>{error}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
        <h2>Experience</h2>
        <div className="PersonalForm">
          <table className='TableStyleQuali' border="1">
            <thead>
              <tr>
                <th>Sr #</th>
                <th>Job Title</th>
                <th>Organization Name</th>
                <th>Reference Email</th>
                <th>Starting Date</th>
                <th>Ending Date</th>
              </tr>
            </thead>
            <tbody>
              {ExpList.map((item, index) => (
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
          <button type="button" id='newExp' style={{ width: "190px", float: "right" }}>Add New</button>
        </div>
        <div id="AddNewExp" className="Setting-Modal">
          <div className="Setting-Modal-content">
            <span className="closeE">&times;</span>
            <div>
              <form style={{ width: "90%" }} onSubmit={handleExaminerExper}>
                <div className="mainSettdiv">
                  <span></span>
                  <input type="text" className='input-box' placeholder='Enter Job Title' name='job_title' onChange={(e) => set_job_title(e.target.value)} required />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <input type="text" className='input-box' placeholder='Enter organization Name' name='organization' onChange={(e) => set_organization(e.target.value)} required />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <input type="text" className='input-box' placeholder='Enter Reference Email' name='reference_email' onChange={(e) => set_reference_email(e.target.value)} required />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <label className='label_' htmlFor="starting_date">Starting Date:</label>
                  <input className="form-control input-box" type="date" name="starting_date" runat="server" onChange={(e) => set_starting_date(e.target.value)}
                    style={{ height: "30px", width: "fit-content" }} />
                </div>
                <div className="mainSettdiv">
                  <span></span>
                  <label className='label_' htmlFor="ending_date">Ending Date:</label>
                  <input className="form-control input-box" type="date" name="ending_date" runat="server" onChange={(e) => set_ending_date(e.target.value)}
                    style={{ height: "30px", width: "fit-content" }} />
                </div>
                <div className="mainSettdiv">
                  <label className='label_' htmlFor="ExperianceLetter">Experiance Letter: </label>
                  <input type="file" name="ExperianceLetter" className="form-control" ref={Experience} required />
                </div>
                <div className="AddBtnEE">
                  <input type="submit" value="Add" />
                </div>
                <div>
                  {error && <div style={{ color: "#cc4444" }}>{error}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Settings;