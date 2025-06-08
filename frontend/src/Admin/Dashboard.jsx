import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import { UserContext } from "../context/UserContext";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusSquareOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import AdminSummary from "../components/AdminSummary";
import RecentTasksSection from "../components/RecentTasksSection";
import TaskCharts from "../components/TaskCharts";
import { Space } from "antd";

const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
    path: "/admin/dashboard",
  },
  {
    key: "manage-tasks",
    label: "Manage Tasks",
    icon: <UnorderedListOutlined />,
    path: "/admin/tasks",
  },
  {
    key: "create-task",
    label: "Create Task",
    icon: <PlusSquareOutlined />,
    path: "/admin/create-task",
  },
  {
    key: "team-members",
    label: "Team Members",
    icon: <TeamOutlined />,
    path: "/admin/team-members",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    path: "logout",
    isLogout: true,
  },
];

function Dashboard() {
  useUserAuth();

  const { user } = useContext(UserContext);
  console.log(user);


  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);


  return (
    <>
      <DashboardLayout menuItems={SIDEBAR_ITEMS} defaultActiveKey="dashboard">
        <Space
          direction="vertical"
          size="large" 
          style={{ width: "100%" }} 
        >
          <AdminSummary dashboardData={dashboardData} />
          <RecentTasksSection dashboardData={dashboardData} />
          <TaskCharts data={dashboardData?.charts} />
        </Space>
      </DashboardLayout>{" "}
    </>
  );
}

export default Dashboard;
