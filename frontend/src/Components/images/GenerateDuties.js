// import React, { useState } from "react";
// import "../css/generateDuties.css";

// const generatePracticalDuties = (event) => {
//   event.preventDefault();
//   console.log("In genrate practical duty");
//   const [dutiesGenerated, setDutiesGenerated] = useState(false);

//   fetch("http://localhost:3000/generatePracDuties")
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         console.log("duty genrated");
//         const { success } = data;
//         setDutiesGenerated(success);
//       }
//     })
//     .catch((error) => console.error("Error:", error));
// };

// const GenerateDuties = () => {
//   return (
//     <>
//       <div>
//         <button onClick={handleButtonClick}>Generate Duties</button>
//         {dutiesGenerated ? (
//           <p>Duties generated successfully.</p>
//         ) : (
//           <p>Duties not generated.</p>
//         )}
//       </div>

//       <div className="ShowDutyMainDiv">
//         <div className="searchBar">
//           <input
//             id="searchBarInput"
//             type="text"
//             placeholder="Enter keywords..."
//             // value={query}
//             // onChange={handleChange}
//             size="50"
//           />
//         </div>
//         <div className="buttons">
//           <button
//             onClick={generatePracticalDuties}
//             id="fallBtn"
//             className="showDutyBtn"
//             value="1"
//           >
//             Generate Fall Duties
//           </button>
//           <button
//             // onClick={handleOnClickDutyBtn}
//             id="springBtn"
//             className="showDutyBtn"
//             value="2"
//           >
//             Generate Spring Duties
//           </button>
//           <button
//             // onClick={handleOnClickDutyBtn}
//             id="ViewDutyBtn"
//             className="showDutyBtn"
//             value="3"
//           >
//             View Duty Detail
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default GenerateDuties;

// import React, { useState } from "react";

// const GenerateDutiesButton = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");

//   const handleButtonClick = () => {
//     fetch("/generatePracDuties")
//       .then((response) => response.json())
//       .then((data) => {
//         const { success } = data;
//         setShowPopup(true);
//         setPopupMessage(
//           success ? "Duties generated successfully." : "Duties not generated."
//         );
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   const handlePopupClose = () => {
//     setShowPopup(false);
//     setPopupMessage("");
//   };

//   return (
//     <div>
//       <button onClick={handleButtonClick}>Generate Duties</button>
//       {showPopup && (
//         <div className="popup">
//           <div className="popup-content">
//             <p>{popupMessage}</p>
//             <button onClick={handlePopupClose}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateDutiesButton;

// import React from "react";

// const GenerateDutiesButton = () => {
//   const handleButtonClick = () => {
//     fetch("/generatePracDuties")
//       .then((response) => response.json())
//       .then((data) => {
//         const { success } = data;
//         const message = success
//           ? "Duties generated successfully."
//           : "Duties not generated.";
//         window.alert(message);
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   return (
//     <div>
//       <button onClick={handleButtonClick}>Generate Duties</button>
//     </div>
//   );
// };

// export default GenerateDutiesButton;
import NavBar from "./NavBar";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Login from "./Login";

import checkedHere from "../images/checked.png";
import deleteHere from "../images/delete.png";

import picHere from "../images/list.png";

// import NavBar from "./NavBar";
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
    {/* <NavBar/> */}
    <div>

      <Button variant="contained" onClick={handleButtonClick}>
        Generate Duties
      </Button>

      <Dialog open={open} onClose={handleClose} className="custom-dialog" >
      <div className="forcenterOne">
              <img className="forcenter pic" src={picHere} alt="generateDuties-pic" />
            </div>

            {/* extra content added 196 - 208 otherwise comment it and use 191 - 193 instead */}
        {/* <DialogContent>
          {
            dutyStatus ? (
              <div className="forcenterOne">
              <img className="forcenter pic" src={deleteHere} alt="delete" />
            </div>
            ) : (
              <div className="forcenterOne">
              <img className="forcenter pic" src={checkedHere} alt="checked" />
            </div>
            )
          }
      </DialogContent> */}

        <DialogTitle className="dialogTitle"><b><center>Duty Status</center></b></DialogTitle>
        <DialogContent><center>{dutyStatus}</center></DialogContent>
        <DialogActions className="custom-dialog-actions">
          <Button className="btnClose" onClick={handleClose}><b>Close</b></Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
};

export default GenerateDutiesButton;
