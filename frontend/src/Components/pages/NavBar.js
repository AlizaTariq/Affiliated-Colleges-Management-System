import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";

import "../css/NavBar.css";
import "../css/common.css";

// import "../App.css"
import Home from "./Home";
//import "../css/NavBar.css";
import adminpic from "../images/adminLogo.svg";

const handleLogoutBtn = () => {
  console.log("Handle logout btn");
  localStorage.removeItem("access_token"); // Remove access token from local storage
};

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="NabBar1 navbar-white-text">
      <Container fluid>
        <img
          src={adminpic}
          className="adminpic"
          onClick={() => {
            navigate("/home");
          }}
        />

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/loginData">Login</Nav.Link>

            <NavDropdown
              title="Duties"
              className="dropdownOne"
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item href="/showduties" className="itemhere">
                Practical Duties
              </NavDropdown.Item>

              <NavDropdown.Item href="/sendRequest" className="itemhere">
                Assign Practical Duties
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="/ShowDutiesEx" className="itemhere">
                Examiner Duties
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/notifications">Notifications</Nav.Link>
            <Nav.Link href="/TableOfCariculum">Curriculum</Nav.Link>
            <NavDropdown
              title="Others"
              className="dropdownOne"
              id="navbarScrollingDropdown2"
            >
              <NavDropdown.Item href="/TeacherReview" className="itemhere">
                Teacher Review
              </NavDropdown.Item>

              <NavDropdown.Item href="/CollegeReview" className="itemhere">
                College Review
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav>
            <Nav.Link href="/loginData">
              <Button className="logoutBtn" onClick={handleLogoutBtn}>
                Logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
