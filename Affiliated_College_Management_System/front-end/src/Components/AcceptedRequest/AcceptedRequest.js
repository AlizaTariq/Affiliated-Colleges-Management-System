import React from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './acceptedRequest.css';

const AcceptedRequest = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };
    if (!accessToken) {
      return navigate("/"); // Render the Login component if access token doesn't exist
    }    
    return (
        <>
            <Navbar></Navbar>
            <div className='My-body8'>
                <div className='container'>
                    <div className="row RequestheaderAR">
                        <div className="courseTitleAR col-9">
                            CMP-100 Introduction to Computing
                            <br></br>
                            <div className="requestdateAR col-3">
                                requested date
                            </div>
                        </div>
                        <div className="deadlineAR col-3">
                            paper upload deadline
                        </div>
                    </div>
                    <div className="row requestBodyAR">
                        <div className="col-8">
                            <div className="bookRecomended">
                                <label className='outlineTitleAR'>Book recomended: </label>
                                Nell Dale, John Lewis, Computer Science Illuminated, 5th Edition,
                                Jones & Bartlett Learning, 2012, ISBN-10: 1449672841,
                                ISBN-13: 978-1449672843.
                            </div>
                            <div className="CourseOutlineAR">
                                <label className='outlineTitleAR'>Outline:</label>
                                Introduction to Information Technology, The Internet and World
                                Wide Web, Software, Types of software, Application Software, Productivity
                                Software, System Software, Digital Logic Design, Computer Organization,
                                Operating System, Utility Programs, Hardware, Storage, Computer
                                Networks, Software development, Command Line, Little Man Computer,
                                Database Systems, Software Engineering Problem Solving, Algorithms,
                                HTML.
                            </div>
                        </div>
                        <div className="col-4 uploadPaperAR" style={{ marginTop: "10px" }}>
                            <form action="http://localhost:5000//GetPaper" method='post' enctype="multipart/form-data">
                                <h3>The paper is not done yet!</h3>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AcceptedRequest