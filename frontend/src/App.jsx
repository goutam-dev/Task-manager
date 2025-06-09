import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import Signup from "./auth/Signup";
import PrivateRoute from "./routes/PrivateRoute"
import AdminDashboard from "./Admin/Dashboard"
import UserDashboard from "./User/Dashboard";
import UserProvider from "./context/userProvider";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import CreateTask from "./Admin/CreateTask";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          <Route path="/" element={<Root />} />
          
        </Routes>


      </BrowserRouter>
    </UserProvider>
  );
}


const Root = () => {
    const {user,loading} = useContext(UserContext);
    if(loading) return <Outlet/>

    if(!user) return <Navigate to="/login" />

    return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />
};
export default App;
