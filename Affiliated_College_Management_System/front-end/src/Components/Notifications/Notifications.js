import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
    const [dataList, setDataList] = useState([]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const headers = {
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
            const response = await axios.get('http://127.0.0.1:5001/notifications', { headers: headers });
            setDataList(response.data);
            console.log(response.data);
        } catch (error) {

        }
    };
    return (
        <>
            <Navbar></Navbar>
            <div className='My-body4'>
                <div className="subject4-box">
                    <h2 className="subject4-name">Requests</h2>

                    <box-icon type='solid' name='message-rounded-detail' animation='burst' size='80px' color="#ffffff"></box-icon>
                    <box-icon name='message-rounded-dots' animation='burst' size='180px' color="#ffffff"></box-icon>
                    <box-icon type='solid' name='comment-dots' animation='burst' size='40px' color="#ffffff"></box-icon>
                    <div className="subject4-description">
                        <p>description if needed.</p>
                    </div>
                </div>
                <div className='container'>
                    <div className="row">
                        <div className='adjustment4'>
                            {dataList.map(item => (
                                // <form onSubmit={handleDutyID}>
                                <div className="notification_block4">
                                    <div className='CourseTitle4'>{item[1]}</div>
                                    <div className='papertype4'>
                                        {item[3]}
                                        <button className='detail-btn' type="deatils" onClick={() => {
                                            const id = item[0];
                                            const type = item[3]
                                            navigate("/RequestRecieved?id=" + id + "&type=" + type);
                                        }}>See Details</button>
                                    </div>
                                    <div className='date4'>{item[2]}</div>
                                </div>
                                // </form>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notifications