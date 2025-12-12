import { SMAYAContext } from "../Context";
import React, { useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function PrivateWrapper() {
  const { token } = useContext(SMAYAContext);
  if (token) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
}
