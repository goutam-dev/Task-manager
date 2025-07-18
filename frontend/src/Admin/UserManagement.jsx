import { useState, useEffect, useContext, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Loading from "../components/Loading";
import UserDetailView from "../components/UserDetailView";
import { Row, Col, Card, Avatar, Typography, Input, Space, message, Button } from "antd";
import { SearchOutlined, LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { debounce } from "lodash";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import UserProfileEditForm from "../components/UserProfileEditForm";

const { Title, Text } = Typography;
const { Search } = Input;

const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

export default function UserManagement() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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
      message.error("Failed to fetch users");
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

  const handleUserCardClick = (user) => {
    setSelectedUser(user);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    setShowDetailView(false);
    setSelectedUser(null);
    getUsers(searchQuery);
  };

  const handleFinishEdit = async (values) => {
    setFormLoading(true);
    try {
      const { data } = await axiosInstance.put(
        API_PATHS.USERS.UPDATE_USER_BY_ADMIN(selectedUser._id),
        values
      );
      message.success("User profile updated successfully");
      handleUserUpdated();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update user profile");
    } finally {
      setFormLoading(false);
    }
  };

  if (currentUser?.role !== "admin") {
    return <div style={{ padding: 32 }}><Title level={3}>Forbidden</Title><Text>You do not have access to this page.</Text></div>;
  }

  if (showDetailView && selectedUser) {
    return (
      <DashboardLayout defaultActiveKey="user-management">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToList}
            style={{ marginBottom: 16 }}
          >
            Back to User List
          </Button>
          <Card
            style={{
              maxWidth: 500,
              margin: "0 auto",
              borderRadius: 16,
              background: isDarkMode ? "rgb(15 26 47)" : undefined,
              color: isDarkMode ? "#fff" : undefined,
            }}
            styles={{ body: { padding: 24 } }}
            title={
              <Space align="center">
                <Avatar size={48} src={getSecureImageUrl(selectedUser.profileImageUrl)} />
                <span>{selectedUser.name} <span style={{ color: '#888', fontSize: 14 }}>({selectedUser.email})</span></span>
              </Space>
            }
          >
            <UserProfileEditForm
              initialValues={{
                name: selectedUser.name,
                email: selectedUser.email,
                profileImageUrl: selectedUser.profileImageUrl,
              }}
              onFinish={handleFinishEdit}
              loading={formLoading}
              imageUploading={imageUploading}
              setImageUploading={setImageUploading}
              onCancel={handleBackToList}
              isDarkMode={isDarkMode}
              showPasswordField={true}
            />
          </Card>
        </Space>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout defaultActiveKey="user-management">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3}>User Management</Title>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <Search
            placeholder="Search users by name or email..."
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
              {searchQuery ? "No users found matching your search." : "No users found."}
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
                </Card>
              </Col>
            ))}
          </Row>
        ))}
      </Space>
    </DashboardLayout>
  );
}