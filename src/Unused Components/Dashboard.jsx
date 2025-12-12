import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import SidebarContents from "../DashboardCompo/SidebarContents";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Mobile Header */}
      <header className="d-lg-none bg-light border-bottom p-2">
        <div className="d-flex align-items-center justify-content-between">
          <Button
            variant="outline-primary"
            onClick={() => setIsMobileMenuOpen(true)}
            className="d-flex align-items-center gap-2"
          >
            <Menu size={24} />
            Menu
          </Button>
        </div>
      </header>

      {/* Mobile Offcanvas */}
      <div
        className={`offcanvas offcanvas-start ${isMobileMenuOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ visibility: isMobileMenuOpen ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Dashboard</h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={() => setIsMobileMenuOpen(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContents onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <div className="d-flex flex-grow-1">
        {/* Desktop Sidebar */}
        <aside className="d-none d-lg-block bg-light border-end" style={{ width: "250px" }}>
          <SidebarContents />
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
