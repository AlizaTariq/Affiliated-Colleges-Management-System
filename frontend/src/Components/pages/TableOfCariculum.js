import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import Button from "react-bootstrap/Button";
import "../css/TableOfCuriculum.css";
import * as XLSX from "xlsx";
import Login from "./Login";
import NavBar from "./NavBar";

export default function TableOfCariculum() {
  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.get("http://127.0.0.1:5000/set_data");
      setData(response.data);
    };
    retrieve();
  }, []);
  const [data_get, setData] = useState([]);
  const navigate = useNavigate();
  const [values, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setdata] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Set the number of items to display per page
  // Logic to calculate the current items to display based on current page and itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data_get.slice(indexOfFirstItem, indexOfLastItem);
  const accessToken = localStorage.getItem("access_token");
  const currentItems =
    filteredItems.length > 0
      ? filteredItems
      : data_get.slice(indexOfFirstItem, indexOfLastItem);
  const searching = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);

    if (searchValue === "") {
      setFilteredItems([]);
      return;
    }

    const filteredItems = data_get.filter((item) => {
      if (
        item[3].toString() === searchValue ||
        item[1].toLowerCase() === searchValue.toLowerCase() ||
        item[4].toLowerCase() === searchValue.toLowerCase() ||
        item[5].toLowerCase() === searchValue.toLowerCase() ||
        item[2].toString() === searchValue ||
        item[0].toString() === searchValue
      ) {
        return true;
      } else {
        return false;
      }
    });

    setFilteredItems(filteredItems);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    console.log(data_get.length);
    setCurrentPage(pageNumber);
  };
  function addfile(event) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (event) => {
      let arrayBuffer = fileReader.result;
      var workbook = XLSX.read(arrayBuffer, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      setdata(arraylist);
    };
  }
  function showOpenFileDialog() {
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      let files = input.files;
      setSelectedFile(files[0].name);
      const file = e.target.files[0];
      addfile(e);
    };
    input.click();
  }
  function uploadFile() {
    const url = "http://localhost:5000/getDataFromReact";
    const progressing = document.getElementById("progressbarvalue");
    const progressblue = document.getElementById("progressBlue");
    if (selectedFile != null) {
      var formData = new FormData();
      formData.append("fileName", JSON.stringify(selectedFile));
      formData.append("ArrayList", JSON.stringify(data));

      var config = {
        onUploadProgress: function (progressEvent) {
          const percentCompleted =
            Math.round(progressEvent.loaded / progressEvent.total) * 100;
          progressblue.setAttribute("value", percentCompleted);
          progressing.textContent = percentCompleted;
          if (percentCompleted === 100) {
            progressing.textContent = "Upload Completed!";
          }
        },
      };
    }

    axios
      .post(url, formData, config)
      .then((res) => console.log(res))
      .catch((err) => alert(err + "  OOPS! BAD REQUEST  "));
    // setSelectedFile(null);
    // document.getElementById("progressbarvalue").textContent = "0 %";
    // document.getElementById("progressBlue").value = 0;
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

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
            <button
              className="updBtn"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              Upload Curriculum
            </button>
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
                <td>ID</td>
                <td>Department</td>
                <td>Semester</td>
                <td>Year</td>
                <td>Course Code</td>
                <td>Course Name</td>
                <td>Course Details</td>
              </tr>
            </thead>
            <tbody>
              {currentItems
                ? currentItems.map((item) => (
                    <tr style={{ border: "1px" }} key={item[0]} id={item[0]}>
                      <td className="tableText">{item[0]}</td>
                      <td className="tableText">{item[1]}</td>
                      <td className="tableText">{item[2]}</td>
                      <td className="tableText">{item[3]}</td>
                      <td className="tableText">{item[4]}</td>
                      <td className="tableText">{item[5]}</td>
                      <td className="tableText">
                        <button
                          className="showDutyTableBtn"
                          id={item[0]}
                          onClick={() =>
                            window.open(
                              `/FORMPDF?${createSearchParams({
                                courseId: item[0],
                              }).toString()}`
                            )
                          }
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                : "Loading..."}
            </tbody>
          </table>

          {data_get.length > 7 ? (
            <Pagination
              pageCount={Math.ceil(data_get.length / itemsPerPage)} // Calculate total number of pages
              handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
            />
          ) : (
            <tr>{/* <td colSpan="6">Loading...</td> */}</tr>
          )}
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modaling">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Upload Carriculum
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setSelectedFile(null);
                  document.getElementById("progressbarvalue").textContent =
                    "0 %";
                  document.getElementById("progressBlue").value = 0;
                }}
                style={{ border: "white" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Upload Your File </label>
              <div id="modell">
                <div id="browsing">
                  <h1 id="iconing">
                    <i className="fa fa-download" aria-hidden="true"></i>
                  </h1>
                  <button className="updBtn" onClick={showOpenFileDialog}>
                    Import Data
                  </button>
                </div>
              </div>
              <div>
                <h6
                  style={{
                    fontWeight: "lighter",
                    fontSize: "8",
                  }}
                >
                  Your File Name: {selectedFile}{" "}
                </h6>
              </div>
              <div>
                <label id="progressbarvalue" htmlFor="progressBar">
                  0%
                </label>
                <progress id="progressBlue" value="0" max="100"></progress>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setSelectedFile(null);
                  document.getElementById("progressbarvalue").textContent =
                    "0 % ";
                  document.getElementById("progressBlue").value = 0;
                }}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={uploadFile}>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
