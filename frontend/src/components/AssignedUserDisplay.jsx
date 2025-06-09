import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

export default function AssignedUsersDisplay({ users, onClick }) {
  const maxVisible = 3;
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        padding: "12px 16px",
        cursor: "pointer",
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = "#1677ff";
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = "#d9d9d9";
      }}
    >
      {users.length === 0 ? (
        <Space>
          <PlusOutlined style={{ color: "#999" }} />
          <span style={{ color: "#999" }}>Click to assign users</span>
        </Space>
      ) : (
        <Space>
          <Avatar.Group max={{ count: maxVisible }}>
            {visibleUsers.map((user) => (
              <Avatar
                key={user._id}
                src={user.profileImageUrl}
                icon={<UserOutlined />}
                size={32}
                title={user.name}
              />
            ))}
            {remainingCount > 0 && (
              <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                +{remainingCount}
              </Avatar>
            )}
          </Avatar.Group>
          <span style={{ marginLeft: "8px", color: "#666" }}>
            {users.length === 1
              ? "1 user assigned"
              : `${users.length} users assigned`}
          </span>
        </Space>
      )}
    </div>
  );
};
