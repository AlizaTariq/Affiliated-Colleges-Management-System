import React from "react";
// import abc from "../../../../Back-End/Static/ProfilePics/empty.png";
const Avatar = ({ src, name }) => {
  const imagePath = "D:/FYP/Final code/Affiliated_College_Management_System/front-end/src/Static/ProfilePics/empty.png";
  return (
    <div className="bg-white w-full p-md-5 p-2 card">
      <img
        // src={"/assets/images/user-placeholder.jpg"}
        src={imagePath}
        alt={name}
        width={200}
        height={200}
        className="text-center mx-auto rounded-circle image-avatar"
        // style={{ width: "200px", height: "200px" }}
      ></img>
      <h4 className="heading-4 text-center mt-4">{name}</h4>
    </div>
  );
};

export default Avatar;
