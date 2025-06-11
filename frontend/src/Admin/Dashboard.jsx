import { API_PATHS } from "../utils/apiPaths";
import Dashboard from "../components/Dashboard";

function AdminDashboard() {
  return <Dashboard path={API_PATHS.TASKS.GET_ADMIN_DASHBOARD_DATA} />;
}

export default AdminDashboard;
