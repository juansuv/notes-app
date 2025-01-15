import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { access_token } = useSelector((state) => state.auth);

  if (!access_token) {
    // Redirige al login si no está autenticado
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
