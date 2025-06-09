import { useState } from "react";
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
} from "antd";
import AssignedUsersDisplay from "./AssignedUserDisplay";
import UserSelectionModal from "./UserSelectionModal";
import DynamicList from "./DynamicList";
import Loading from "./Loading";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { useLocation } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TaskForm = () => {
  const location = useLocation();
  const taskId = location.state || {};

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTouched, setAssignedTouched] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [checklistTouched, setChecklistTouched] = useState(false);

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

    // if no users selected, don’t submit—will trigger the error help text
    if (selectedUsers.length === 0 || checklist.length === 0) {
      return;
    }

    if (taskId) {
      // updateTask()
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSave = (users) => {
    setSelectedUsers(users);
    setModalVisible(false);
    setAssignedTouched(true);
  };

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
          <Title level={3}>{taskId ? "Update Task" : "Create Task"}</Title>

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
              // mark Assigned as “touched” whenever any validation fails
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
              <Button type="primary" htmlType="submit" block>
                {taskId ? "Update Task" : "Create Task"}
              </Button>
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
