import React from "react";
import { Trophy, Award } from "lucide-react";

export default function AchievementsPage() {
  const achievements = [
    {
      title: "State Science Olympiad - Gold Medal",
      student: "Aryan Sharma",
      class: "Class 10-A",
      date: "2025-08-15",
    },
    {
      title: "Inter-School Debate Competition - 1st Prize",
      student: "Priya Patel",
      class: "Class 9-B",
      date: "2025-08-10",
    },
    {
      title: "National Mathematics Contest - Top 10",
      student: "Rahul Kumar",
      class: "Class 8-C",
      date: "2025-07-28",
    },
    {
      title: "Regional Art Competition - Winner",
      student: "Sneha Gupta",
      class: "Class 7-A",
      date: "2025-07-20",
    },
  ];

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Recent Achievements</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="col-12">
                <div className="card shadow-sm hover-shadow">
                  <div className="card-body d-flex justify-content-between align-items-start">
                    <div className="d-flex">
                      <div className="bg-warning bg-opacity-25 text-warning p-2 rounded me-3 d-flex align-items-center justify-content-center">
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h5 className="card-title mb-1">{achievement.title}</h5>
                        <p className="mb-1">
                          <span className="fw-medium">{achievement.student}</span> • {achievement.class}
                        </p>
                        <p className="text-muted mb-0">
                          {new Date(achievement.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <Award size={24} className="text-warning" />
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
