import React from "react";
import { BookOpen, Calendar, FileText } from "lucide-react";

export default function AcademicCalendar() {
  const academicCalendar = [
    { event: "First Term Begins", date: "2025-06-01", type: "term" },
    { event: "Mid-Term Exams", date: "2025-07-15", type: "exam" },
    { event: "First Term Ends", date: "2025-08-30", type: "term" },
    { event: "Second Term Begins", date: "2025-09-15", type: "term" },
    { event: "Annual Exams", date: "2025-12-01", type: "exam" },
    { event: "Winter Break", date: "2025-12-20", type: "holiday" },
  ];

  // Helper for color classes
  const typeClasses = {
    term: { bg: "bg-primary bg-opacity-10 text-primary", badge: "text-primary border border-primary" },
    exam: { bg: "bg-danger bg-opacity-10 text-danger", badge: "text-danger border border-danger" },
    holiday: { bg: "bg-success bg-opacity-10 text-success", badge: "text-success border border-success" },
  };

  // Helper for icons
  const typeIcons = {
    term: <BookOpen size={16} />,
    exam: <FileText size={16} />,
    holiday: <Calendar size={16} />,
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Academic Calendar 2025-26</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {academicCalendar.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <div
                        className={`d-flex align-items-center justify-content-center rounded me-2 p-2 ${typeClasses[item.type].bg}`}
                      >
                        {typeIcons[item.type]}
                      </div>
                      <span className={`badge ${typeClasses[item.type].badge}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="card-title">{item.event}</h5>
                    <p className="card-text text-muted d-flex align-items-center mb-0">
                      <Calendar size={16} className="me-1" />
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
