import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './examinerQualification.css';

const ExaminerQualification = () => {

    const [dataList, setDataList] = useState([]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const header = {
        'Authorization': `Bearer ${accessToken}`,
    };
    useEffect(() => {
        if (!accessToken) {
            return navigate("/"); // Render the Login component if access token doesn't exist
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/NewQualifications', { headers: header });
            setDataList(response.data);
        } catch (error) {
        }
    };
    const [degree_title, setDegreeTitle] = useState('');
    const [institution, setInstitution] = useState('');
    const [starting_date, setStartingDate] = useState('');
    const [ending_date, setEndingDate] = useState('');
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');
    const handleExaminerQualification = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('degree_title', degree_title);
        formData.append('institution', institution);
        formData.append('starting_date', starting_date);
        formData.append('ending_date', ending_date);
        formData.append('transcript', fileInputRef.current.files[0]);
        try {
            const response = await axios.post('http://127.0.0.1:5000/ExaminerQualification', formData, { headers: header });
            if (response.data["status"] === "fail") {
                setError(response.data["message"]);
            } else {                
                window.location.href = '/ExaminerQualification';
            }
            // Redirect the user to the protected route
        } catch (error) {
            console.error("error: ", error);
            setError('Some Input is Wrong');
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
        return navigate("/ExaminerExp");
    }
    return (
        <div className='FormBgEQ'>
            <div className='bg-imgEQ'>
                <div className="contentEQ" >
                    <header>
                        <h1 style={{ color: "#d7e7ec", fontFamily: "'Poppins'", fontWeight: "500" }}>Qualification</h1>
                    </header>
                    <table className='TableStyleEQ' border="1">
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
                            {dataList.map((item, index) => (
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
                    <div className="container ButtonsEQ">
                        <div>
                            <div id="AddNewQualification" className="modal">
                                <div className="modal-content" style={{ backgroundColor: "#232323" }}>
                                    <span className="close">&times;</span>
                                    <div>
                                        <form style={{ width: "90%" }} onSubmit={handleExaminerQualification}>
                                            <div className="maindiv">
                                                <span></span>
                                                <input type="text" className='input-box' placeholder='Enter Degree Title' name='degree_title' onChange={(e) => setDegreeTitle(e.target.value)} required />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <input type="text" className='input-box' placeholder='Enter Institute Name' name='institution' onChange={(e) => setInstitution(e.target.value)} required />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <label className='label_' htmlFor="starting_date">Starting Date:</label>
                                                <input className="form-control input-box" type="date" name="starting_date" runat="server" onChange={(e) => setStartingDate(e.target.value)}
                                                    style={{ height: "30px", width: "fit-content" }} />
                                            </div>
                                            <div className="maindiv">
                                                <span></span>
                                                <label className='label_' htmlFor="ending_date">Ending Date:</label>
                                                <input className="form-control input-box" type="date" name="ending_date" runat="server" onChange={(e) => setEndingDate(e.target.value)}
                                                    style={{ height: "30px", width: "fit-content" }} />
                                            </div>
                                            <div className="maindiv">
                                                <label className='label_' htmlFor="Certificate">Transcript: </label>
                                                <input type="file" name="transcript" className="form-control" ref={fileInputRef} required />
                                            </div>
                                            <div className="AddBtn">
                                                <input type="submit" value="Add" />
                                            </div>
                                            <div>
                                                {error && <div style={{color:"#cc4444"}}>{error}</div>}
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
export default ExaminerQualification