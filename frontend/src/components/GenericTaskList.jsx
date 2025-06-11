import React from "react";
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
import { useTasks } from "../hooks/useTasks";

const { Title, Text } = Typography;

export default function GenericTaskList({
  title,
  defaultActiveKey,
  onCardClick,
  showDownload = false,
  onDownload,
}) {
  const [filterStatus, setFilterStatus] = React.useState(defaultActiveKey);
  const { allTasks, statusSummary, loading } = useTasks(filterStatus);

  if (loading) return <Loading />;

  const tabs = [
    { key: "All", label: <Badge count={statusSummary.all || 0}>All</Badge> },
    {
      key: "Pending",
      label: <Badge count={statusSummary.pendingTasks || 0}>Pending</Badge>,
    },
    {
      key: "In Progress",
      label: (
        <Badge count={statusSummary.inProgressTasks || 0}>In Progress</Badge>
      ),
    },
    {
      key: "Completed",
      label: (
        <Badge count={statusSummary.completedTasks || 0} offset={[-8, -2]}>
          Completed
        </Badge>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
        {showDownload && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={onDownload}
          >
            Download Report
          </Button>
        )}
      </Space>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Tabs
          activeKey={filterStatus}
          onChange={setFilterStatus}
          items={tabs}
          centered
          size="large"
          tabBarStyle={{ overflow: "visible", whiteSpace: "nowrap" }}
        />
      </div>

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
                onClick={() => onCardClick(task)}
                style={{ height: "100%" }}
                title={
                  <Space>
                    <Text ellipsis style={{ maxWidth: 100 }} strong>
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
                      text={task.priority}
                    />
                  </Space>
                }
                extra={
                  <Tooltip
                    title={`Due: ${moment(task.dueDate).format("DD MMM YYYY")}`}
                  >
                    <FileTextOutlined />
                  </Tooltip>
                }
              >
                <Text type="secondary">
                  Start: {moment(task.startDate).format("DD MMM YYYY")}
                </Text>
                <br />
                <Text type="secondary">
                  Due: {moment(task.dueDate).format("DD MMM YYYY")}
                </Text>
                <Text ellipsis style={{ marginTop: 8, display: "block" }}>
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
                        <Avatar src={user.profileImageUrl} />
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
  );
}
