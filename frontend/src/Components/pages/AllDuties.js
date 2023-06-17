import React, { useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "./Pagination";
import * as XLSX from "xlsx";
import Login from "./Login";
import NavBar from "./NavBar";
export default function AllDuties() {
  const navigate = useNavigate();
  const [duties, setDuties] = useState([]);
  const [values, setSearchValue] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.get("http://127.0.0.1:5000/getAllDuties");
      setDuties(response.data);
    };
    retrieve();
  }, []);

  const CreateDuty = () => {
    navigate("/Exam_Schedule");
  };
  const DutyDetails = (event) => {
    const responseData = event.target.id;
    navigate("/DutyDetailsEx", { state: { data: { responseData } } });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Set the number of items to display per page
  // Logic to calculate the current items to display based on current page and itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = duties.slice(indexOfFirstItem, indexOfLastItem);
  const [filteredItems, setFilteredItems] = useState([]);
  const currentItems =
    filteredItems.length > 0
      ? filteredItems
      : duties.slice(indexOfFirstItem, indexOfLastItem);
  const searching = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);

    if (searchValue === "") {
      setFilteredItems([]);
      return;
    }

    const filteredItems = duties.filter((item) => {
      if (
        item[3].toLowerCase() === searchValue.toLowerCase() ||
        item[1].toLowerCase() === searchValue.toLowerCase() ||
        item[4].toString() === searchValue ||
        item[5].toLowerCase() === searchValue.toLowerCase() ||
        item[2].toLowerCase() === searchValue.toLowerCase() ||
        item[0].toString() === searchValue
      ) {
        return true;
      } else {
        return false;
      }
    });

    setFilteredItems(filteredItems);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const[values,setSearchValue]=useState("");
  // const [data_get, setData] = useState([]);

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  const handleOnClickDutyBtn = (event) => {
    console.log("handleOnClickDutyBtn --> ", event.target.value);

    fetch(
      "http://127.0.0.1:5000/getDutiesStatus?typeduty=" + event.target.value
    )
      .then((response) => response.json())
      .then((data) => {
        setDuties(data);
      })
      .then((data1) => console.log("Specific duty list is ", duties));
  };
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex flex-row-reverse bd-highlight">
          <p className="form-inline">
            <input
              style={{ marginTop: "5px" }}
              id="searching"
              className="form-control mr-sm-2"
              onChange={(event) => searching(event)}
              type="search"
              placeholder="Search"
            />
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
              {/* <button
            onClick={handleOnClickDutyBtn}
            id="pendingBtn"
            className="showDutyBtn"
            value="1"
          >
            Pending
          </button> */}
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
          </p>
        </div>
        <div className="d-flex flex-row bd-highlight">
          <p className="form-inline"></p>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr
                style={{ fontWeight: "bold", border: "1px" }}
                className="headingTable"
              >
                <td>Id</td>
                <td>Name</td>
                <td>Email</td>
                <td>Course</td>
                <td>Semester</td>
                <td>Department</td>
                <td>Status</td>
                <td>Action</td>
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
                        const responseData = item[0];
                        navigate("/DutyDetailsEx", {
                          state: { data: { responseData } },
                        });
                      }}
                    >
                      <td className="tableText">{item[0]}</td>
                      <td className="tableText">{item[1]}</td>
                      <td className="tableText">{item[2]}</td>
                      <td className="tableText">{item[3]}</td>
                      <td className="tableText">{item[4]}</td>
                      <td className="tableText">{item[5]}</td>
                      <td className="tableText">
                        {item[6] === 1
                          ? "Assigned"
                          : item[6] === 2
                          ? "Accepted"
                          : "Rejected"}
                      </td>
                      <td className="tableText">
                        <button
                          className="showDutyTableBtn"
                          id={item[0]}
                          onClick={DutyDetails}
                        >
                          Duty Details
                        </button>
                      </td>
                    </tr>
                  ))
                : "Loading..."}
            </tbody>
          </table>
          <Pagination
            pageCount={Math.ceil(duties.length / itemsPerPage)} // Calculate total number of pages
            handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
          />
        </div>
      </div>
      <div
        className="modal fade"
        id="dutyModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Duty Detail
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body"></div>
            <div className="modal-footer">
              <button
                type="button"
                style={{ backgroundColor: "teal" }}
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
