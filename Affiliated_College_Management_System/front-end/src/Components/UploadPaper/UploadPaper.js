import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import './uploadPaper.css';

const UploadPaper = () => {

    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const id = query.get('id');
    const type = query.get('type');

    const [getData, setData] = useState([]);
    const [shouldDisplayDiv, setDisplay] = useState();
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');
    const accessToken = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };

    useEffect(() => {
        if (!accessToken) {
            const url = "/UploadPaper?id=" + id + "&type=" + type;
            return navigate('/?redirectto=' + encodeURIComponent(url));
        }
        axios
            .get("http://127.0.0.1:5001/DutyDetails?Id=" + id + "&type=" + type, { headers: headers })
            .then((res) => {
                const resData = res.data;
                console.log(resData)
                setData(resData);
                if (type === "Practical_Exam") {
                    setDisplay(true);
                } else {
                    setDisplay(false);
                }
            })
            .catch((err) => console.log(err + "  OOPS! BAD REQUEST CC"));
    }, []);
    const handlePaperUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Paper', fileInputRef.current.files[0]);
        formData.append('Id', id)
        formData.append('type', type)
        try {
            const response = await axios.post('http://127.0.0.1:5001/GetPaper', formData, { headers: headers });
            setMessage(response.data["message"]);
            // Redirect the user to the protected route
            return navigate('/UploadPaper')
        } catch (error) {
            console.error("error: ", error);
            setMessage(error)
        }
    };
    return (
        <>
            <Navbar></Navbar>
            <div className='My-body5'>
                <div className='container'>
                    <div className="row RequestheaderUP">
                        <div className="courseTitleUP col-9">
                            {getData[4]} {getData[5]}
                            <br></br>
                            <div className="requestdateUP col-3">
                                {getData[2]}
                            </div>
                        </div>
                        <div className="deadlineUP col-3">
                            {getData[1]}
                        </div>
                    </div>
                    <div className="row requestBodyUP">
                        <div className="col-8">
                            <div className="bookRecomended">
                                <label className='outlineTitleUP'>Book recomended: </label>
                                {getData[6]}
                            </div>
                            <div className="CourseOutlineUP">
                                <label className='outlineTitleUP'>Outline:</label>
                                {getData[7]}
                            </div>
                            {shouldDisplayDiv && <div className="CourseOutlineRR" id='Venue'>
                                <label className='outlineTitleRR'>Venue:</label>
                                Practicle is at {getData[0]}, {getData[3]} in college {getData[8]}, {getData[9]}
                            </div>}
                        </div>
                        <div className="col-4 uploadPaperUP" style={{ marginTop: "10px" }}>
                            <form onSubmit={handlePaperUpload}>
                                <input type="file" name="Paper" className="form-controlUP" ref={fileInputRef} required />
                                <button type="submit" className="submit-btnUP" >Upload Paper</button>
                                <div>
                                    {message && <div>{message}</div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadPaper