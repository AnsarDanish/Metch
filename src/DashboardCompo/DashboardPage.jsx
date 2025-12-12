import React from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  Trophy,
  BookOpen,
  Star,
  TrendingUp,
  Badge,
} from "lucide-react";

export default function DashboardPage() {
  const attendanceData = [
    { class: "Class 10-A", present: 28, total: 30, percentage: 93.3 },
    { class: "Class 9-B", present: 25, total: 28, percentage: 89.3 },
    { class: "Class 8-C", present: 30, total: 32, percentage: 93.8 },
    { class: "Class 7-A", present: 26, total: 29, percentage: 89.7 },
  ];

  const upcomingEvents = [
    { title: "Annual Sports Day", date: "2025-09-15", time: "9:00 AM", type: "sports" },
    { title: "Parent-Teacher Meeting", date: "2025-09-08", time: "2:00 PM", type: "meeting" },
    { title: "Science Exhibition", date: "2025-09-22", time: "10:00 AM", type: "academic" },
    { title: "Cultural Program", date: "2025-10-02", time: "6:00 PM", type: "cultural" },
  ];

  const achievements = [
    { title: "State Science Olympiad - Gold Medal", student: "Aryan Sharma", class: "Class 10-A", date: "2025-08-15" },
    { title: "Inter-School Debate Competition - 1st Prize", student: "Priya Patel", class: "Class 9-B", date: "2025-08-10" },
    { title: "National Mathematics Contest - Top 10", student: "Rahul Kumar", class: "Class 8-C", date: "2025-07-28" },
    { title: "Regional Art Competition - Winner", student: "Sneha Gupta", class: "Class 7-A", date: "2025-07-20" },
  ];

  const studentStats = { totalStudents: 1250, presentToday: 1180, attendanceRate: 94.4 };
  const teacherStats = { totalTeachers: 85, attendanceRate: 96.5 };

  // Helper for badge color
  const getBadgeClass = (percentage) => {
    if (percentage >= 90) return "bg-success text-white";
    return "bg-warning text-dark";
  };

  const getEventColor = (type) => {
    switch (type) {
      case "sports": return "bg-primary text-white";
      case "meeting": return "bg-success text-white";
      case "academic": return "bg-purple text-white";
      default: return "bg-warning text-dark";
    }
  };

  return (
    <div className="container my-4">

      {/* Stats Overview */}
      <div className="row g-3 mb-4">
        {/* Total Students */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Students</p>
                <h5>{studentStats.totalStudents}</h5>
                <p className="text-success small d-flex align-items-center">
                  <TrendingUp className="me-1" size={16} /> +5% from last month
                </p>
              </div>
              <div className="p-3 rounded bg-primary">
                <GraduationCap className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Present Today */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Present Today</p>
                <h5>{studentStats.presentToday}</h5>
                <p className="text-success small">{studentStats.attendanceRate}% attendance</p>
              </div>
              <div className="p-3 rounded bg-success">
                <UserCheck className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Teachers */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Teachers</p>
                <h5>{teacherStats.totalTeachers}</h5>
                <p className="text-success small">{teacherStats.attendanceRate}% present</p>
              </div>
              <div className="p-3 rounded bg-purple">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Achievements</p>
                <h5>{achievements.length}</h5>
                <p className="text-success small">This month</p>
              </div>
              <div className="p-3 rounded bg-warning">
                <Trophy className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3">
        {/* Today's Attendance */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              Today's Attendance
            </div>
            <div className="card-body">
              {attendanceData.slice(0, 4).map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded bg-light">
                  <div>
                    <p className="mb-0">{item.class}</p>
                    <small className="text-muted">{item.present}/{item.total} students</small>
                  </div>
                  <span className={`badge ${getBadgeClass(item.percentage)}`}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              Upcoming Events
            </div>
            <div className="card-body">
              {upcomingEvents.slice(0, 4).map((event, index) => (
                <div key={index} className="d-flex align-items-center p-2 mb-2 rounded bg-light">
                  <div className={`p-2 rounded me-3 ${getEventColor(event.type)}`}>
                    {event.type === "sports" ? <Trophy size={16} /> :
                     event.type === "meeting" ? <Users size={16} /> :
                     event.type === "academic" ? <BookOpen size={16} /> :
                     <Star size={16} />}
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-0">{event.title}</p>
                    <small className="text-muted">{event.date} • {event.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
