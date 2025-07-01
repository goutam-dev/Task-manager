import React, { useCallback } from "react";
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
  Input,
  Select,
  Grid,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Loading from "../components/Loading";
import { useTasks } from "../hooks/useTasks";
import { debounce } from "lodash";
import TaskProgress from "./TaskProgress";
import { ThemeContext } from "../context/ThemeContext";

const { Title, Text } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

// Helper to ensure HTTPS for image URLs
const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

export default function GenericTaskList({
  title,
  defaultActiveKey,
  onCardClick,
  showDownload = false,
  onDownload,
}) {
  const [filterStatus, setFilterStatus] = React.useState(defaultActiveKey);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const { allTasks, statusSummary, loading } = useTasks(
    filterStatus,
    searchQuery,
    sortOrder
  );
  const { isDarkMode } = React.useContext(ThemeContext);
  const screens = useBreakpoint();

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    handleSearch(value);
  };

  React.useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  if (loading) return <Loading />;

  const tabs = [
    { key: "All", label: <Badge count={statusSummary.all || 0}>All</Badge> },
    {
      key: "Pending",
      label: <Badge count={statusSummary.pending || 0}>Pending</Badge>,
    },
    {
      key: "In Progress",
      label: <Badge count={statusSummary.inProgress || 0}>In Progress</Badge>,
    },
    {
      key: "Completed",
      label: <Badge count={statusSummary.completed || 0}>Completed</Badge>,
    },
    {
      key: "Overdue",
      label: (
        <Badge count={statusSummary.overdue || 0} offset={[-8, -2]}>
          Overdue
        </Badge>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: screens.xs ? "flex-start" : "space-between",
          flexDirection: screens.xs ? "column" : "row",
          gap: screens.xs ? 12 : 0,
          marginBottom: 24,
        }}
        direction={screens.xs ? "vertical" : "horizontal"}
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

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search tasks..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={handleSearchInputChange}
            value={searchInputValue}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            style={{ width: "100%" }}
            size="large"
            value={sortOrder}
            onChange={setSortOrder}
            options={[
              { value: "newest", label: "Newest Due Date First" },
              { value: "oldest", label: "Oldest Due Date First" },
            ]}
          />
        </Col>
      </Row>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          overflowX: screens.xs ? "auto" : "visible",
          width: "100%",
          paddingLeft: screens.xs ? 0 : 0, // Remove left padding to ensure first tab is visible
        }}
      >
        <Tabs
          activeKey={filterStatus}
          onChange={setFilterStatus}
          items={tabs}
          centered={!screens.xs}
          size="large"
          tabBarStyle={{
            overflow: screens.xs ? "auto" : "visible",
            whiteSpace: screens.xs ? "nowrap" : "normal",
            minWidth: screens.xs ? undefined : undefined, // Remove minWidth to allow all tabs to fit
            width: screens.xs ? "max-content" : undefined,
            margin: 0,
          }}
        />
      </div>

      {allTasks.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Text type="secondary">
            {searchQuery
              ? "No tasks found matching your search."
              : filterStatus === "All"
              ? "No tasks found."
              : `No ${filterStatus.toLowerCase()} tasks found.`}
          </Text>
        </div>
      ) : (
        <Row gutter={[16, 16]} wrap style={{ width: "100%" }}>
          {allTasks.map((task) => (
            <Col
              key={task._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ minWidth: 0 }}
            >
              <Card
                hoverable
                onClick={() => onCardClick(task)}
                style={{
                  height: "100%",
                  background: isDarkMode ? "rgb(15 26 47)" : "#fff",
                  minWidth: 0,
                }}
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

                <p style={{ margin: 0, color: "#666" }}>
                  {task.description?.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </p>
                <div style={{ marginTop: 12 }}>
                  <TaskProgress task={task} />
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
                          <Avatar src={getSecureImageUrl(user.profileImageUrl)} />
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
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}
