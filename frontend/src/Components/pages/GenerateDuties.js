import NavBar from "./NavBar";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Login from "./Login";

const GenerateDutiesButton = () => {
  const [open, setOpen] = useState(false);
  const [dutyStatus, setDutyStatus] = useState("");
  const accessToken = localStorage.getItem("access_token");

  const handleButtonClick = () => {
    fetch("/generatePracDuties")
      .then((response) => response.json())
      .then((data) => {
        const { success } = data;
        setDutyStatus(
          success ? "Duties generated successfully." : "Duties not generated."
        );
        setOpen(true);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleClose = () => {
    setOpen(false);
    setDutyStatus("");
  };

  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }
  return (
    <>
      <div>
        <Button variant="contained" onClick={handleButtonClick}>
          Generate Duties
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Duty Status</DialogTitle>
          <DialogContent>{dutyStatus}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default GenerateDutiesButton;
