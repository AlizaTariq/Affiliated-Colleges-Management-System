import React from "react";
// import profile from "../../../public/assets/ProfilePics/empty.png";
const Avatar = ({ src, name }) => {
  return (
    <div className="bg-white w-full p-md-5 p-2 card" style={{marginTop: "24%"}}>
      {/* <img
        src={profile}
        alt={name}
        width={200}
        height={200}
        className="text-center mx-auto rounded-circle image-avatar"
      ></img> */}
    </div>
  );
};

export default Avatar;
