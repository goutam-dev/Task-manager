import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loading from "../components/Loading";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Button,
  Space,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

const { Title, Text } = Typography;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading user details:", error);
      message.error("Failed to download user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <DashboardLayout defaultActiveKey="team-members">
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
        align="center"
      >
        <Title level={3}>Team Members</Title>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadReport}
        >
          Download Report
        </Button>
      </Space>

      <Row gutter={[24, 24]}>
        {users.map((user) => (
          <Col key={user._id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <Avatar size={72} src={user.profileImageUrl} />
                <Title level={4} style={{ marginTop: 12 }}>
                  {user.name}
                </Title>
                <Text type="secondary">{user.email}</Text>
              </div>

              <Space style={{ justifyContent: "space-around", width: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <Text
                    strong
                    style={{ display: "block", fontSize: 20, color: "#faad14" }}
                  >
                    {user?.pendingTasks ?? 0}
                  </Text>
                  <Text strong style={{ color: "#faad14" }}>
                    Pending
                  </Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text
                    strong
                    style={{ display: "block", fontSize: 20, color: "#1890ff" }}
                  >
                    {user?.inProgressTasks ?? 0}
                  </Text>
                  <Text strong style={{ color: "#1890ff" }}>
                    In Progress
                  </Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text
                    strong
                    style={{ display: "block", fontSize: 20, color: "#52c41a" }}
                  >
                    {user?.completedTasks ?? 0}
                  </Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    Completed
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </DashboardLayout>
  );
}

export default ManageUsers;
