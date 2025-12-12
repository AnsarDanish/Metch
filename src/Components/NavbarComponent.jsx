import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SMAYAContext } from "../Context";
import { FaCaretLeft, FaCaretUp, FaRegUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import { GalleryVerticalEnd, HamburgerIcon, School } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { RiCloseLargeFill } from "react-icons/ri";
const NavbarComponent = () => {
  const { userInfo, tokenName, logOut } = useContext(SMAYAContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem(tokenName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menus = [
    {
      name: "Admission",
      path: "/admission",
    },
    // {
    //   name: "How it Works?",
    //   path: "/howItWorks",
    // },
    // {
    //   name: "FAQs",
    //   path: "/faqspage",
    // },
  ];

  return (
    <nav className="w-100 border bg-light shadow-sm position-sticky top-0 z-3">
      <div className="d-flex justify-content-between align-items-center px-3 py-2">
        {/* Brand */}
        <div
          className="d-flex align-items-center gap-2"
          style={{
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded p-1">
            <GalleryVerticalEnd size={16} />
          </div>
          <h5 className="fw-bold mb-0">SchoolMaya</h5>
        </div>

        {/* Desktop Menu */}
        <div className="d-none d-lg-flex justify-content-center gap-4 fw-medium">
          {menus.map((data, i) => (
            <button
              key={i}
              onClick={() => navigate(data.path)}
              className="btn btn-link text-dark text-decoration-none hover-primary"
            >
              {data.name}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {token && userInfo ? (
            <div
              className="d-none d-lg-flex align-items-center gap-3 position-relative"
              onMouseEnter={() =>
                window.innerWidth >= 992 && setDropdownOpen(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 992 && setDropdownOpen(false)
              }
            >
              <div
                className="position-relative cursor-pointer"
                onClick={() => {
                  if (window.innerWidth >= 992)
                    setDropdownOpen((prev) => !prev);
                }}
              >
                <div className="d-flex align-items-center gap-2 cursor-pointer mx-2">
                  <span className="fw-large fw-semibold text-md-medium cursor-pointer">
                    {userInfo.username}
                  </span>
                  <FaRegUserCircle size={34} />
                </div>

                {dropdownOpen && (
                  <div
                    className="position-absolute ms-auto end-0 mt- bg-white border rounded shadow-sm py-2"
                    style={{ minWidth: "180px", top: "2.2rem" }}
                  >
                    <button
                      onClick={() => {
                        logOut();
                        setDropdownOpen(false);
                      }}
                      className="dropdown-item btn btn-link text-start text-danger px-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-none d-md-flex align-items-center gap-">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-link text-primary text-decoration-none fw-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="btn btn-link text-dark text-decoration-none fw-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="d-flex d-lg-none align-items-center gap-3 position-relative">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="btn btn-link text-dark p-0"
          >
            {mobileMenuOpen ? (
              <FaXmark size={24} />
            ) : (
              <GiHamburgerMenu size={24} />
            )}
          </button>

          {mobileMenuOpen && (
            <div
              className="position-fixed bg-white border rounded shadow d-inline-block p-2 d-flex flex-column"
              style={{
                right: "20px",
                top: "2.55rem",
                // width: "fit-content",
                // zIndex: 1050,
              }}
            >
              {menus.map((data, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(data.path);
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-link d-block w-auto text-start text-dark fw-medium"
                >
                  {data.name}
                </button>
              ))}

              {!token || !userInfo ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-link d-block w-100 text-start text-danger fw-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-link d-block w-100 text-start text-danger fw-medium"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logOut();
                    }}
                    className="btn btn-link d-block w-100 text-start text-danger fw-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavbarComponent;
