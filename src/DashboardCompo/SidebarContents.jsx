import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  Trophy,
  Bell,
  BarChart3,
  User,
} from "lucide-react";

const SidebarContents = ({ onItemClick = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { id: "teachers", label: "Teachers", icon: Users, path: "teachers" },
    { id: "students", label: "Students", icon: GraduationCap, path: "students" },
    { id: "parents", label: "Parents", icon: User, path: "parents" },
    { id: "attendance", label: "Attendance", icon: UserCheck, path: "attendance" },
    { id: "fees", label: "Fee Structure", icon: DollarSign, path: "fees" },
    { id: "calendar", label: "Academic Calendar", icon: Calendar, path: "calendar" },
    { id: "events", label: "Events", icon: Bell, path: "events" },
    { id: "achievements", label: "Achievements", icon: Trophy, path: "achievements" },
  ];

  const activeTab = sidebarItems.find((item) => {
    if (item.path.startsWith("/")) return location.pathname === item.path;
    return location.pathname.startsWith(`/dashboard/${item.path}`);
  })?.id;

  return (
    <div className="d-flex flex-column h-100 p-2">
      <nav className="nav flex-column">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`btn btn-sm d-flex align-items-center mb-1 justify-content-start ${
                isActive ? "btn-primary text-white" : "btn-outline-secondary text-dark"
              }`}
              style={{ width: "100%" }}
              onClick={() => {
                onItemClick();
                navigate(item.path);
              }}
            >
              <item.icon className="me-2" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarContents;
