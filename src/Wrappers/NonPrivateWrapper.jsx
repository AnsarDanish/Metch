import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SMAYAContext } from "../Context";

export default function NonPrivateWrapper() {
  const { token } = useContext(SMAYAContext);

  if (!token) {
    return <Outlet />;
  }
  return <Navigate to={"/"} replace/>;
}
