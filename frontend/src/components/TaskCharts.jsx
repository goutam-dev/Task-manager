import React, { useState, useEffect } from "react";
import { Pie, Column } from "@ant-design/plots";
import { Row, Col, Card, Empty } from "antd";

const TaskCharts = ({ data }) => {
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const chartHeight = 300;

  useEffect(() => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    setPieChartData([
      { type: "Pending", value: taskDistribution.Pending || 0 },
      { type: "In Progress", value: taskDistribution.InProgress || 0 },
      { type: "Completed", value: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ]);
  }, [data]);

  const hasPieData = pieChartData.some((item) => item.value > 0);
  const hasBarData = barChartData.some((item) => item.count > 0);

  const pieConfig = {
    interactions: [{ type: "element-active" }],
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.8,
    height: chartHeight,
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      items: [
        {
          field: "type",
          name: "Category",
        },
        {
          field: "value",
          name: "Value",
        },
      ],
    },
  };

  const barConfig = {
    data: barChartData,
    xField: "priority",
    yField: "count",
    height: chartHeight,
    label: {
      position: "top", // Changed from 'middle' to 'top'
      style: {
        fill: "#000000", // Changed to black for better visibility
        opacity: 0.8,
      },
    },
    interactions: [{ type: "active-region" }],
  };

  return (
    <>
      <Row gutter={[16]}>
        <Col span={12}>
          <Card title="Task Distribution" style={{ height: chartHeight + 80 }}>
            {hasPieData ? (
              <Pie {...pieConfig} />
            ) : (
              <Empty description="No Data" />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Task Priority Levels"
            style={{ height: chartHeight + 80 }}
          >
            {hasBarData ? (
              <Column {...barConfig} />
            ) : (
              <Empty description="No Data" />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TaskCharts;
