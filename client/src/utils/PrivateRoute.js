import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children, role }) => {
  const { user, role: userRole } = useAuth();

  if (!user || (role && userRole !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
