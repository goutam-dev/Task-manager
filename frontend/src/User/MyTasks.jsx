import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import GenericTaskList from "../components/GenericTaskList";

export default function MyTasks() {
  const navigate = useNavigate();
  const handleClick = ({ _id }) => navigate(`/admin/task-details/:${_id}`);

  return (
    <DashboardLayout defaultActiveKey="my-tasks">
      <GenericTaskList
        title="My Tasks"
        defaultActiveKey="All"
        onCardClick={handleClick}
        showDownload={false}
      />
    </DashboardLayout>
  );
}
