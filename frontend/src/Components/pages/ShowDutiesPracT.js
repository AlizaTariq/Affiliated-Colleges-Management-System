// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "react-bootstrap/Button";
// import Pagination from "./Pagination";
// import Home from "./Home";
// import axios from "axios";
// import ShowDutyDetail from "./ShowDutyDetail";
// import "../css/ShowDutiesPracT.css";
// import Login from "./Login";
// import NavBar from "./NavBar";

// export default function ShowDutiesPracT() {
//   const navigate = useNavigate();
//   const [duties, setDuties] = useState([]);
//   const [values, setSearchValue] = useState("");
//   const [list1, setList1] = useState([]);
//   const [filteredList, setFilteredList] = useState(list1);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [submitDetailValue, setSubmitDetailValue] = useState(false);
//   const [query, setQuery] = useState("");
//   const accessToken = localStorage.getItem("access_token");

//   useEffect(() => {
//     const retrieve = async () => {
//       const response = await axios.get(
//         "http://127.0.0.1:5000/getAllPraticalList"
//       );
//       setList1(response.data);
//       setFilteredList(response.data);
//       console.log(list1);

//       // setData(response.data);
//     };
//     retrieve();
//   }, []);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(filteredList.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = list1.slice(indexOfFirstItem, indexOfLastItem);
//   const [serialNumber, setSerialNumber] = useState(1);

//   const handlePageChange = (pageNumber) => {
//     // {console.log(list1.length)}
//     setSerialNumber((pageNumber - 1) * itemsPerPage + 1);
//     setCurrentPage(pageNumber);
//   };

//   const handleChange = (event) => {
//     const searchQuery = event.target.value;
//     setQuery(searchQuery);
//     const filteredResults = list1.filter((objList) =>
//       Object.keys(objList).some((key) =>
//         objList[key]
//           .toString()
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       )
//     );
//     setFilteredList(filteredResults);
//     setCurrentPage(1); // Reset page to 1 when filtering
//   };

//   const handleOnClickTableDetail = (event, item) => {
//     console.log("clllll");
//     console.log("Item is : ", item);
//     setSubmitDetailValue(true);
//     setCurrentItem(item);
//   };

//   if (submitDetailValue === true) {
//     return <ShowDutyDetail data={currentItem} />;
//   }

//   if (!accessToken) {
//     return <Login />; // Render the Login component if access token doesn't exist
//   }

//   return (
//     <>
//       <NavBar />
//       {currentItem ? (
//         <ShowDutyDetail data={currentItem} />
//       ) : (
//         <div className="container">
//           <div className="d-flex flex-row-reverse bd-highlight">
//             <p className="form-inline">
//               {/* onChange={event => setSearchValue(event.target.value)}  */}
//               <input
//                 id="searchingfeedback"
//                 className="form-control mr-sm-2 mt-"
//                 onChange={(event) => setSearchValue(event.target.value)}
//                 type="search"
//                 placeholder="Search"
//               />
//             </p>
//           </div>

//           <div className="d-flex flex-row bd-highlight">
//             <p className="form-inline"></p>
//           </div>
//           <div>
//             <table className="table">
//               {/* Table header */}
//               <thead>
//                 <tr className="headingTable">
//                   <td>Sr. No</td>
//                   <td>Course Code</td>
//                   <td>Course Name</td>
//                   <td>College</td>
//                   <td>Department</td>
//                   <td>Batch</td>
//                   <td>View Detail</td>
//                 </tr>
//               </thead>
//               {/* Table body */}
//               <tbody>
//                 {currentItems.length ? (
//                   currentItems
//                     .filter((item) => {
//                       if (values === "") {
//                         return item;
//                       } else if (
//                         item[1].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         return item;
//                       } else if (
//                         item[2].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         return item;
//                       } else if (
//                         item[3].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         return item;
//                       } else if (
//                         item[4].toLowerCase().includes(values.toLowerCase())
//                       ) {
//                         return item;
//                       } else if (
//                         item[5].toString().includes(values.toLowerCase())
//                       ) {
//                         return item;
//                       }
//                     })
//                     .map((item, index) => (
//                       <tr
//                         style={{ border: "1px" }}
//                         key={serialNumber + index}
//                         id={serialNumber + index}
//                       >
//                         <td className="tableText">{serialNumber + index}</td>

