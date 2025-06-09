import { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Typography,
  message,
  Modal,
  Space,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AssignedUsersDisplay from "./AssignedUserDisplay";
import UserSelectionModal from "./UserSelectionModal";
import DynamicList from "./DynamicList";
import Loading from "./Loading";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

const TaskForm = () => {
  const location = useLocation();
  let taskID = location.state?.taskID;
  const isUpdate = typeof taskID === "string";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTouched, setAssignedTouched] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [checklistTouched, setChecklistTouched] = useState(false);
  const [prevChecklist, setPrevChecklist] = useState([]);

  const init = {
    priority: "Low",
    title: "",
    dueDate: null,
    description: "",
  };

  const clearData = () => {
    form.resetFields();
    setSelectedUsers([]);
    setAttachments([]);
    setChecklist([]);
    setAssignedTouched(false);
    setChecklistTouched(false);
  };

  const handleSubmit = (values) => {
    setAssignedTouched(true);
    setChecklistTouched(true);

    if (selectedUsers.length === 0 || checklist.length === 0) {
      return;
    }

    if (isUpdate) {
      updateTask(values);
      return;
    }

    createTask(values);
  };

  const createTask = async (values) => {
    setLoading(true);
    try {
      const todoChecklist = checklist?.map((item) => ({
        text: item,
        completed: false,
      }));
      const assignedTo = selectedUsers.map((u) => u._id);

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
        todoChecklist,
        assignedTo,
        attachments,
      });

      console.log(response);

      message.success("Task Created Successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetailsById = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID + taskID
      );

      if (response.data) {
        console.log(response.data.assignedTo);

        const taskInfo = response.data;
        form.setFieldsValue({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate ? dayjs(taskInfo.dueDate) : null,
        });

        setSelectedUsers(taskInfo?.assignedTo || []);
        setAttachments(taskInfo?.attachments || []);
        setChecklist(taskInfo?.todoChecklist?.map((item) => item?.text) || []);
        setPrevChecklist(
          taskInfo?.todoChecklist?.map((item) => item?.text) || []
        );
      } else {
        console.log("Task not found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [form, taskID]);

  const updateTask = async (values) => {
    setLoading(true);
    try {
      const todolist = checklist?.map((item) => {
        const prevTodoChecklist = prevChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const assignedTo = selectedUsers.map((u) => u._id);

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK + taskID,
        {
          ...values,
          dueDate: new Date(values.dueDate).toISOString(),
          todoChecklist: todolist,
          assignedTo,
          attachments,
        }
      );
      console.log(response);
      message.success("Task Updated Successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = () => {
    confirm({
      title: "Delete Task",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this task? This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        // Call your delete method here
        deleteTask();
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const deleteTask = async () => {
    console.log("Delete task method called for taskID:", taskID);

    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASK + taskID
      );
      message.success("Task Deleted Successfully");
      console.log(response);
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSave = (users) => {
    setSelectedUsers(users);
    setModalVisible(false);
    setAssignedTouched(true);
  };

  useEffect(() => {
    if (isUpdate) {
      getTaskDetailsById();
    }
  }, [isUpdate, getTaskDetailsById]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ padding: "24px" }}>
        <Card
          style={{
            maxWidth: 800,
            margin: "0 auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {isUpdate ? "Update Task" : "Create Task"}
            </Title>
            {isUpdate && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteTask}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                }}
              >
                Delete Task
              </Button>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={init}
            onFinish={(values) => {
              setAssignedTouched(true);
              setChecklistTouched(true);
              if (selectedUsers.length === 0 || checklist.length === 0) return;
              handleSubmit(values);
            }}
            onFinishFailed={() => {
              // mark Assigned as "touched" whenever any validation fails
              setAssignedTouched(true);
              setChecklistTouched(true);
            }}
          >
            <Form.Item
              name="title"
              label="Task Title"
              rules={[{ required: true, message: "Please enter a task title" }]}
            >
              <Input placeholder="Create App UI" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <TextArea rows={4} placeholder="Describe task" />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select>
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: "Please select a due date" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Assigned To"
              required
              validateStatus={
                assignedTouched && selectedUsers.length === 0 ? "error" : ""
              }
              help={
                assignedTouched && selectedUsers.length === 0
                  ? "Please assign at least one user"
                  : ""
              }
            >
              <AssignedUsersDisplay
                users={selectedUsers}
                onClick={() => {
                  setModalVisible(true);
                }}
              />
            </Form.Item>

            <Form.Item
              label="TODO Checklist"
              required
              validateStatus={
                checklistTouched && checklist.length === 0 ? "error" : ""
              }
              help={
                checklistTouched && checklist.length === 0
                  ? "Please add at least one todo item"
                  : ""
              }
            >
              <DynamicList
                items={checklist}
                onChange={(items) => {
                  setChecklist(items);
                  setChecklistTouched(true);
                }}
                placeholder="Enter checklist item"
              />
            </Form.Item>

            {/* Attachments Field */}
            <Form.Item label="Attachments">
              <DynamicList
                items={attachments}
                onChange={setAttachments}
                placeholder="Add file link (e.g. https://react.dev)"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Space style={{ width: "100%" }}>
                <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
                  {isUpdate ? "Update Task" : "Create Task"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      <UserSelectionModal
        visible={modalVisible}
        onCancel={() => {
          setAssignedTouched(true);
          setModalVisible(false);
        }}
        onSave={handleModalSave}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    </Layout>
  );
};

export default TaskForm;
