import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './duePaper.css'

const DuePaper = () => {
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
            return navigate('/AcceptedRequest');
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
            const response = await axios.get('http://127.0.0.1:5001/PaperPendingDuty', { headers: headers });
            setDataList(response.data);
        } catch (error) {

        }
    };
    return (
        <>
            <Navbar></Navbar>
            <div className='My-body2'>
                <div className="subject2-box">
                    <h2 className="subject2-name">Due Paper</h2>
                    <box-icon name='sort-a-z' animation='tada' size='140px' color="#ffffff"></box-icon>
                    <box-icon name='time-five' animation='tada' size='60px' color="#ffffff"></box-icon>
                    <box-icon name='task' animation='flashing' size='100px' color="#ffffff"></box-icon>
                    <box-icon name='pencil' animation='tada' size='100px' color="#ffffff"></box-icon>
                    <box-icon name='calculator' animation='' size='80px' color="#ffffff"></box-icon>
                    <box-icon name='detail' animation='' size='70px' color="#ffffff"></box-icon>
                    <box-icon type='solid' name='graduation' animation='tada' size='110px' color="#ffffff"></box-icon>
                    {/* <box-icon type='logo' name='deezer' animation='flashing' size='70px' color="#ffffff"></box-icon> */}
                    <div className="subject2-description">
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
                                                navigate("/AcceptedRequest?id=" + id + "&type=" + type);
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

export default DuePaper