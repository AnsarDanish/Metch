import React from "react";
import "../css/Loader.css"
export default function Loader() {
  return (
    // <div
    //   className="position-fixed top-0 start-0 w-100 h-100 bg-transparent d-flex align-items-center justify-content-center"
    //   style={{
    //     zIndex: 1050,
    //     backdropFilter: "blur(6px)",
    //     WebkitBackdropFilter: "blur(6px)",
    //     backgroundColor: "rgba(255,255,255,0.2)",
    //   }}
    // >
    //   <div className="text-center">
    //     {/* Spinner with logo */}
    //     <div className="mb-3">
    //       {/* <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
    //         <span className="visually-hidden">Loading...</span>
    //       </div> */}
    //       <img
    //         src="./logo.png"
    //         alt="Logo"
    //         className="position-center spinner-border  spinner-border-sm "
    //         style={{ width: "4rem", height: "4rem" }}
    //       />
    //     </div>

    //     <p className=" mt-3 fw-semibold">Loading...</p>
    //   </div>
    // </div>

    <div id="preloader">
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
