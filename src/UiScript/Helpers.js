function generateTimeSlots({ startDate, endDate, slots, skipDays = [] }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const headers = [];

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = dayNames[d.getDay()];
    if (!skipDays.includes(dayName)) {
      slots.forEach(({ from, to }) => {
        headers.push({
          label: `${dayName.slice(0, 3)} ${from}–${to}`,
        });
      });
    }
  }
  return headers;
}

function buildRows(standards, slots) {
  return Object.entries(standards).map(([std, subjects]) => {
    const row = { standard: std };
    slots.forEach((slot, i) => {
      row[slot.label] = subjects[i % subjects.length];
    });
    return row;
  });
}

function buildColumns(slots) {
  return [
    {
      accessorKey: "standard",
      header: () => (
        <div style={{ textAlign: "center" }}>
          Standard <br /> / Time
        </div>
      ),
    },
    ...slots.map((slot) => ({
      accessorKey: slot.label,
      header: slot.label,
    })),
  ];
}

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function DynamicExamTable() {
  // Example user inputs
  const inputs = {
    startDate: "2025-11-02",
    endDate: "2025-11-11",
    slots: [
      { from: "10:00 AM", to: "12:00 PM" },
      { from: "02:00 PM", to: "04:00 PM" },
    ],
    skipDays: ["Friday", "Sunday"],
  };

  const standards = {
    "Std 1": ["Math", "English", "Science", "History", "Geo"],
    "Std 2": ["Physics", "Chemistry", "Biology", "English"],
  };

  const slots = generateTimeSlots(inputs);
  const columns = buildColumns(slots);
  const rows = buildRows(standards, slots);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <table className="border-collapse border border-gray-400 w-full text-center">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <th key={idx} className="border border-gray-300 p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, idx) => (
                <td key={idx} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- Helpers --- */
function generateTimeSlots({ startDate, endDate, slots, skipDays = [] }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const headers = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = dayNames[d.getDay()];
    if (!skipDays.includes(dayName)) {
      slots.forEach(({ from, to }) => {
        headers.push({
          label: `${dayName.slice(0, 3)} ${from}–${to}`,
        });
      });
    }
  }
  return headers;
}

function buildRows(standards, slots) {
  return Object.entries(standards).map(([std, subjects]) => {
    const row = { standard: std };
    slots.forEach((slot, i) => {
      row[slot.label] = subjects[i % subjects.length];
    });
    return row;
  });
}

function buildColumns(slots) {
  return [
    {
      accessorKey: "standard",
      header: () => (
        <div style={{ textAlign: "center" }}>
          Standard <br /> / Time
        </div>
      ),
    },
    ...slots.map((slot) => ({
      accessorKey: slot.label,
      header: slot.label,
    })),
  ];
}
