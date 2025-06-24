import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Signup from "./auth/Signup";
import PrivateRoute from "./routes/PrivateRoute";
import AdminDashboard from "./Admin/Dashboard";
import UserDashboard from "./User/UserDashboard";
import UserProvider from "./context/userProvider";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import CreateTask from "./Admin/CreateTask";
import ManageTask from "./Admin/ManageTask";
import ManageUsers from "./Admin/ManageUsers";
import MyTasks from "./User/MyTasks";
import Login from "./auth/Login";
import TaskDetails from "./User/TaskDetails";
import NotFoundPage from "./components/NotFoundPage";
import ThemeProvider from "./context/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/team-members" element={<ManageUsers />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/task-details/:id" element={<TaskDetails />} />
            </Route>

            <Route path="/" element={<Root />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
export default App;
