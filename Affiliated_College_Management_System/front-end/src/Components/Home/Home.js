import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './home.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Home = () => {
    const [dataList, setDataList] = useState([]);
    const [Duty_ID, setId] = useState('');
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };
    const handleDutyID = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('duty_id', Duty_ID);
        try {
            const response = await axios.post('http://127.0.0.1:5001/getRequestRecievedId', formData, { headers: headers });

            // Redirect the user to the protected route
            return navigate('/UploadPaper');
        } catch (error) {
            console.error("error: ", error);
        }
    };
    useEffect(() => {
        if (!accessToken) {
            return navigate("/"); // Render the Login component if access token doesn't exist
        }
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5001/home', { headers: headers });
            setDataList(response.data);
            console.log(response.data);
        } catch (error) {
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div className='My-body1'>
                <div className="subject1-box" >
                    <h2 className="subject1-name">HOME</h2>
                    <box-icon name='home-smile' animation='tada' size='190px' color="#202124"></box-icon>
                    <div className="subject1-description">
                        <p>description if needed.</p>
                    </div>
                </div>
                <div className='container'>
                    <div className="row">
                        <div className='adjustment4'>
                            {dataList.map(item => (
                                <form onSubmit={handleDutyID}>
                                    <div className="notification_block4">
                                        <div className='CourseTitle4'>{item[1]}</div>
                                        <div className='papertype4'>
                                            {item[3]}
                                            <button className='detail-btn' type="deatils" onClick={() => {
                                                const id = item[0];
                                                const type = item[3]
                                                navigate("/UploadPaper?id=" + id + "&type=" + type);
                                            }}>See Details</button>
                                        </div>
                                        <div className='date4'>{item[2]}</div>
                                    </div>
                                </form>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home