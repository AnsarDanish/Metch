import React from "react";

export default function FeesPage() {
  const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

  const feeStructure = [
    { grade: "Class 1-5", tuition: 15000, transport: 3000, meals: 2500, activities: 1500 },
    { grade: "Class 6-8", tuition: 18000, transport: 3000, meals: 2500, activities: 2000 },
    { grade: "Class 9-10", tuition: 22000, transport: 3500, meals: 3000, activities: 2500 },
    { grade: "Class 11-12", tuition: 28000, transport: 3500, meals: 3000, activities: 3000 },
  ];

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0 text-decoration-underline">Fee Structure (Annual)</h5>
        </div>
        <div className="card-body p-2">
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th>Grade</th>
                  <th>Tuition Fee</th>
                  <th>Transport</th>
                  <th>Meals</th>
                  <th>Activities</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee, index) => (
                  <tr key={index}>
                    <td className="fw-medium">{fee.grade}</td>
                    <td>{formatINR(fee.tuition)}</td>
                    <td>{formatINR(fee.transport)}</td>
                    <td>{formatINR(fee.meals)}</td>
                    <td>{formatINR(fee.activities)}</td>
                    <td className="fw-semibold">
                      {formatINR(fee.tuition + fee.transport + fee.meals + fee.activities)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
