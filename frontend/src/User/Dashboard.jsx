import { useContext } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import { UserContext } from "../context/UserContext";

function Dashboard() {
  console.log("Dashboard component rendered");
  
  useUserAuth();

  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}

export default Dashboard;
