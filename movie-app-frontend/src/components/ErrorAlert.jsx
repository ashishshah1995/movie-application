import React from "react";

const ErrorAlert = ({ message, onRetry }) => (
  <div className="alert alert-danger text-center">
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-primary" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorAlert;
