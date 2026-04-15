import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role.toLowerCase() !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;