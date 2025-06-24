import { Row, Col, Typography, Button, Table, Tag, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

const { Title, Text } = Typography;

export default function RecentTasksSection({ dashboardData }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const data = dashboardData?.recentTasks?.slice(0, 5) || [];

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Completed") color = "green";
        else if (status === "In Progress") color = "blue";
        else if (status === "Pending") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (p) => (
        <Tag
          color={p === "High" ? "volcano" : p === "Low" ? "green" : "geekblue"}
        >
          {p}
        </Tag>
      ),
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  return (
    <Card
      styles={{
        container: { borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
        body: { padding: 24 },
      }}
      style={{ background: isDarkMode ? "rgb(15 26 47)" : undefined }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title
            level={4}
            style={{
              margin: 0,
              color: isDarkMode ? "#fff" : undefined,
            }}
          >
            Recent Tasks
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              if (user.role === "admin") {
                navigate("/admin/tasks");
              } else {
                navigate("/user/tasks");
              }
            }}
          >
            See All
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id || record.name}
        pagination={false}
        size="middle"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "even-row" : "odd-row"
        }
        style={{
          background: isDarkMode ? "rgb(15 26 47)" : "#fafafa",
          color: isDarkMode ? "#fff" : undefined,
        }}
      />
      <style>
        {`.even-row td { background-color: ${
          isDarkMode ? "rgb(15 26 47)" : "#ffffff"
        }; }
          .odd-row td { background-color: ${
            isDarkMode ? "rgb(15 26 47)" : "#fafafa"
          }; }
          .ant-table-thead > tr > th { background: ${
            isDarkMode ? "rgb(15 26 47)" : "#fafafa"
          }; color: ${isDarkMode ? "#fff" : "#222"}; }`}
      </style>
    </Card>
  );
}
