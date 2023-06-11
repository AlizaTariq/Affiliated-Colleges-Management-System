import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import GenerateDuties from "./GenerateDuties";
import Login from "./Login";
import "../css/home.css";
import svgimg from "../images/sidepanel.png";
import Pagination from "./Pagination";
import axios from "axios";
import username from "../images/profilepictures/profilepic-7.jpg";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import React, { useEffect, useState, useRef } from "react";

import checkedHere from "../images/checked.png";
import deleteHere from "../images/delete.png";

import picHere from "../images/list.png";

const UserData = () => {
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [values, setSearchValue] = useState("");

  const [rankedExmList, setRankedExmList] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [countDetail, setCountDetail] = useState([]);

  const [open, setOpen] = useState(false);
  const [dutyStatus, setDutyStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(rankedExmList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rankedExmList.slice(indexOfFirstItem, indexOfLastItem);
  const [serialNumber, setSerialNumber] = useState(1);

  const handlePageChange = (pageNumber) => {
    setSerialNumber((pageNumber - 1) * itemsPerPage + 1);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getRankedExmList")
      .then((response) => response.json())
      .then((data) => {
        setRankedExmList(data);
      })
      .then((data1) => console.log("Ranked Exm List ", rankedExmList));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getAffiliatedColleges")
      .then((response) => response.json())
      .then((data) => {
        setCollegesList(data);
      })
      .then((data1) => console.log("Affiliated College List ", collegesList));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getCountDetail")
      .then((response) => response.json())
      .then((data) => {
        setCountDetail(data);
      })
      .then((data1) => console.log("getCountDetail List ", rankedExmList));
  }, []);

  const handleButtonClick = () => {
    fetch("/generatePracDuties")
      .then((response) => response.json())
      .then((data) => {
        const { success } = data;
        setDutyStatus(
          success
            ? "Duties generated successfully."
            : "Duties already exist. You cannot generate again!"
        );
        setOpen(true);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleClose = () => {
    setOpen(false);
    setDutyStatus("");
  };

  if (!accessToken) {
    console.log("Logouttt");
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <SideBar></SideBar>
        </div>

        <div style={{ flex: "1" }}>
          <NavBar />

          <div className="grid-container" style={{ flex: "1", margin: "14px" }}>
            <div className="card l-bg-cherry" style={{ height: "142px" }}>
              <div className="card-statistic-3 p-3">
                <div className="card-icon card-icon-large">
                  <i className="fas fa-users"></i>
                </div>
                <div className="mb-4" style={{ float: "left" }}>
                  <div className="card-title mb-0">
                    <p className="phere">
                      Total Practical Duties : {countDetail[0]}
                    </p>

                    <p className="phere">
                      Total Exam Duties : {countDetail[5]}
                    </p>
                    <br />
                  </div>
                </div>
              </div>
            </div>

            <div className="card l-bg-orange-dark" style={{ height: "142px" }}>
              <div className="card-statistic-3 p-3">
                <div className="card-icon card-icon-large">
                  <i className="fas fa-book-reader"></i>
                </div>
                <div className="mb-4" style={{ float: "left" }}>
                  <div className="card-title mb-0">
                    <p className="phere">
                      Total College Count : {countDetail[7]}
                    </p>

                    <p className="phere">
                      Total Departments Count : {countDetail[8]}
                    </p>
                    <br />
                  </div>
                </div>
              </div>
            </div>

            <div className="card  dutybtndiv l-bg-blue-dark">
              <Button
                variant="contained"
                id="genDutyBtn"
                onClick={handleButtonClick}
              >
                <b>Click To Generate</b>
              </Button>
              <div className="card-statistic-3 p-3">
                <div className="card-icon card-icon-large">
                  <i className="fas fa-users"></i>
                </div>

                <div className="mb-0">
                  <center>
                    <h1>Generate Practical Duties</h1>
                  </center>
                  <h5 className="card-title mb-0">
                    <div>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        className="custom-dialog"
                      >
                        <div className="forcenterOne">
                          <img
                            className="forcenter pic"
                            src={picHere}
                            alt="generateDuties-pic"
                          />
                        </div>

                        <DialogTitle className="dialogTitle">
                          <b>
                            <center>Duty Status</center>
                          </b>
                        </DialogTitle>
                        <DialogContent>
                          <center>{dutyStatus}</center>
                        </DialogContent>
                        <DialogActions className="custom-dialog-actions">
                          <Button className="btnClose" onClick={handleClose}>
                            <b>Close</b>
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid-container grid-containers"
            style={{ flex: "1", margin: "14px" }}
          >
            <div
              className="card  l-bg-blue-dark"
              style={{ height: "380px", margin: "14px" }}
            >
              <div className="card-statistic-3 p-3">
                <h1>
                  <b>Affiliated Colleges</b>
                </h1>
                <table className="table">
                  <thead>
                    <tr style={{ color: "white" }}>
                      <td>Name</td>
                      <td>Affiliated Year</td>
                      <td>Student Count</td>
                    </tr>
                  </thead>
                  <tbody>
                    {collegesList
                      ? collegesList.map((item) => (
                          <tr
                            style={{ border: "1px" }}
                            key={item[0]}
                            id={item[0]}
                          >
                            <td className="tableText">{item[5]}</td>
                            <td className="tableText">{item[1]}</td>
                            <td className="tableText">{item[3]}</td>
                          </tr>
                        ))
                      : "Loading..."}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="card  l-bg-blue-dark"
              style={{ height: "380px", margin: "14px " }}
            >
              <div className="card-statistic-3 p-3">
                <h1>
                  <b>Top 15 Ranked Examiner</b>
                </h1>
                <table className="table">
                  <thead>
                    <tr style={{ color: "white" }}>
                      <td className="texthere"></td>
                      <td>Name</td>
                      <td>Institution</td>
                      <td>Ranking</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems
                      ? currentItems.map((item) => (
                          <tr
                            style={{ border: "1px" }}
                            key={item[0]}
                            id={item[0]}
                            onClick={() => {
                              navigate("/Profile");
                            }}
                          >
                            <td className="tableText">
                              <img variant="top" src={username} id="exmImg" />
                            </td>
                            <td className="tableText">{item[2]}</td>
                            <td className="tableText">{item[4]}</td>
                            <td className="tableText">{item[6]}</td>
                          </tr>
                        ))
                      : "Loading..."}
                  </tbody>
                </table>
                <Pagination
                  pageCount={Math.ceil(rankedExmList.length / itemsPerPage)} // Calculate total number of pages
                  handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserData;
