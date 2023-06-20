import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Verification = () => {
    console.log("yes")
    const navigate = useNavigate();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const code = query.get('code');
    const id = query.get('id');
    useEffect(() => {
        axios
      .get("http://127.0.0.1:5001/verify_email?code=" + code +"&id=" + id)
      .then((res) => {
        return navigate("/");
      })
      .catch((err) => console.log(err + "  OOPS! BAD REQUEST CC"));
    }, []);
    return (
        <>
        pidopwudoiw
        </>
    )
    // ...
};
export default Verification;