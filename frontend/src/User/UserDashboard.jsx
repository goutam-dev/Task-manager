import { API_PATHS } from "../utils/apiPaths";
import Dashboard from "../components/Dashboard";

function UserDashboard() {
  return <Dashboard path={API_PATHS.TASKS.GET_USER_DASHBOARD_DATA} />;
}

export default UserDashboard;
