import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signupPersonalInfo.css';

const SignupPersonalInfo = () => {
    const [usr_name, setUserName] = useState('');
    const [usr_cnic, setCNIC] = useState('');
    const [usr_email, setEmail] = useState('');
    const [usr_address, setAddress] = useState('');
    const [usr_bio, setBio] = useState('');
    const [usr_gender, setGender] = useState('');
    const [usr_password, setPassword] = useState('');
    const [usr_phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUpPersonal = async (e) => {
        console.log("usr_address: ", usr_address);
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5001/SignUpPersonalInfo',
                { usr_name, usr_cnic, usr_email, usr_address, usr_bio, usr_gender, usr_password, usr_phone });

            if (response.data["status"] === "fail") {
                setError(response.data["message"]);
            } else {
                const accessToken = response.data.access_token;
                localStorage.setItem('access_token', accessToken);
                navigate("/SignupExaminerInfo")
            }
        } catch (error) {
            console.error("error: ", error);
            setError(error);
        }
    };

    useEffect(() => {
        var password = document.getElementById("pass");
        var passwordC = document.getElementById("passC");
        passwordC.addEventListener("keyup", function () {
            if (password.value !== passwordC.value) {
                document.getElementById("messageError").innerHTML = "Password does not match<br />";
            } else {
                document.getElementById("messageError").innerHTML = "";
            }
        });
    });
    return (
        <div className='FormBgSP'>
            <style>
                <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' />
            </style>
            <div className='bg-imgSP'>
                <div className="contentSP">
                    <h1 className='headtxtSP'>Sign Up form</h1>
                    <header type="PI" style={{ fontFamily: "Poppins", color: "#d7e7ec" }}> Put your Personal Information to Sign Up!</header>
                    <form onSubmit={handleSignUpPersonal}>
                        <div className="maindivSP">
                            <span className="fa fa-user"></span>
                            <input type="text" className="input-boxSP" placeholder='Enter User Name' name='name_' onChange={(e) => setUserName(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-mail-bulk"></span>
                            <input type="email" className="input-boxSP" placeholder='Enter Email Address' name='email' onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-id-card"></span>
                            <input type="text" className="input-boxSP" placeholder='Enter CNIC (00000-0000000-0)' name='cnic' onChange={(e) => setCNIC(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-id-card"></span>
                            <input type="text" className="input-boxSP" placeholder='Enter Phone Number (+92 0000000000)' name='phone' onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-home"></span>
                            <input type="text" className="input-boxSP" placeholder='Enter Address' name='address' onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-male"></span>
                            <span style={{ width: "fit-content" }} className="input-boxSP" > Gender: </span>
                            <select className="form-label designLable" name="gender" onChange={(e) => setGender(e.target.value)} >
                                <option value="Select">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Not prefer to say">Not prefer to say</option>
                            </select>
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-user-edit"></span>
                            <input type="text" className="input-boxSP" placeholder='Enter Bio' name='bio' onChange={(e) => setBio(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-lock"></span>
                            <input type="password" id='pass' className="input-boxSP" placeholder='Enter Password' name='password' onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="maindivSP">
                            <span className="fa fa-lock"></span>
                            <input type="password" id='passC' className="input-boxSP" placeholder='Confirm Password' required />
                        </div>
                        <span id="messageError"></span>
                        <div>
                            <button type="submit" className="submit-btnSP" >Next</button>
                        </div>
                        <div>
                            {error && <div style={{color:"#cc4444"}}>{error}</div>}
                        </div>
                    </form>
                    <div className="passSP">
                        <a href="/">Already have an account? Log in</a>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default SignupPersonalInfo