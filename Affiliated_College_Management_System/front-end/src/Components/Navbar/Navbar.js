import React from 'react'
import 'boxicons'
import { useNavigate } from 'react-router-dom';
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const GoHome = () => {
    return navigate("/Home");
  }
  const GoNotifications = () => {
    return navigate("/Notifications");
  }
  const GoDuePaper = () => {
    return navigate("/DuePaper");
  }
  const GoResultPending = () => {
    return navigate("/ResultPending");
  }
     
  const GoProfile = () => {
    return navigate("/Profile");
  }
  const GoSettings = () => {
    return navigate("/Settings");
  }
  const LogOut = () => {
    localStorage.removeItem("access_token")
    return navigate("/");
  }

  return (
    <div className='Navbar'>
      <div className="logo" style={{ width: "25%"}}>
        <div onClick={GoHome} className='nav-logo'><box-icon type='logo' name='edge' animation='tada' color='#DDDBCB' size='45px'></box-icon>xaminer Portal</div>
      </div>
      <div className='nav-items' style={{ width: "30%"}}>
        <form action="post">
          <div className="maindiv">
            <input type="text" className="inputsearch" name='q' placeholder='Search' required />
            <button className="btnsubmit" type="submit"><box-icon name='search-alt' animation='tada' color='#DDDBCB' size='45px'></box-icon></button>
          </div>
        </form>
      </div>
      <div className='header-btn' style={{ width:"10%" }}>
        <label onClick={GoProfile} className='profile'><box-icon name='user-circle' size='30px' color="#DDDBCB"></box-icon></label>
        {/* <label onClick={GoRecent} className='progap'><box-icon type='solid' name='bell-ring' animation='tada' size='30px' color="#DDDBCB"></box-icon></label> */}
        {/* <label onClick={GoSettings} className='progap'><box-icon name='cog' animation='spin' size='30px' color="#DDDBCB"></box-icon></label> */}
      </div>
      <div className='header-btn' style={{ width:"20%" }}>
        <label onClick={GoSettings} className='settings'><box-icon name='cog' animation='spin' size='30px' color="#DDDBCB"></box-icon></label>
      </div>
      <div className='header-btn' style={{ width : "15%" }}>
        <label onClick={LogOut} className='signlog'><box-icon name='log-out' size='22px' color="#DDDBCB"></box-icon>Log Out</label>
      </div>
      <div className='VerNavbar'>
        <div className='vernav'>
          <div onClick={GoHome}>Home</div>
          <div onClick={GoNotifications}>Requests</div>
          <div onClick={GoDuePaper}>Due Paper</div>
          <div onClick={GoResultPending}>Result Pending</div>
        </div>
      </div>
    </div>


  )
}

export default Navbar;
