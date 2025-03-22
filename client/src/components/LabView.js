import React from "react";
import "./LabView.css";

const LabView = () => {
  return (
    <div className="columns">
        <div className="column" id="left">
          <img src="/images/profile.png" alt="profile" />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="column" id="right">
          <img src="/images/profile.png" alt="profile" />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>        
    </div>
  );
};

export default LabView;
