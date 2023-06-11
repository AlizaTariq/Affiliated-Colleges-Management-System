import React, { useState } from "react";
//  npm install axios
import axios from "axios";
//  import
import * as XLSX from "xlsx";
import Login from "./Login";
import NavBar from "./NavBar";
export default function Carriculum() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setdata] = useState({});
  const accessToken = localStorage.getItem("access_token");

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
    const url = "http://127.0.0.1:5000/getDataFromReact";
    const progressing = document.getElementById("progressbarvalue");
    const progressblue = document.getElementById("progressBlue");
    var formData = new FormData();
    formData.append("fileName", JSON.stringify(selectedFile));
    formData.append("ArrayList", JSON.stringify(data));
    const config = {
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
    axios
      .post(url, formData, config)
      .then((res) => console.log(res))
      .catch((err) => alert(err + "  OOPS! BAD REQUEST  "));
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar></NavBar>
      <nav
        className="container navbar navbar-expand-lg navbar-light bg-light"
        style={{ marginTop: "10px" }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <button
            type="button"
            className="btn btn-secondary"
            data-toggle="modal"
            data-target="#exampleModal"
            style={{ margin: 8 }}
          >
            Upload Carriculum
          </button>
        </div>
      </nav>
    </>
  );
}