//                         <td className="tableText">{item[3]}</td>
//                         <td className="tableText">{item[4]}</td>
//                         <td className="tableText">{item[1]}</td>
//                         <td className="tableText">{item[2]}</td>
//                         <td className="tableText">{item[5]}</td>
//                         <td>
//                           <button
//                             className="showDutyTableBtn"
//                             id="submitTableBtn"
//                             onClick={(e) => handleOnClickTableDetail(e, item)}
//                           >
//                             Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6">Loading...</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             {list1.length > 10 ? (
//               <Pagination
//                 pageCount={Math.ceil(list1.length / itemsPerPage)} // Calculate total number of pages
//                 handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
//               />
//             ) : (
//               <tr>{/* <td colSpan="6">Loading...</td> */}</tr>
//             )}
//           </div>
//         </div>
//       )}
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
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Pagination from "./Pagination";
import Home from "./Home";
import axios from "axios";
import ShowDutyDetail from "./ShowDutyDetail";
import "../css/ShowDutiesPracT.css";
import Login from "./Login";
import NavBar from "./NavBar";

export default function ShowDutiesPracT() {
  const navigate = useNavigate();
  const [duties, setDuties] = useState([]);
  const [values, setSearchValue] = useState("");
  const [list1, setList1] = useState([]);
  const [filteredList, setFilteredList] = useState(list1);
  const [currentItem, setCurrentItem] = useState(null);
  const [submitDetailValue, setSubmitDetailValue] = useState(false);
  const [query, setQuery] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.get(
        "http://127.0.0.1:5000/getAllPraticalList"
      );
      setList1(response.data);
      setFilteredList(response.data);
      console.log(list1);

      // setData(response.data);
    };
    retrieve();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = list1.slice(indexOfFirstItem, indexOfLastItem);
  const [serialNumber, setSerialNumber] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const currentItems =
    filteredItems.length > 0
      ? filteredItems
      : list1.slice(indexOfFirstItem, indexOfLastItem);
  const searching = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);

    if (searchValue === "") {
      setFilteredItems([]);
      return;
    }

    const filteredItems = list1.filter((item) => {
      if (
        item[3].toLowerCase() === searchValue.toLowerCase() ||
        item[1].toLowerCase() === searchValue.toLowerCase() ||
        item[4].toLowerCase() === searchValue.toLowerCase() ||
        item[5].toString() === searchValue ||
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
    // {console.log(list1.length)}
    setSerialNumber((pageNumber - 1) * itemsPerPage + 1);
    setCurrentPage(pageNumber);
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
    setCurrentPage(1); // Reset page to 1 when filtering
  };

  const handleOnClickTableDetail = (event, item) => {
    console.log("clllll");
    console.log("Item is : ", item);
    setSubmitDetailValue(true);
    setCurrentItem(item);
  };

  if (submitDetailValue === true) {
    return <ShowDutyDetail data={currentItem} />;
  }

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <>
      <NavBar />
      {currentItem ? (
        <ShowDutyDetail data={currentItem} />
      ) : (
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
            </p>
          </div>

          <div className="d-flex flex-row bd-highlight">
            <p className="form-inline"></p>
          </div>
          <div>
            <table className="table">
              {/* Table header */}
              <thead>
                <tr className="headingTable">
                  <td>Sr. No</td>
                  <td>Course Code</td>
                  <td>Course Name</td>
                  <td>College</td>
                  <td>Department</td>
                  <td>Batch</td>
                  <td>View Detail</td>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {currentItems.length ? (
                  currentItems.map((item, index) => (
                    <tr
                      style={{ border: "1px" }}
                      key={serialNumber + index}
                      id={serialNumber + index}
                    >
                      <td className="tableText">{serialNumber + index}</td>

                      <td className="tableText">{item[3]}</td>
                      <td className="tableText">{item[4]}</td>
                      <td className="tableText">{item[1]}</td>
                      <td className="tableText">{item[2]}</td>
                      <td className="tableText">{item[5]}</td>
                      <td>
                        <button
                          className="showDutyTableBtn"
                          id="submitTableBtn"
                          onClick={(e) => handleOnClickTableDetail(e, item)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
            {list1.length > 10 ? (
              <Pagination
                pageCount={Math.ceil(list1.length / itemsPerPage)} // Calculate total number of pages
                handlePageChange={handlePageChange} // Pass the handlePageChange function as a prop
              />
            ) : (
              <tr>{/* <td colSpan="6">Loading...</td> */}</tr>
            )}
          </div>
        </div>
      )}
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
