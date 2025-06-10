import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  console.log("Dashboard component rendered");

  const { user } = useContext(UserContext);

  return (
    <DashboardLayout defaultActiveKey="dashboard">
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </DashboardLayout>
  );
}

export default Dashboard;
