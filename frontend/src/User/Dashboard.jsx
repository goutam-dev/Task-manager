import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Dashboard() {
  console.log("Dashboard component rendered");


  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}

export default Dashboard;
