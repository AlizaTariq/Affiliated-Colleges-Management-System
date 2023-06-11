import React from "react";
import { title, setTitle } from "react";

import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

//import "./SendingRequest.css";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { FaStar } from "react-icons/fa";
import Login from "./Login";
import NavBar from "./NavBar";
const colors = {
  orange: "FF8C00",
  grey: "#061b28",
};

const styles = {
  container: {
    display: "block8",
    fexDirection: "column",
    alignItems: "center",
  },
};
const SideBar = () => {
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [hoverValue, setHoverValue] = useState(undefined);

  const handleClick = (value) => {
    setCurrentValue(value);
  };
  const handleMouseOver = (value) => {
    setHoverValue(value);
  };
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <div
      style={{ display: "flex", height: "107vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#061b28">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Admin Portal
          </a>
        </CDBSidebarHeader>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <a href="/home" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </a>
            <a href="/Profile" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
            </a>
            <a href="/TableOfCariculum" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="table">Curriculum</CDBSidebarMenuItem>
            </a>

            <a href="/PracCollegeReview" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="paste">
                College Reviews
              </CDBSidebarMenuItem>
            </a>
            <a href="/PracTeacherFeedback" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="paste">
                Teacher Reviews
              </CDBSidebarMenuItem>
            </a>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "20px 5px",
            }}
          >
            {" "}
            <b>Affiliated College Management System</b>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default SideBar;
