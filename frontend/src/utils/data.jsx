import { AppstoreAddOutlined, AppstoreOutlined, CheckSquareOutlined, LogoutOutlined, PlusSquareOutlined, TeamOutlined, UnorderedListOutlined } from "@ant-design/icons";

export const SIDEBAR_ADMIN_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
    path: "/admin/dashboard",
  },
  {
    key: "manage-tasks",
    label: "Manage Tasks",
    icon: <UnorderedListOutlined />,
    path: "/admin/tasks",
  },
  {
    key: "create-task",
    label: "Create Task",
    icon: <PlusSquareOutlined />,
    path: "/admin/create-task",
  },
  {
    key: "team-members",
    label: "Team Members",
    icon: <TeamOutlined />,
    path: "/admin/team-members",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    path: "logout",
    isLogout: true,
  },
];

export const SIDEBAR_USER_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
    path: "/user/dashboard",
  },
  {
    key: "my-tasks",
    label: "My Tasks",
    icon: <CheckSquareOutlined />,
    path: "/user/tasks",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    path: "logout",
    isLogout: true,
  },
];