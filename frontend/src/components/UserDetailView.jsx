import { useState, useEffect, useContext } from "react";
import DashboardLayout from "./DashboardLayout";
import Loading from "./Loading";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Button,
  Space,
  message,
  Tag,
  Progress,
  Empty,
  Divider,
  List,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const { Title, Text, Paragraph } = Typography;

function UserDetailView({ user, onBack }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?._id) {
      fetchUserDetails(user._id);
    }
  }, [user]);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint for user details
      const response = await axiosInstance.get(
        `${API_PATHS.USERS.GET_USER_DETAILS}/${userId}`
      );
      console.log(response.data);

      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ff4d4f";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#52c41a";
      case "in progress":
        return "#1890ff";
      case "pending":
        return "#faad14";
      case "overdue":
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleOutlined />;
      case "in progress":
        return <ClockCircleOutlined />;
      case "pending":
        return <ExclamationCircleOutlined />;
      case "overdue":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  // Helper to ensure HTTPS for image URLs
  const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

  if (loading) {
    return <Loading />;
  }

  return (
    <DashboardLayout defaultActiveKey="team-members">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header with Back Button */}
        <Space align="center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            type="text"
            size="large"
          >
            Back to Team Members
          </Button>
        </Space>

        {/* User Profile Section */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            background: isDarkMode ? "rgb(15 26 47)" : undefined,
            color: isDarkMode ? "#fff" : undefined,
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={getSecureImageUrl(user.profileImageUrl)}
                icon={<UserOutlined />}
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ margin: 0 }}>
                  {user.name}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {user.email}
                </Text>
                {user.role && (
                  <Tag
                    color="blue"
                    style={{ fontSize: 14, padding: "4px 12px" }}
                  >
                    {user.role}
                  </Tag>
                )}
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Task Summary */}
          <Row gutter={[24, 24]} justify="center">
            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{ display: "block", fontSize: 28, color: "#faad14" }}
                >
                  {userDetails?.statusSummary?.pendingTasks ??
                    user?.pendingTasks ??
                    0}
                </Text>
                <Text strong style={{ color: "#faad14", fontSize: 16 }}>
                  Pending Tasks
                </Text>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{ display: "block", fontSize: 28, color: "#1890ff" }}
                >
                  {userDetails?.statusSummary?.inProgressTasks ??
                    user?.inProgressTasks ??
                    0}
                </Text>
                <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                  In Progress
                </Text>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{ display: "block", fontSize: 28, color: "#52c41a" }}
                >
                  {userDetails?.statusSummary?.completedTasks ??
                    user?.completedTasks ??
                    0}
                </Text>
                <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                  Completed
                </Text>
              </div>
            </Col>

            {/* New Col for Overdue */}
            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{ display: "block", fontSize: 28, color: "#ff4d4f" }}
                >
                  {userDetails?.statusSummary?.overdue ??
                    user?.overdueTasks ??
                    0}
                </Text>
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  Overdue Tasks
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tasks List */}
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Assigned Tasks ({userDetails?.statusSummary?.all ?? 0})
            </Title>
          }
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            background: isDarkMode ? "rgb(15 26 47)" : undefined,
            color: isDarkMode ? "#fff" : undefined,
          }}
        >
          {userDetails?.tasks?.length > 0 ? (
            <List
              dataSource={userDetails.tasks}
              renderItem={(task) => (
                <List.Item
                  style={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    background: isDarkMode ? "rgb(15 26 47)" : undefined,
                    color: isDarkMode ? "#fff" : undefined,
                  }}
                >
                  <div
                    onClick={() =>
                      navigate("/admin/create-task", {
                        state: { taskID: task._id, isUpdate: true },
                      })
                    }
                    style={{ width: "100%", cursor: "pointer" }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} lg={16}>
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Space align="center" wrap>
                            <Title level={5} style={{ margin: 0 }}>
                              {task.title}
                            </Title>
                            <Tag
                              color={getStatusColor(task.status)}
                              icon={getStatusIcon(task.status)}
                            >
                              {task.status}
                            </Tag>
                            <Tag color={getPriorityColor(task.priority)}>
                              {task.priority} Priority
                            </Tag>
                          </Space>

                          <Paragraph
                            ellipsis={{ rows: 2, expandable: true }}
                            style={{ margin: 0, color: "#666" }}
                          >
                            {task.description}
                          </Paragraph>

                          <Space wrap>
                            {task.dueDate && (
                              <Space size="small">
                                <CalendarOutlined />
                                <Text type="secondary">
                                  Due:{" "}
                                  {moment(task.dueDate).format("MMM DD, YYYY")}
                                </Text>
                              </Space>
                            )}

                            {task.assignedTo?.length > 1 && (
                              <Space size="small">
                                <TeamOutlined />
                                <Text type="secondary">
                                  {task.assignedTo.length} assignees
                                </Text>
                              </Space>
                            )}

                            {task.attachments?.length > 0 && (
                              <Space size="small">
                                <PaperClipOutlined />
                                <Text type="secondary">
                                  {task.attachments.length} attachment(s)
                                </Text>
                              </Space>
                            )}
                          </Space>
                        </Space>
                      </Col>

                      <Col xs={24} lg={8}>
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          {task.totalTodoCount > 0 && (
                            <div>
                              <Text strong>Progress:</Text>
                              <Progress
                                percent={task.progress || 0}
                                size="small"
                                style={{ marginTop: 4 }}
                              />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {task.completedTodoCount || 0} of{" "}
                                {task.totalTodoCount} tasks completed
                              </Text>
                            </div>
                          )}

                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Created:{" "}
                              {moment(task.createdAt).format("MMM DD, YYYY")}
                            </Text>
                          </div>

                          {task.updatedAt !== task.createdAt && (
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Updated: {moment(task.updatedAt).fromNow()}
                              </Text>
                            </div>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description="No tasks assigned to this user"
              style={{ padding: "40px 0" }}
            />
          )}
        </Card>
      </Space>
    </DashboardLayout>
  );
}

export default UserDetailView;
