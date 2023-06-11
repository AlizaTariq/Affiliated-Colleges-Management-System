import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";
import "../css/CreateAndSendDuty.css";
import Button from "react-bootstrap/Button";
import Login from "./Login";
import NavBar from "./NavBar";
export default function CreateAndSendDuty() {
  const navigate = useNavigate();
  const [RoadMapYear, setRoadMapYear] = useState([]);
  const [department, setDepartment] = useState([]);
  const [SelectedExamId, setSelectedExamId] = useState([]);
  const [AllCourses, setAllCourses] = useState([]);

  const [SelectedRoadMapYear, setSelectedRoadMapYear] = useState("");
  const [Selecteddepartment, setSelecteddepartment] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedExaminerName, setExaminerName] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.get("http://127.0.0.1:5000/getAllData");
      // console.log("I'm there"+response.data);
      setDepartment(response.data[1]);
      setRoadMapYear(response.data[0]);
    };
    retrieve();
  }, []);
  function handleSelectChange(selectedValue) {
    setSelectedOption(selectedValue);
    const retrieve = async () => {
      const response = await axios.post(
        "http://127.0.0.1:5000/getAllExaminerName",
        { courseName: { selectedValue } }
      );
      setSelectedExamId(response.data);
    };
    retrieve();
  }
  function GetCourses(selectedValue) {
    setSelecteddepartment(selectedValue);
    const retrieve = async () => {
      const response = await axios.post("http://127.0.0.1:5000/getAllCourses", {
        department: { selectedValue },
        roadMapYear: { SelectedRoadMapYear },
      });
      setAllCourses(response.data);
    };
    retrieve();
  }
  function uploaduty() {
    const url = "http://127.0.0.1:5000/createDuty";
    var List = [];
    List.push(
      selectedExaminerName,
      Selecteddepartment,
      SelectedRoadMapYear,
      selectedOption
    );
    // console.log(List)
    axios
      .post(url, List)
      .then((res) => {
        const responseData = res.data;
        navigate("/CourseCard", { state: { data: { responseData } } });
      })
      .catch((err) => alert(err + " OOPS! BAD REQUEST"));
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="mbsc-grid mbsc-grid-fixed mt-5">
          <div className="mbsc-form-group">
            <div className="mbsc-row mbsc-justify-content-center">
              <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
                <div className="myheading mbsc-form-group-title">
                  <h3>
                    <b>Create & Send Duty</b>
                  </h3>
                </div>
                <div className="mbsc-row">
                  <div className="mbsc-col-md-6 mbsc-col-12">
                    <Dropdown
                      label="Roadmap Year"
                      inputStyle="box"
                      labelStyle="floating"
                      onChange={(event) =>
                        setSelectedRoadMapYear(event.target.value)
                      }
                      id="roadMapYear"
                    >
                      <option value>--Select Year--</option>
                      {RoadMapYear.map((num, index) => {
                        return (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        );
                      })}
                    </Dropdown>
                  </div>
                  <div className="mbsc-col-md-6 mbsc-col-12">
                    <Dropdown
                      label="Department"
                      inputStyle="box"
                      labelStyle="floating"
                      onChange={(event) => GetCourses(event.target.value)}
                      id="department"
                    >
                      <option value>--Select Department--</option>
                      {department.map((num, index) => {
                        return (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        );
                      })}
                    </Dropdown>
                  </div>
                </div>
                <div className="mbsc-row">
                  <div className="mbsc-col-12">
                    <Dropdown
                      label="Course"
                      inputStyle="box"
                      labelStyle="floating"
                      value={selectedOption}
                      onChange={(event) =>
                        handleSelectChange(event.target.value)
                      }
                      id="courseName"
                      className="form-select form-select-lg mb-3"
                      aria-label=".form-select-lg example"
                    >
                      <option value>--Select Course Name--</option>
                      {AllCourses.map((num, index) => {
                        return (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        );
                      })}
                    </Dropdown>
                  </div>
                </div>
                <div className="mbsc-row">
                  <div className="mbsc-col-12">
                    <Dropdown
                      label="Examiner"
                      inputStyle="box"
                      labelStyle="floating"
                      onChange={(event) => setExaminerName(event.target.value)}
                      id="examinerid"
                    >
                      <option value>--Select Examiner--</option>
                      {SelectedExamId.map((num, index) => {
                        return (
                          <option key={index} value={num}>
                            {num}
                          </option>
                        );
                      })}
                    </Dropdown>
                  </div>
                </div>
                {/* <div className="mbsc-col-24" style={{ display: "flex", justifyContent: "Right", alignItems: "Center" }} > */}
                <div className="lead d-flex justify-content-between">
                  <Button
                    className="sendDuty1"
                    onClick={() => {
                      navigate("/ShowDutiesEx");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="sendDuty2"
                    style={{ borderRadius: "6px" }}
                    onClick={uploaduty}
                  >
                    <b>Save & Next →</b>{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
