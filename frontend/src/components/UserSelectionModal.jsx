import { useEffect, useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosConfig";
import { List, message, Modal, Spin, Avatar, Space, Checkbox } from "antd";
import { UserOutlined } from "@ant-design/icons";

const fetchUsers = async ()=>{
    const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
    console.log(response.data);
    
    return response.data
}
export default function UserSelectionModal  ({
  visible,
  onCancel,
  onSave,
  selectedUsers,
  setSelectedUsers,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadUsers();
    }
  }, [visible]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      message.error("Failed to load users");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
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
                    <span style={{ color: "#666" }}>{user.email}</span>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};
