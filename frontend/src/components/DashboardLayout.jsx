import { useState, useEffect, useContext } from "react";
import { Layout, Menu, Grid, Avatar, Typography, Badge, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { SIDEBAR_ADMIN_ITEMS, SIDEBAR_USER_ITEMS } from "../utils/data";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const { Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

// Helper to ensure HTTPS for image URLs
const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

export default function DashboardLayout({
  defaultActiveKey = "dashboard",
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(defaultActiveKey);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
        localStorage.removeItem('token');
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
    <Layout
      style={{
        minHeight: "100vh",
        background: isDarkMode ? "#181818" : undefined,
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        style={{ background: isDarkMode ? undefined : "#001529" }} // Use AntD default dark blue in both modes
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <Avatar size={48} src={getSecureImageUrl(user.profileImageUrl)} />
          {!collapsed && (
            <div style={{ marginTop: 8 }}>
              <Text
                strong
                style={{
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                {user.name}
              </Text>
              <br />
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  color: "#bbb",
                }}
              >
                {user.email}
              </Text>
              {user.role === "admin" && (
                <div style={{ marginTop: 6 }}>
                  <Badge
                    count="Admin"
                    style={{ backgroundColor: "#1677ff" }}
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
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: isDarkMode ? "#181818" : undefined,
        }}
      >
        {/* Theme toggler in header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "8px 24px 0 0",
            background: isDarkMode ? "#23272f" : "#fff",
          }}
        >
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </div>
        {/* Scrollable content region */}
        <Content
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: isDarkMode ? "#23272f" : "#fff",
            color: isDarkMode ? "#fff" : undefined,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
