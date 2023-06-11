//SHOW DUTIES-- with list
//import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

import "../css/ShowDuties.css";
import Home from "./Home";
import Form from "react-bootstrap/Form";
import profile from "../images/profilepic-2.jpg";
import ShowDutyDetail from "./ShowDutyDetail";
import ShowDutiesPracT from "./ShowDutiesPracT";
import Login from "./Login";
import NavBar from "./NavBar";

const ShowDuties = () => {
  const [list1, setList1] = useState([]);
  const [counter, setCounter] = useState(1);
  const [submitBDetailValue, setSubmitDetailValue] = useState(false);
  const [currentItem, setCurrentItem] = useState([]);

  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(list1);
  const [submitValue, setSubmitValue] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    // fetch("http://localhost:3000/getAllPraticalList")
    fetch("http://127.0.0.1:5000/getAllPraticalList")
      .then((response) => response.json())
      .then((data) => {
        setList1(data);
        setFilteredList(data);
      })
      .then((data1) => console.log("data dtt", list1));
  }, []);

  const handleOnClickDutyBtn = (event) => {
    console.log("handleOnClickDutyBtn --> ", event.target.value);

    fetch("http://127.0.0.1:5000/getDutiesList?typeduty=" + event.target.value)
      .then((response) => response.json())
      .then((data) => {
        setList1(data);
        setFilteredList(data);
        setCounter(1);
      })
      .then((data1) => console.log("Specific duty list is ", list1));
  };

  const handleChange = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    const filteredResults = list1.filter((objList) =>
      Object.keys(objList).some((key) =>
        objList[key]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setFilteredList(filteredResults);
  };

  const handleOnClickDetail = (event, item) => {
    console.log("clllll");
    console.log("Item is : ", item);
    setSubmitDetailValue(true);
    setCurrentItem(item);
  };

  const handleOnClickDutyTableBtn = () => {
    //  history.push("/ShowDutiesEx", { list1 });
    //navigate("/ShowDutiesPracT");

    setSubmitValue(true);
  };

  if (submitBDetailValue == true) {
    return <ShowDutyDetail data={currentItem} />;
  }

  if (submitValue == true) {
    console.log("submit valu state true===> ");
    return <ShowDutiesPracT />;
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      <div className="ShowDutyMainDiv">
        <div className="searchBar">
          <input
            id="searchBarInput"
            type="text"
            placeholder="Enter keywords..."
            value={query}
            onChange={handleChange}
            size="50"
          />

          <button
            onClick={handleOnClickDutyTableBtn}
            id="showDutyTable"
            className="showDutyTableBtn"
            value="1"
          >
            View Table Format
          </button>
        </div>
        <div className="buttons">
          <button
            onClick={handleOnClickDutyBtn}
            id="acceptBtn"
            className="showDutyBtn"
            value="2"
          >
            Accepted
          </button>
          <button
            onClick={handleOnClickDutyBtn}
            id="rejectBtn"
            className="showDutyBtn"
            value="3"
          >
            Rejected
          </button>
          <button
            onClick={handleOnClickDutyBtn}
            id="pendingBtn"
            className="showDutyBtn"
            value="1"
          >
            Pending
          </button>
          <button
            onClick={handleOnClickDutyBtn}
            id="notAssignedBtn"
            className="showDutyBtn"
            value="0"
          >
            Not Assigned
          </button>

          <button
            onClick={handleOnClickDutyBtn}
            id="showAllBtn"
            className="showDutyBtn"
            value="4"
          >
            Show All Duties
          </button>
        </div>

        <div className="showDutyMainMainDiv">
          <h1 className="showDutyh1">Duties</h1>
          <div className="showDutyContainer">
            {filteredList.map((item) => (
              <div className="duty-items">
                <div className="dutyStatus">
                  <p className="showDutyp">{item[7]} </p>
                </div>
                <h3 className="dutyItemh3">Duty-{list1.indexOf(item) + 1}</h3>
                <div className="duty-details">
                  <p className="showDutyp">
                    <b>Type:</b> Practical
                  </p>
                  <p className="showDutyp">
                    <b>Subject:</b> {item[4]}
                  </p>
                  <p className="showDutyp">
                    <b>Course code:</b> {item[3]}
                  </p>
                  <p className="showDutyp">
                    <b>Batches:</b> {item[5]}{" "}
                  </p>
                  <p className="showDutyp">
                    <b>Date:</b> 19,November,2022
                  </p>
                  <p className="showDutyp">
                    <b>timings:</b> 1:00pm - 2:00pm
                  </p>
                  <p className="showDutyp">
                    <b>Institution:</b> {item[1]}
                  </p>
                </div>
                <br></br>
                <div className="buttonDiv">
                  <button
                    className="showDutyBtn"
                    id="submitBtn"
                    onClick={(e) => handleOnClickDetail(e, item)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowDuties;
