import { Card, Row, Col, Typography, Statistic, Space } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const { Title, Text } = Typography;

export default function AdminSummary({ dashboardData }) {
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);

  const name = user?.name || "User";
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const statsData = dashboardData?.statistics || {};
  const stats = [
    {
      title: "Total Tasks",
      value: statsData.totalTasks,
      icon: (
        <UnorderedListOutlined style={{ marginRight: 6, color: "#3b82f6" }} />
      ),
    },
    {
      title: "Pending Tasks",
      value: statsData.pendingTasks,
      icon: (
        <ClockCircleOutlined style={{ marginRight: 6, color: "#8b5cf6" }} />
      ),
    },
    {
      title: "Completed Tasks",
      value: statsData.completedTasks,
      icon: (
        <CheckCircleOutlined style={{ marginRight: 6, color: "#22c55e" }} />
      ),
    },
    {
      title: "In Progress Tasks",
      value: statsData.inProgressTasks,
      icon: (
        <ClockCircleOutlined style={{ marginRight: 6, color: "#f59e0b" }} />
      ),
    },
    {
      title: "Overdue Tasks",
      value: statsData.overdueTasks,
      icon: (
        <ExclamationCircleOutlined
          style={{ marginRight: 6, color: "#ef4444" }}
        />
      ),
    },
  ];
  return (
    <Card
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: isDarkMode ? "rgb(15 26 47)" : undefined,
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Title
            level={4}
            style={{
              marginBottom: 0,
              color: isDarkMode ? "#fff" : undefined,
            }}
          >
            Welcome! {name}
          </Title>
          <Text
            type="secondary"
            style={{ color: isDarkMode ? "#bbb" : undefined }}
          >
            {dateStr}
          </Text>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {stats.map(({ title, value, icon }) => (
          <Col xs={24} sm={12} lg={4} md={7} key={title}>
            <Statistic
              title={
                <span style={{ color: isDarkMode ? "#bbb" : undefined }}>
                  {title}
                </span>
              }
              value={value}
              prefix={icon}
              valueStyle={{
                fontWeight: 600,
                color: isDarkMode ? "#fff" : undefined,
              }}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
