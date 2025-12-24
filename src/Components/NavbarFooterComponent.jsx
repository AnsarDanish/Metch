import { Outlet } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import ThemeToggle from "./ThemeToggle";
// import FooterComponent from "./FooterComponent";

const NavbarFooterComponent = ({ children }) => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavbarComponent />
        <div style={{ flex: 1 }}>{children ?? <Outlet />}</div>
        {/* <FooterComponent /> */}
      </div>
    </>
  );
};

export default NavbarFooterComponent;
