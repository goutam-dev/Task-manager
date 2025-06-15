import { useEffect, useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosConfig";
import { List, message, Modal, Spin, Avatar, Space, Checkbox, Input } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const fetchUsers = async (search = "") => {
  const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, {
    params: { search }
  });
  return response.data;
};

export default function UserSelectionModal({
  visible,
  onCancel,
  onSave,
  selectedUsers,
  setSelectedUsers,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async (search) => {
    setLoading(true);
    try {
      const userData = await fetchUsers(search);
      setUsers(userData);
    } catch (err) {
      message.error("Failed to load users");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadUsers(searchQuery);
    }
  }, [visible, searchQuery]);

  const handleUserToggle = (user) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSave = () => {
    onSave(selectedUsers);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <Modal
      title="Assign Users"
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      width={600}
      styles={{
        body: {
          maxHeight: "60vh",
          overflowY: "auto",
        },
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users by name or email..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchQuery}
        />
      </div>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No users found matching your search.</p>
        </div>
      ) : (
        <List
          dataSource={users}
          renderItem={(user) => {
            const isSelected = selectedUsers.some((u) => u._id === user._id);
            return (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#f6ffed" : "transparent",
                  border: isSelected
                    ? "1px solid #b7eb8f"
                    : "1px solid transparent",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
                onClick={() => handleUserToggle(user)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={user.profileImageUrl}
                      icon={<UserOutlined />}
                      size={40}
                    />
                  }
                  title={
                    <Space>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleUserToggle(user)}
                      />
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <span style={{ color: "#666" }}>{user.email}</span>
                      <Space size={16}>
                        <span>Pending: {user.pendingTasks}</span>
                        <span>In Progress: {user.inProgressTasks}</span>
                        <span>Completed: {user.completedTasks}</span>
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
}
