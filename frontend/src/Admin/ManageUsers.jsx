import { useState, useEffect, useCallback, useContext } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loading from "../components/Loading";
import UserDetailView from "../components/UserDetailView"; // New component we'll create
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Button,
  Space,
  message,
  Input,
} from "antd";
import { DownloadOutlined, SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { debounce } from "lodash";
import { ThemeContext } from "../context/ThemeContext";

const { Title, Text } = Typography;
const { Search } = Input;

// Helper to ensure HTTPS for image URLs
const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

function ManageUsers() {
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getUsers = async (search) => {
    setIsSearching(true);
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, {
        params: { search }
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch team members");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const debouncedGetUsers = useCallback(
    debounce((search) => getUsers(search), 300),
    []
  );

  useEffect(() => {
    debouncedGetUsers(searchQuery);
    return () => {
      debouncedGetUsers.cancel();
    };
  }, [searchQuery, debouncedGetUsers]);

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

  const handleUserCardClick = (user) => {
    setSelectedUser(user);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedUser(null);
  };

  // Remove: if (loading) return <Loading />;

  // Show detailed view if a user is selected
  if (showDetailView && selectedUser) {
    return (
      <UserDetailView 
        user={selectedUser} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <DashboardLayout defaultActiveKey="team-members">
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%" }}
      >
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
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

        <div style={{ position: "relative", maxWidth: 400 }}>
          <Search
            placeholder="Search team members by name or email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            style={{ maxWidth: 400 }}
            suffix={isSearching ? <LoadingOutlined style={{ color: "#1890ff", fontSize: 20 }} spin /> : null}
          />
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Loading />
          </div>
        )}
        {!loading && (users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">
              {searchQuery ? "No team members found matching your search." : "No team members found."}
            </Text>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {users.map((user) => (
              <Col key={user._id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  onClick={() => handleUserCardClick(user)}
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                    background: isDarkMode ? "rgb(15 26 47)" : undefined,
                    color: isDarkMode ? "#fff" : undefined,
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Avatar size={72} src={getSecureImageUrl(user.profileImageUrl)} />
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
                      <Text strong style={{ color: "#faad14", fontSize: 13 }}>
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
                      <Text strong style={{ color: "#1890ff", fontSize: 13 }}>
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
                      <Text strong style={{ color: "#52c41a", fontSize: 13 }}>
                        Completed
                      </Text>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Text
                        strong
                        style={{ display: "block", fontSize: 20, color: "#faad14" }}
                      >
                        {user?.overdueTasks ?? 0}
                      </Text>
                      <Text strong style={{ color: "#faad14", fontSize: 13 }}>
                        Overdue
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ))}
      </Space>
    </DashboardLayout>
  );
}

export default ManageUsers;