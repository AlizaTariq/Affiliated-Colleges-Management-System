import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './examinerExp.css';
// import { useHistory } from "react-router-dom";

const ExaminerExp = () => {

    const [dataList, setDataList] = useState([]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const header = {
        'Authorization': `Bearer ${accessToken}`,
    };
    useEffect(() => {
        if (!accessToken) {
            return navigate("/");
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5001/NewExperience', { headers: header });
            setDataList(response.data);
        } catch (error) {
        }
    };
    const [job_title, set_job_title] = useState('');
    const [organization, set_organization] = useState('');
    const [reference_email, set_reference_email] = useState('');
    const [starting_date, set_starting_date] = useState('');
    const [ending_date, set_ending_date] = useState('');
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');
    const handleExaminerExper = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('job_title', job_title);
        formData.append('organization', organization);
        formData.append('reference_email', reference_email);
        formData.append('starting_date', starting_date);
        formData.append('ending_date', ending_date);
        formData.append('ExperianceLetter', fileInputRef.current.files[0]);
        try {
            const response = await axios.post('http://127.0.0.1:5001/ExaminerExperience', formData, { headers: header });
            if (response.data["status"] === "fail") {
                setError(response.data["message"]);
            } else {
                window.location.href = '/ExaminerExp';
            }
            // Redirect the user to the protected route
        } catch (error) {
            console.error("error: ", error);
        }
    };
    useEffect(() => {
        const modal = document.getElementById("AddNewQualification");

        const btn = document.getElementById("myBtn");

        const span = document.getElementsByClassName("close")[0];

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
    });
    const GoNext = () => {
        return navigate("/ExaminerInterest");
    }
    return (
        <div className='FormBgEE'>
            <div className='bg-imgEE'>
                <div className="contentEE">
                    <header>
                        <h1 style={{ color: "#d7e7ec", fontFamily: "'Poppins'", fontWeight: "500" }}>Experience</h1>
                    </header>
                    <table className='TableStyleEE' border="1">
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
                            {dataList.map((item, index) => (
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
                    <div className="container ButtonsEE">
                        <div>
                            {/* <form action='http://localhost:3000/Profile'> */}
                            <div id="AddNewQualification" className="modal">
                                <div className="modal-content">
                                    <span className="close">&times;</span>
                                    <div>
                                        <form style={{ width: "90%" }} onSubmit={handleExaminerExper}>
                                            <div className="maindiv">
                                                <span></span>
                                                <input type="text" className='input-box' placeholder='Enter Job Title' name='job_title' onChange={(e) => set_job_title(e.target.value)} required />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <input type="text" className='input-box' placeholder='Enter organization Name' name='organization' onChange={(e) => set_organization(e.target.value)} required />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <input type="text" className='input-box' placeholder='Enter Reference Email' name='reference_email' onChange={(e) => set_reference_email(e.target.value)} required />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <label className='label_' htmlFor="starting_date">Starting Date:</label>
                                                <input className="form-control input-box" type="date" name="starting_date" runat="server" onChange={(e) => set_starting_date(e.target.value)}
                                                    style={{ height: "30px", width: "fit-content" }} />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <label className='label_' htmlFor="ending_date">Ending Date:</label>
                                                <input className="form-control input-box" type="date" name="ending_date" runat="server" onChange={(e) => set_ending_date(e.target.value)}
                                                    style={{ height: "30px", width: "fit-content" }} />
                                            </div>
                                            <div className="maindiv">
                                                <label className='label_' htmlFor="ExperianceLetter">Experiance Letter: </label>
                                                <input type="file" name="ExperianceLetter" className="form-control" ref={fileInputRef} required />
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
                    </div>
                    <div className='NextBtnEE'>
                        <button type="button" id='myBtn' style={{ width: "190px" }}>Add New</button>
                        <br></br>
                        <button type="submit" style={{ width: "190px" }} onClick={GoNext}>Next Page</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExaminerExp