import React, { useState, useEffect } from "react";
import Login from "./Components/pages/Login";
import Mainpage from "./Components/Mainpage";
import Notifications from "./Components/pages/Notifications";
import Schedule from "./Components/pages/Schedule";
import Home from "./Components/pages/Home";
import Form from "./Components/pages/Form";
import ShowDuties from "./Components/pages/ShowDuties";
import { redirect, useHistory } from "react-router-dom";
//import MyForm from './Components/MyForm';
import CollegeReview from "./Components/pages/CollegeReview";
import GenerateDuties from "./Components/pages/GenerateDuties";
import PracCollegeReview from "./Components/pages/PracCollegeReview";
import PracTeacherFeedback from "./Components/pages/PracTeacherFeedback";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TeacherReview from "./Components/pages/TeacherReview";
import { BrowserRouter } from "react-router-dom";
import UserData from "./Components/pages/Home";
import Profile from "./Components/pages/Profile";
import SideBar from "./Components/pages/SideBar";
import NavBar from "./Components/pages/NavBar";
import Exam_Schedule from "./Components/pages/Exam_Schedule";
import CreateAndSendDuty from "./Components/pages/CreateAndSendDuty";

import FORMPDF from "./Components/pages/FORMPDF";
// import Schedule from "./Components/pages/Schedule"
import ShowDutiesEx from "./Components/pages/ShowDutiesEx";
import AllDuties from "./Components/pages/AllDuties";
import DutyDetailsEx from "./Components/pages/DutyDetailsEx";
import TableOfCariculum from "./Components/pages/TableOfCariculum";
import CourseCard from "./Components/pages/CourseCard";

const About = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};

const Users = () => {
  return <div>Users</div>;
};

function App() {
  const [data, setData] = useState([{}]);
  useEffect(() => {
    fetch("/listData")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  const [active, setActive] = useState("FirstCard");

  const [data1, setdata1] = useState({
    myStatus: "",
    myData: "",
  });

  useEffect(() => {
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    fetch("/loginData").then((res) =>
      res.json().then((data1) => {
        // Setting a data from api
        setdata1({
          myStatus: data1.myStatus,
          myData: data1.myData,
        }).then((data1) => console.log("Get data : " + data1));
      })
    );

    // history.push("/")
    // <Route path="/loginData" element={ <Home />}/>
  }, []);

  return (
    <>
      {/* <NavBar /> */}
      <Router>
        <Routes>
          <Route path="/NavBar" element={<NavBar />}></Route>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sendRequest" element={<Schedule />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/loginData" element={<Login />} />"
          <Route path="/CollegeReview" element={<CollegeReview />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/SideBar" element={<SideBar />} />
          <Route path="/Exam_Schedule" element={<Exam_Schedule />} />
          <Route path="/TeacherReview" element={<TeacherReview />} />
          <Route path="/data" element={<Form />} />
          <Route path="/showduties" element={<ShowDuties />} />
          <Route path="/GenerateDuties" element={<GenerateDuties />} />
          <Route
            path="/PracTeacherFeedback"
            element={<PracTeacherFeedback />}
          />
          <Route
            path="/PracCollegeReview"
            element={<PracCollegeReview></PracCollegeReview>}
          ></Route>
          <Route
            path="/TableOfCariculum"
            element={<TableOfCariculum></TableOfCariculum>}
          ></Route>
          <Route path="CourseCard" element={<CourseCard></CourseCard>}></Route>
          <Route
            path="/CreateAndSendDuty"
            element={<CreateAndSendDuty></CreateAndSendDuty>}
          ></Route>
          <Route path="AllDuties" element={<AllDuties></AllDuties>}></Route>
          <Route
            path="DutyDetailsEx"
            element={<DutyDetailsEx></DutyDetailsEx>}
          ></Route>
          <Route
            path="ShowDutiesEx"
            element={<ShowDutiesEx></ShowDutiesEx>}
          ></Route>
          <Route path="FORMPDF" element={<FORMPDF></FORMPDF>}></Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
