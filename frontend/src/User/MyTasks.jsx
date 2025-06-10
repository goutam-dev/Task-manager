import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import {
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Avatar,
  Progress,
  Badge,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Loading from "../components/Loading";

const { Title, Text } = Typography;

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: "" },
      });
      setStatusSummary(data.statusSummary || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (status) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: status === "All" ? "" : status },
      });
      setAllTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTasks("All");
  }, []);

  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  const handleClick = (taskId) => {
    navigate(`/admin/task-details/:${taskId}`);
  };

  const tabItems = [
    { key: "All", label: <Badge count={statusSummary.all || 0}>All</Badge> },
    {
      key: "Pending",
      label: (
        <Badge status="warning" count={statusSummary.pendingTasks || 0}>
          Pending
        </Badge>
      ),
    },
    {
      key: "In Progress",
      label: (
        <Badge status="processing" count={statusSummary.inProgressTasks || 0}>
          In Progress
        </Badge>
      ),
    },
    {
      key: "Completed",
      label: (
        <Badge status="success" count={statusSummary.completedTasks || 0}>
          Completed
        </Badge>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <DashboardLayout defaultActiveKey="my-tasks">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Header with Download button */}
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            My Tasks
          </Title>
        </Space>

        {/* Centered Tabs */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            activeKey={filterStatus}
            onChange={setFilterStatus}
            items={tabItems}
            centered
            size="large"
          />
        </div>

        {/* Empty state per tab */}
        {allTasks.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Text type="secondary">
              {filterStatus === "All"
                ? "No tasks found."
                : `No ${filterStatus.toLowerCase()} tasks found.`}
            </Text>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {allTasks.map((task) => (
              <Col key={task._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => handleClick(task._id)}
                  style={{ height: "100%" }}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    },
                  }}
                  title={
                    <Space>
                      <Text
                        ellipsis={{ tooltip: true }}
                        style={{
                          maxWidth: 100,
                          display: "inline-block",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        strong
                      >
                        {task.title}
                      </Text>
                      <Badge
                        color={
                          task.priority === "High"
                            ? "red"
                            : task.priority === "Medium"
                            ? "orange"
                            : "green"
                        }
                        text={`${task.priority}`}
                      />
                    </Space>
                  }
                  extra={
                    <Tooltip
                      title={`Due: ${moment(task.dueDate).format(
                        "DD MMM YYYY"
                      )}`}
                    >
                      <FileTextOutlined />
                    </Tooltip>
                  }
                >
                  <div>
                    <Text type="secondary">
                      Start: {moment(task.startDate).format("DD MMM YYYY")}
                    </Text>
                    <br />
                    <Text type="secondary">
                      Due: {moment(task.dueDate).format("DD MMM YYYY")}
                    </Text>
                  </div>
                  <Text
                    ellipsis={{ tooltip: true }}
                    style={{
                      maxHeight: 400,
                      maxWidth: 400,
                      display: "inline-block",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      marginTop: 8,
                    }}
                    strong
                  >
                    {task.description}
                  </Text>
                  <Progress
                    percent={task.progress}
                    size="small"
                    status={task.progress === 100 ? "success" : "active"}
                  />
                  <Text style={{ marginTop: 4 }}>
                    {task.completedTodoCount} of {task.totalTodoCount} todos
                    completed
                  </Text>
                  <Space
                    style={{
                      marginTop: 8,
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Space>
                      {task.assignedTo.map((user) => (
                        <Tooltip key={user._id} title={user.name}>
                          <Avatar src={user.profileImageUrl} alt={user.name} />
                        </Tooltip>
                      ))}
                    </Space>
                    {task.attachments?.length > 0 && (
                      <Space>
                        <PaperClipOutlined />
                        <Text>{task.attachments.length}</Text>
                      </Space>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </DashboardLayout>
  );
};

export default MyTasks;
