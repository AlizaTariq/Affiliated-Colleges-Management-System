// import React, { useEffect, useState } from "react";

// import { useNavigate, createSearchParams } from "react-router-dom";
// import axios from "axios";
// import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import Pagination from "./Pagination";
// import * as XLSX from "xlsx";
// import AllDuties from "./AllDuties";
// import "../css/ShowDutiesPracT.css";
// import Login from "./Login";
// import NavBar from "./NavBar";
// import Schedule from "./Schedule";

// export default function ShowDutiesEx() {
//   const navigate = useNavigate();
//   const [duties, setDuties] = useState([]);
//   const [values, setSearchValue] = useState("");
//   const accessToken = localStorage.getItem("access_token");

//   useEffect(() => {
//     const retrieve = async () => {
//       const response = await axios.get(
//         "http://127.0.0.1:5000/getNotAssignedDuties"
//       );
//       setDuties(response.data);
//     };
//     retrieve();
//   }, []);

//   const CreateDutyExm = () => {
//     navigate("/Exam_Schedule");
//   };
//   const sendDutyExm = (event) => {
//     const responseData = event.target.id;
//     navigate("/CourseCard", { state: { data: { responseData } } });
//   };
//   const OtherDuties = () => {
//     navigate("/AllDuties");
//   };
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(7); // Set the number of items to display per page
//   // Logic to calculate the current items to display based on current page and itemsPerPage
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = duties.slice(indexOfFirstItem, indexOfLastItem);
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   if (!accessToken) {
//     return <Login />; // Render the Login component if access token doesn't exist
//   }
//   return (
//     <>
//       <NavBar />
//       <div className="container">
//         <div className="d-flex flex-row-reverse bd-highlight">
//           <p className="form-inline">
//             {/* onChange={event => setSearchValue(event.target.value)}  */}
//             <input
//               id="searching"
//               className="form-control mr-sm-2 mt-"
//               onChange={(event) => setSearchValue(event.target.value)}
//               type="search"
//               placeholder="Search"
//             />
//             <Button
//               className="m-2 btnDuty1"
//               variant="dark"
//               onClick={CreateDutyExm}
//             >
//               Create Duties
//             </Button>
//             <Button
//               className="m-2 btnDuty2"
//               variant="dark"
//               onClick={OtherDuties}
//             >
//               Other Duties
//             </Button>
//           </p>
//         </div>
//         <div className="d-flex flex-row bd-highlight">
//           <p className="form-inline"></p>
//         </div>
//         <div>
//           <table className="table">
//             <thead>
//               <tr className="headingTable">
//                 <td>Id</td>
//                 <td>Examiner Name</td>
//                 <td>Examiner Email</td>
//                 <td>Course</td>
//                 <td>Semester</td>
//                 <td>Department</td>
//                 <td>Action</td>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems
//                 ? currentItems
//                     .filter((item) => {
//                       if (values === "") {
//                         //if query is empty
//                         return item;
//                       } else if (
//                         item[2].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         //returns filtered array
//                         return item;
//                       } else if (
//                         item[3].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         //returns filtered array
//                         return item;
//                       }
//                     })
//                     .map((item) => (
//                       <tr
//                         style={{ border: "1px" }}
//                         key={item[0]}
//                         id={item[0]}
//                         onClick={() => {
//                           const responseData = item[0];
//                           navigate("/CourseCard", {
//                             state: { data: { responseData } },
//                           });
//                         }}
//                       >
//                         <td className="tableText">{item[0]}</td>
//                         <td className="tableText">{item[1]}</td>
//                         <td className="tableText">{item[2]}</td>
//                         <td className="tableText">{item[3]}</td>
//                         <td className="tableText">{item[4]}</td>
//                         <td className="tableText">{item[5]}</td>
//                         <td>
//                           <button
//                             id={item[0]}
//                             className="showDutyTableBtn"
//                             onClick={sendDutyExm}
//                           >
//                             Send Duty
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                 : "Loading..."}
//             </tbody>
//           </table>

//           {duties.length > 7 ? (
//             <Pagination
//               pageCount={Math.ceil(duties.length / itemsPerPage)} // Calculate total number of pages
//               handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
//             />
//           ) : (
//             <tr>{/* <td colSpan="6">Loading...</td> */}</tr>
//           )}
//         </div>
//       </div>
//       <div
//         className="modal fade"
//         id="dutyModal"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">
//                 Duty Detail
//               </h5>
//               <button
//                 type="button"
//                 className="close"
//                 data-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">&times;</span>
//               </button>
//             </div>
//             <div className="modal-body"></div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-dark"
//                 data-dismiss="modal"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";

import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "./Pagination";
import * as XLSX from "xlsx";
import AllDuties from "./AllDuties";
import "../css/ShowDutiesPracT.css";
import Login from "./Login";
import NavBar from "./NavBar";
import Schedule from "./Schedule";

export default function ShowDutiesEx() {
  const navigate = useNavigate();
  const [duties, setDuties] = useState([]);
  const [values, setSearchValue] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.get(
        "http://127.0.0.1:5000/getNotAssignedDuties"
      );
      setDuties(response.data);
    };
    retrieve();
  }, []);

  const CreateDutyExm = () => {
    navigate("/Exam_Schedule");
  };
  const sendDutyExm = (event) => {
    const responseData = event.target.id;
    navigate("/CourseCard", { state: { data: { responseData } } });
  };
  const OtherDuties = () => {
    navigate("/AllDuties");
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
        item[0].toString() === searchValue ||
        item[3].toLowerCase() === searchValue.toLowerCase() ||
        item[1].toLowerCase() === searchValue.toLowerCase() ||
        item[4].toString() === searchValue ||
        item[5].toLowerCase() === searchValue.toLowerCase() ||
        item[2].toLowerCase() === searchValue.toLowerCase()
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
              style={{ marginTop: "5px" }}
              id="searching"
              className="form-control mr-sm-2"
              onChange={(event) => searching(event)}
              type="search"
              placeholder="Search"
            />
            <Button
              className="m-2 btnDuty1"
              variant="dark"
              onClick={CreateDutyExm}
            >
              Create Duties
            </Button>
            <Button
              className="m-2 btnDuty2"
              variant="dark"
              onClick={OtherDuties}
            >
              Other Duties
            </Button>
          </p>
        </div>
        <div className="d-flex flex-row bd-highlight">
          <p className="form-inline"></p>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr className="headingTable">
                <td>Id</td>
                <td>Examiner Name</td>
                <td>Examiner Email</td>
                <td>Course</td>
                <td>Semester</td>
                <td>Department</td>
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
                        navigate("/CourseCard", {
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
                      <td>
                        <button
                          id={item[0]}
                          className="showDutyTableBtn"
                          onClick={sendDutyExm}
                        >
                          Send Duty
                        </button>
                      </td>
                    </tr>
                  ))
                : "Loading..."}
            </tbody>
          </table>

          {duties.length > 7 ? (
            <Pagination
              pageCount={Math.ceil(duties.length / itemsPerPage)} // Calculate total number of pages
              handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
            />
          ) : (
            <tr>{/* <td colSpan="6">Loading...</td> */}</tr>
          )}
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
