import { useEffect, useState, useCallback, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosConfig";
import {
  List,
  message,
  Modal,
  Spin,
  Avatar,
  Space,
  Checkbox,
  Input,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

const { Search } = Input;

const fetchUsers = async (search = "") => {
  const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, {
    params: { search },
  });
  return response.data;
};

export default function UserSelectionModal({
  visible,
  onCancel,
  onSave,
  selectedUsers,
  setSelectedUsers, // keep for compatibility, but will not use for local state
}) {
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Local selection state
  const [localSelected, setLocalSelected] = useState([]);

  // Sync local selection with parent when modal opens
  useEffect(() => {
    if (visible) setLocalSelected(selectedUsers || []);
  }, [visible, selectedUsers]);

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

  // Create a debounced version of loadUsers
  const debouncedLoadUsers = useCallback(
    debounce((search) => loadUsers(search), 300),
    []
  );

  useEffect(() => {
    if (visible) {
      debouncedLoadUsers(searchQuery);
    }
    return () => {
      debouncedLoadUsers.cancel();
    };
  }, [visible, searchQuery, debouncedLoadUsers]);

  const handleUserToggle = (user) => {
    const isSelected = localSelected.some((u) => u._id === user._id);
    if (isSelected) {
      setLocalSelected(localSelected.filter((u) => u._id !== user._id));
    } else {
      setLocalSelected([...localSelected, user]);
    }
  };

  const handleSave = () => {
    onSave(localSelected);
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
          background: isDarkMode ? "rgb(15 26 47)" : "#fff",
          color: isDarkMode ? "#fff" : undefined,
        },
        header: {
          background: isDarkMode ? "rgb(15 26 47)" : undefined,
          color: isDarkMode ? "#fff" : undefined,
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
          style={{
            background: isDarkMode ? "#1a2236" : undefined,
            color: isDarkMode ? "#fff" : undefined,
          }}
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
            const isSelected = localSelected.some((u) => u._id === user._id);
            return (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? isDarkMode
                      ? "#22304a"
                      : "#f6ffed"
                    : isDarkMode
                    ? "#1a2236"
                    : "transparent",
                  border: isSelected
                    ? isDarkMode
                      ? "1px solid #3e5a8c"
                      : "1px solid #b7eb8f"
                    : "1px solid transparent",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  color: isDarkMode ? "#fff" : undefined,
                }}
                onClick={() => handleUserToggle(user)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={user.profileImageUrl}
                      icon={<UserOutlined />}
                      size={40}
                      style={{ background: isDarkMode ? "#2a3550" : undefined }}
                    />
                  }
                  title={
                    <Space>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleUserToggle(user)}
                        style={{
                          accentColor: isDarkMode ? "#1677ff" : undefined,
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <span style={{ color: isDarkMode ? "#b0b8c9" : "#666" }}>
                        {user.email}
                      </span>
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
