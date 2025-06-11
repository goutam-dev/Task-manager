import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Loading from "../components/Loading";
import Forbidden from "../components/Forbidden";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Forbidden />;
  }

  return <Outlet />;
};

export default PrivateRoute;
