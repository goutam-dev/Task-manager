import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Loading from "../components/Loading";

const PrivateRoute = ({ allowedRoles }) => {
  const { user,loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }


  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  

  if (!allowedRoles.includes(user?.role)) {
    console.log("Unauthorized");
    
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace state={{ from: location }}/>;
    } else if (user.role === "member") {
      return <Navigate to="/user/dashboard" replace state={{ from: location }}/>;
    }
    return <Navigate to="/login" replace state={{ from: location }}/>;

  }

  return <Outlet />;
};

export default PrivateRoute;
