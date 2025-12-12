import React from "react";
import "../css/NotFoundError.css";
import { useNavigate } from "react-router-dom";
export default function NotFoundError() {
  const navigate = useNavigate();
  return (
    <div className="page-404">
      <div className="outer">
        <div className="middle">
          <div className="inner">
            <div className="inner-circle">
              <i className="fa fa-home"></i>
              <span>404</span>
            </div>
            <div>
              <span className="inner-status">Oops! You're lost</span>
              <span className="inner-detail text-nowrap">We can not find the page you're looking for.</span>
            </div>
            <div className="text-center">
              <button className="btn btn-info" onClick={() => navigate(-1)}>
                <i className="fa fa-home"></i>
                Return Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
