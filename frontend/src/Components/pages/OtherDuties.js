import React, { useEffect, useState } from "react";

import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "./Pagination";
import * as XLSX from "xlsx";
import Login from "./Login";
import NavBar from "./NavBar";

export default function OtherDuties() {
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
    navigate("/CreateAndSendDuty");
  };
  const DutyDetails = (event) => {
    const responseData = event.target.id;
    navigate("/DutyDetails", { state: { data: { responseData } } });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Set the number of items to display per page
  // Logic to calculate the current items to display based on current page and itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = duties.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const[values,setSearchValue]=useState("");
  // const [data_get, setData] = useState([]);

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex flex-row-reverse bd-highlight">
          <p className="form-inline">
            {/* onChange={event => setSearchValue(event.target.value)}  */}
            <input
              id="searching"
              className="form-control mr-sm-2 mt-1"
              onChange={(event) => setSearchValue(event.target.value)}
              type="search"
              placeholder="Search"
            />
            <Button className="m-2" variant="dark" onClick={CreateDuty}>
              Create Duties
            </Button>
          </p>
        </div>
        <div className="d-flex flex-row bd-highlight">
          <p className="form-inline"></p>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr style={{ fontWeight: "bold", border: "1px" }}>
                <td>Id</td>
                <td>Examiner Name</td>
                <td>Examiner Email</td>
                <td>Course</td>
                <td>Semester</td>
                <td>Department</td>
                <td>Status: 1-Pending, 2-Accepted, 3-Rejected</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {currentItems
                ? currentItems
                    .filter((item) => {
                      if (values === "") {
                        //if query is empty
                        return item;
                      } else if (
                        item[2].toLowerCase().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      } else if (
                        item[3].toLowerCase().includes(values.toLowerCase())
                      ) {
                        //returns filtered array
                        return item;
                      }
                    })
                    .map((item) => (
                      <tr
                        style={{ border: "1px" }}
                        key={item[0]}
                        id={item[0]}
                        onClick={() => {
                          const responseData = item[0];
                          navigate("/CourseCard", {
                            state: { data: { responseData } },
                          });
                        }}
                      >
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                        <td>{item[3]}</td>
                        <td>{item[4]}</td>
                        <td>{item[5]}</td>
                        <td>{item[6]}</td>
                        <td>
                          <Button
                            variant="dark"
                            id={item[0]}
                            onClick={DutyDetails}
                          >
                            Duty Details
                          </Button>
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
                className="btn btn-dark"
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
