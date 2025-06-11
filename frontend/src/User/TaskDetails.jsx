import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import Loading from "../components/Loading";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Avatar,
  Checkbox,
  List,
  Row,
  Col,
  Space,
  Button,
  Divider,
  Tooltip,
  Progress,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";

const { Title, Text, Paragraph } = Typography;

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTaskDetailsById = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID + id
      );
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...(task?.todoChecklist || [])];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST + taskId + "/todo",
        { todoChecklist }
      );
      if (response.status === 200) {
        setTask(response.data?.task || task);
      } else {
        // Optionally revert the toggle if the API call fails.
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    } catch (error) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      console.log(error);
    }
  };

  const handleClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }
  }, [id, getTaskDetailsById]);

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "in-progress":
        return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
      case "pending":
        return <ClockCircleOutlined style={{ color: "#8c8c8c" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading || !task) {
    return <Loading />;
  }

  const completedTasks =
    task.todoChecklist?.filter((item) => item.completed).length || 0;
  const totalTasks = task.todoChecklist?.length || 0;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <DashboardLayout defaultActiveKey="my-tasks">
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header Section */}
          <div style={{ marginBottom: "24px" }}>
            <Row justify="space-between" align="top">
              <Col span={18}>
                <Title level={2} style={{ margin: 0, color: "#262626" }}>
                  {task.title}
                </Title>
              </Col>
              <Col>
                <Badge
                  status={
                    task.status === "Completed" ? "success" : "processing"
                  }
                  text={
                    <Tag
                      color={
                        task.status === "Completed" ? "success" : "default"
                      }
                      style={{
                        borderRadius: "16px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {getStatusIcon(task.status)} {task.status}
                    </Tag>
                  }
                />
              </Col>
            </Row>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "32px" }}>
            <Title level={5} style={{ color: "#8c8c8c", marginBottom: "8px" }}>
              Description
            </Title>
            <Paragraph
              style={{ fontSize: "14px", lineHeight: "1.6", color: "#595959" }}
            >
              {task.description}
            </Paragraph>
          </div>

          {/* Task Meta Information */}
          <Row gutter={[32, 16]} style={{ marginBottom: "32px" }}>
            <Col xs={24} sm={8}>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    textTransform: "uppercase",
                  }}
                >
                  Priority
                </Text>
                <div style={{ marginTop: "4px" }}>
                  <Tag
                    color={getPriorityColor(task.priority)}
                    style={{
                      borderRadius: "4px",
                      fontWeight: "600",
                      fontSize: "12px",
                    }}
                  >
                    {task.priority}
                  </Tag>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    textTransform: "uppercase",
                  }}
                >
                  Due Date
                </Text>
                <div
                  style={{
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarOutlined
                    style={{ marginRight: "6px", color: "#8c8c8c" }}
                  />
                  <Text style={{ fontSize: "14px", fontWeight: "500" }}>
                    {formatDate(task.dueDate)}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    textTransform: "uppercase",
                  }}
                >
                  Assigned To
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Avatar.Group
                    size="small"
                    max={{
                      count: 3,
                      style: {
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                        cursor: "pointer",
                        fontSize: "12px",
                      },
                    }}
                  >
                    {task.assignedTo?.map((user) => (
                      <Tooltip
                        key={user._id}
                        title={`${user.name} (${user.email})`}
                      >
                        <Avatar
                          src={user.profileImageUrl}
                          icon={<UserOutlined />}
                          style={{ cursor: "pointer" }}
                        >
                          {user.name?.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>{" "}
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          {/* Progress Section */}
          <div style={{ marginBottom: "24px" }}>
            <Row
              justify="space-between"
              align="center"
              style={{ marginBottom: "8px" }}
            >
              <Text strong style={{ fontSize: "16px" }}>
                Progress
              </Text>
              <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
                {completedTasks} of {totalTasks} tasks completed
              </Text>
            </Row>
            <Progress
              percent={progressPercent}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              style={{ marginBottom: "16px" }}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <Title level={4} style={{ marginBottom: "16px", color: "#262626" }}>
              Todo Checklist
            </Title>
            <List
              dataSource={task.todoChecklist || []}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    padding: "12px 0",
                    borderBottom:
                      index === (task.todoChecklist?.length || 0) - 1
                        ? "none"
                        : "1px solid #f0f0f0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => updateTodoChecklist(index)}
                      style={{ marginRight: "12px" }}
                    />
                    <Text
                      style={{
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                        color: item.completed ? "#8c8c8c" : "#262626",
                        fontSize: "14px",
                      }}
                    >
                      {item.text}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <Title
                level={4}
                style={{ marginBottom: "16px", color: "#262626" }}
              >
                Attachments
              </Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                {task.attachments.map((attachment, index) => (
                  <Button
                    key={index}
                    type="text"
                    icon={<LinkOutlined />}
                    onClick={() => handleClick(attachment)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "8px 12px",
                      height: "auto",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      backgroundColor: "#fafafa",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <Text style={{ fontSize: "14px", color: "#1890ff" }}>
                      {String(index + 1).padStart(2, "0")} {attachment}
                    </Text>
                  </Button>
                ))}
              </Space>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetails;
