import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ No user → go login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Wrong role → go login
  if (user.role.toLowerCase() !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;