// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Card from "react-bootstrap/Card";

// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// //import '../css/scheduler.css'
// import { useState, useEffect } from "react";
// import axios from "axios";

// const MyForm = () => {
//   const [colleges, setColleges] = useState([]);
//   const [ClgDropdownValue, setClgDropdownValue] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:3000/getAllCollegeList")
//       .then((response) => response.json())
//       .then((data) => setColleges(data))
//       .then((data1) => console.log("college list is ", data1))
//       .catch((err) => console.log(err));
//   });

//   const handleChange = (event) => {
//     setClgDropdownValue(event.target.value);
//     console.log(event.target.value);
//   };

//   return (
//     <>
//       {/* {listd1}
//     {console.log(listd1)}
//     <select>
//              {listd1.map((num, index) => {
//                return <option key={index} value={num}>{num}</option>
//              })}
//     </select> */}
//       <div className="SchedulePage">
//         <br />
//         <br />

//         <Container fluid>
//           <Row className="courseInfo">
//             <Col lg="1"></Col>
//             <Col lg="10">
//               <div className="schHeading">SEND REQUEST</div>
//             </Col>
//             <Col lg="1"></Col>
//           </Row>{" "}
//           <br />
//           <br />
//           <Row className="courseInfo">
//             <Col lg="1"></Col>

//             <Col lg="10">
//               <div className="schHeading">ADD COURSE INFORMATION</div>
//               <br />
//               <br />

//               <Form>
//                 {/* ROW 1 */}
//                 <Container>
//                   <Row>
//                     <Col lg="6">
//                       <Form.Group className="mb-3" controlId="formBasicCkgName">
//                         <Form.Label>College Name</Form.Label>
//                         <Form.Select
//                           value={ClgDropdownValue}
//                           onChange={handleChange}
//                         >
//                           {colleges.map((num, index) => {
//                             return (
//                               <option key={index} value={num}>
//                                 {num}
//                               </option>
//                             );
//                           })}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>

//                     <Col lg="6">
//                       <Form.Group
//                         className="mb-3"
//                         controlId="formBasicPassword"
//                         inline
//                       >
//                         <Form.Label>Department</Form.Label>

//                         <Form.Select aria-label="Default select example">
//                           <option value="cs">CS</option>
//                           <option value="it">IT</option>
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Row>
//                     <Col lg="10"></Col>
//                     <Col lg="2">
//                       <Button className="schButton" type="submit">
//                         Send Request
//                       </Button>
//                     </Col>
//                   </Row>
//                 </Container>
//               </Form>

//               <br />
//               <br />
//             </Col>
//             <Col lg="1"></Col>
//           </Row>
//           <br />
//           <br />
//         </Container>
//       </div>
//     </>
//   );
// };

// export default MyForm;
