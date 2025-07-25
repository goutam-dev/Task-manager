import React, { useContext, useState } from "react";

import {
  Button,
  Form,
  Grid,
  Input,
  theme,
  Typography,
  Upload,
  message,
  Alert,
  Switch,
} from "antd";

import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  KeyOutlined,
  UploadOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { sharedStyles } from "./sharedStyles";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function SignUp() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    console.log("pic", values.profilePic[0].originFileObj);

    try {
      let profileImageUrl = "";

      if (values.profilePic[0].originFileObj) {
        const formData = new FormData();
        formData.append("image", values.profilePic[0].originFileObj);

        const responseImage = await axiosInstance.post(
          API_PATHS.AUTH.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profileImageUrl = responseImage.data.imageUrl;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name: values.name,
        email: values.email,
        password: values.password,
        adminInviteToken: values.adminToken,
        profileImageUrl,
      });
      console.log("Response:", response.data);

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        }
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

  const normFile = (e) => {
    // AntD value extractor for Upload
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const styles = sharedStyles(token, screens);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 8 }}
          >
            <rect x="0" y="0" width="40" height="40" rx="8" fill="#1890FF" />
            <rect x="10" y="14" width="20" height="3" rx="1.5" fill="white" />
            <rect x="10" y="21" width="14" height="3" rx="1.5" fill="white" />
            <rect x="10" y="28" width="8" height="3" rx="1.5" fill="white" />
            <path
              d="M29 22.5l2.5 2.5 5-5"
              stroke="#52c41a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <Title style={styles.title}>Sign up</Title>
          <Text style={styles.text}>
            Join us! Create an account to get started.
          </Text>
        </div>
        <Form
          name="normal_signup"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
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
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              {
                min: 8,
                message: "Password must contain at least 8 characters",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password (min 8 characters)"
            />
          </Form.Item>

          <Form.Item name="adminToken" label="Admin Token">
            <Input prefix={<KeyOutlined />} placeholder="Enter Admin Token" />
          </Form.Item>

          {/* 2) Profile Picture Upload */}
          <Form.Item
            name="profilePic"
            label="Profile Picture"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="PNG/JPG, max 2MB"
            rules={[
              { required: true, message: "Please upload a profile picture!" },
            ]}
          >
            <Upload
              name="files"
              listType="picture-card"
              showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              beforeUpload={(file) => {
                const isImg = file.type.startsWith("image/");
                if (!isImg) {
                  message.error("You can only upload image files!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error("Image must be smaller than 2MB!");
                }
                return isImg && isLt2M ? false : Upload.LIST_IGNORE;
              }}
            >
              <div>
                <UploadOutlined />
                <div>Upload</div>
              </div>
            </Upload>
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

            <Button block type="primary" htmlType="submit">
              Sign up
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Already have an account?</Text>{" "}
              <Link href="/login">Sign in</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
