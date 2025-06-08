import React from "react";
import { Row, Col, Typography, Button, Table, Tag, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function RecentTasksSection({ dashboardData }) {
  const navigate = useNavigate();
  const data = dashboardData?.recentTasks || [];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
        container: { borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"},
        body: { padding: 24 },
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Recent Tasks
          </Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate("/admin/tasks")}>
            See All
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id || record.name}
        pagination={false}
        size="middle"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "even-row" : "odd-row"
        }
        style={{ background: "#fafafa" }}
      />

      <style>
        {`.even-row td { background-color: #ffffff; }
          .odd-row td { background-color: #fafafa; }`}
      </style>
    </Card>
  );
}
