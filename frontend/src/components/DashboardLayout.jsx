import { useState, useEffect, useContext } from "react";
import { Layout, Menu, Grid, Avatar, Typography, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { SIDEBAR_ADMIN_ITEMS, SIDEBAR_USER_ITEMS } from "../utils/data";

const { Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function DashboardLayout({
  defaultActiveKey = "dashboard",
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(defaultActiveKey);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);
  const menuItems =
    user?.role === "admin" ? SIDEBAR_ADMIN_ITEMS : SIDEBAR_USER_ITEMS;

  const isMobile = !screens.md;
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    const item = menuItems.find((i) => i.key === key);
    if (item) {
      if (item.isLogout) {
        localStorage.clear();
        clearUser();
        navigate("/login");
      } else {
        navigate(item.path);
      }
    }
  };
  const items = menuItems.map((i) => ({
    key: i.key,
    icon: i.icon,
    label: i.label,
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <Avatar size={48} src={user.profileImageUrl} />
          {!collapsed && (
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: 16, color: "#fff" }}>
                {user.name}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12, color: "#fff" }}>
                {user.email}
              </Text>
              {user.role === "admin" && (
                <div style={{ marginTop: 6 }}>
                  <Badge
                    count="Admin"
                    style={{ backgroundColor: "rgb(26 135 196)" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={items}
        />
      </Sider>

      <Layout
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {/* Scrollable content region */}
        <Content
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
