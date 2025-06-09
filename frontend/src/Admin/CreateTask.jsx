import DashboardLayout from "../components/DashboardLayout";
import TaskForm from "../components/TaskForm";

function CreateTask() {
  return (
    <DashboardLayout defaultActiveKey="create-task">
      <TaskForm />
    </DashboardLayout>
  );
}

export default CreateTask;
