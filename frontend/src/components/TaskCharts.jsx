import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Empty } from "antd";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { ThemeContext } from "../context/ThemeContext";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const TaskCharts = ({ data }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [pieData, setPieData] = useState({});
  const [barData, setBarData] = useState({});

  useEffect(() => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    setPieData({
      labels: ["Pending", "In Progress", "Completed", "Overdue"],
      datasets: [
        {
          data: [
            taskDistribution.Pending || 0,
            taskDistribution.InProgress || 0,
            taskDistribution.Completed || 0,
            taskDistribution.Overdue || 0,
          ],
          backgroundColor: [
            isDarkMode ? "#f59e42" : "#f59e42",
            isDarkMode ? "#1677ff" : "#1677ff",
            isDarkMode ? "#22c55e" : "#22c55e",
            isDarkMode ? "#ff4d4f" : "#ff4d4f", // Red for Overdue
          ],
          borderColor: isDarkMode ? "#23272f" : "#fff",
          borderWidth: 2,
        },
      ],
    });

    setBarData({
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          label: "Tasks",
          data: [
            taskPriorityLevels.Low || 0,
            taskPriorityLevels.Medium || 0,
            taskPriorityLevels.High || 0,
          ],
          backgroundColor: [
            isDarkMode ? "#22c55e" : "#22c55e",
            isDarkMode ? "#1677ff" : "#1677ff",
            isDarkMode ? "#f59e42" : "#f59e42",
          ],
          borderRadius: 8,
        },
      ],
    });
  }, [data, isDarkMode]);

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDarkMode ? "#fff" : "#222",
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#23272f" : "#fff",
        titleColor: isDarkMode ? "#fff" : "#222",
        bodyColor: isDarkMode ? "#fff" : "#222",
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#23272f" : "#fff",
        titleColor: isDarkMode ? "#fff" : "#222",
        bodyColor: isDarkMode ? "#fff" : "#222",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#fff" : "#222",
          font: { size: 14 },
        },
        grid: {
          color: isDarkMode ? "#444" : "#eee",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#fff" : "#222",
          font: { size: 14 },
        },
        grid: {
          color: isDarkMode ? "#444" : "#eee",
        },
      },
    },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card
          title="Task Distribution"
          style={{
            minHeight: 350,
            height: 400,
            background: isDarkMode ? "rgb(15 26 47)" : undefined,
            color: isDarkMode ? "#fff" : undefined,
          }}
        >
          {pieData.datasets && pieData.datasets[0].data.some((v) => v > 0) ? (
            <Pie data={pieData} options={{ ...pieOptions, maintainAspectRatio: false }} height={300} />
          ) : (
            <Empty description="No Data" />
          )}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card
          title="Task Priority Levels"
          style={{
            minHeight: 350,
            height: 400,
            background: isDarkMode ? "rgb(15 26 47)" : undefined,
            color: isDarkMode ? "#fff" : undefined,
          }}
        >
          {barData.datasets && barData.datasets[0].data.some((v) => v > 0) ? (
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} height={300} />
          ) : (
            <Empty description="No Data" />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default TaskCharts;
