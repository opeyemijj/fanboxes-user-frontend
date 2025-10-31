import React from "react";

const LoadingSpinner = () => (
  <div style={{
    display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginLeft: 25, marginRight: 25
  }}>
    <div style={{
      width: 20, height: 20, border: "4px solid #ccc", borderTop: "4px solid #3498db",
      borderRadius: "50%", animation: "spin 1s linear infinite"
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
