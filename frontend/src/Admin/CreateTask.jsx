import DashboardLayout from "../components/DashboardLayout";
import TaskForm from "../components/TaskForm";

function CreateTask({ taskID }) {
  return (
    <DashboardLayout defaultActiveKey="create-task">
      <TaskForm taskID={taskID} />
    </DashboardLayout>
  );
}

export default CreateTask;
