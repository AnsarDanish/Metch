import React from "react";

export default function AttendancePage() {
  const attendanceData = [
    { class: "Class 10-A", present: 28, total: 30, percentage: 93.3 },
    { class: "Class 9-B", present: 25, total: 28, percentage: 89.3 },
    { class: "Class 8-C", present: 30, total: 32, percentage: 93.8 },
    { class: "Class 7-A", present: 26, total: 29, percentage: 89.7 },
  ];

  // Helper to get badge color
  const getBadgeClass = (percentage) => {
    if (percentage >= 95) return "bg-success text-white";
    if (percentage >= 85) return "bg-warning text-dark";
    return "bg-danger text-white";
  };

  // Helper to get progress bar color
  const getProgressClass = (percentage) => {
    if (percentage >= 95) return "bg-success";
    if (percentage >= 85) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Class-wise Attendance</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {attendanceData.map((item, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">{item.class}</h5>
                      <span className={`badge ${getBadgeClass(item.percentage)}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Present: {item.present}</span>
                      <span>Total: {item.total}</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar ${getProgressClass(item.percentage)}`}
                        role="progressbar"
                        style={{ width: `${item.percentage}%` }}
                        aria-valuenow={item.percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
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
