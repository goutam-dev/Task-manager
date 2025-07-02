import {
  Alert,
  Button,
  Form,
  Grid,
  Input,
  theme,
  Typography,
  Switch,
} from "antd";

import {
  LockOutlined,
  MailOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { sharedStyles } from "./sharedStyles";
import { useContext, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function Login() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, values);
      console.log("Response:", response.data);

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("hello");

        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
        console.log("Error:", error);
      }
    }
  };

  const styles = sharedStyles(token, screens);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </div>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 8 }}
          >
            <rect x="0" y="0" width="32" height="32" rx="6" fill="#1890FF" />
            <rect x="8" y="10" width="16" height="2" rx="1" fill="white" />
            <rect x="8" y="16" width="10" height="2" rx="1" fill="white" />
            <rect x="8" y="22" width="6" height="2" rx="1" fill="white" />
            <path d="M23 17.5l2 2 4-4" stroke="#52c41a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>

          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to Task Manager! Please enter your details below to
            sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{}}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="John@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
                style={styles.errorAlert}
              />
            )}

            <Button block="true" type="primary" htmlType="submit">
              Log in
            </Button>

            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="/signup">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
