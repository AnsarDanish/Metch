import React from "react";

const alertTypeClasses = {
  success: "alert-success",
  error: "alert-danger",
  warning: "alert-warning",
  info: "alert-info",
};

export default function AlertCompo({
  type = "info",
  msg,
  close,
  cancellable = true,
}) {
  const alertClass = alertTypeClasses[type] || alertTypeClasses.info;

  return (
    <div className={`alert ${alertClass} d-flex justify-content-between align-items-center`} role="alert">
      <div>{msg}</div>
      {cancellable && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={close}
        />
      )}
    </div>
  );
}
