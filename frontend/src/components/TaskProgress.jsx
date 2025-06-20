import { Progress, Typography } from "antd";
const { Text } = Typography;

function TaskProgress({ task }) {
  // 1. Compute percent complete (rounded)
  const percent =
    task.totalTodoCount > 0
      ? Math.round((task.completedTodoCount / task.totalTodoCount) * 100)
      : 0;

  // 2. Pick Progress status based on task.status
  //    - Completed => green (“success”)
  //    - In Progress => blue animation (“active”)
  //    - Overdue => red (“exception”)
  //    - Pending / other => grey (“normal”)
  const progressStatus =
    task.status === "Completed"
      ? "success"
      : task.status === "In Progress"
      ? "active"
      : task.status === "Overdue"
      ? "exception"
      : "normal";

  return (
    <>
      <Progress
        percent={percent}
        size="small"
        status={progressStatus}
      />

      <Text style={{ marginTop: 4 }}>
        {task.completedTodoCount} of {task.totalTodoCount} todos completed
      </Text>
    </>
  );
}

export default TaskProgress;
