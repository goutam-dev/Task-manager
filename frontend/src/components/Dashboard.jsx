import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import DashboardLayout from "../components/DashboardLayout";
import axiosInstance from "../utils/axiosConfig";
import AdminSummary from "../components/AdminSummary";
import RecentTasksSection from "../components/RecentTasksSection";
import TaskCharts from "../components/TaskCharts";
import { Space } from "antd";
import Loading from "../components/Loading";

function Dashboard({ path }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  console.log(user);

  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(path);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <DashboardLayout defaultActiveKey="dashboard">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <AdminSummary dashboardData={dashboardData} />
          <RecentTasksSection dashboardData={dashboardData} />
          <TaskCharts data={dashboardData?.charts} />
        </Space>
      </DashboardLayout>{" "}
    </>
  );
}

export default Dashboard;
