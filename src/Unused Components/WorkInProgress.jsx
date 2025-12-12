import React from "react";
import "../css/WorkInProgress.css";

const WorkInProgress = () => {
  return (
    // <div className="d-flex justify-content-center align-items-center w-100" style={{height:"95vh"}}>
      <div className="d-flex flex-column align-items-center gap-1">
        <div className="loader"></div>
        <h5>Loading...</h5>
      </div>
  )
};

export default WorkInProgress;
