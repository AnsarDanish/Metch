import React from "react";
import LazyTemplate from "../Components/LazyTemplate";

export default function convertJsonToRoutes (json) {
  if(json.length === 0) return;
  return json.map((r) => ({
    path: r.path || "",
    element: React.createElement(LazyTemplate, { name: r.element }),
    children: r.children ? convertJsonToRoutes(r.children) : []
  }));
};
