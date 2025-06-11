import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import GenericTaskList from "../components/GenericTaskList";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { message } from "antd";

export default function ManageTask() {
  const navigate = useNavigate();
  const handleClick = (task) =>
    navigate("/admin/create-task", {
      state: { taskID: task._id, isUpdate: true },
    });

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success("Downloaded successfully");
    } catch (error) {
      console.error("Error downloading task details:", error);
      message.error("Error downloading task details");
    }
  };

  return (
    <DashboardLayout defaultActiveKey="manage-tasks">
      <GenericTaskList
        title="Manage Tasks"
        defaultActiveKey="All"
        onCardClick={handleClick}
        showDownload={true}
        onDownload={handleDownload}
      />
    </DashboardLayout>
  );
}
