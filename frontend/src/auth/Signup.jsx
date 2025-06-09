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
  Alert
} from "antd";

import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  KeyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { sharedStyles } from "./sharedStyles";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function SignUp() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [error, setError] = useState("");
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    console.log("pic", values.profilePic[0].originFileObj);


    try {

        let profileImageUrl = ''

        if (values.profilePic[0].originFileObj){
            const formData = new FormData();
            formData.append('image',values.profilePic[0].originFileObj);

            const responseImage = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            profileImageUrl = responseImage.data.imageUrl;
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP,{
            name: values.name,
            email: values.email,
            password: values.password,
            adminInviteToken: values.adminToken,
            profileImageUrl
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
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.125" width="32" height="32" rx="6.4" fill="#1890FF" />
            <path
              d="M19.3251 4.80005H27.3251V12.8H19.3251V4.80005Z"
              fill="white"
            />
            <path d="M12.925 12.8H19.3251V19.2H12.925V12.8Z" fill="white" />
            <path d="M4.92505 17.6H14.525V27.2001H4.92505V17.6Z" fill="white" />
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

          <Form.Item
            name="adminToken"
            label="Admin Token"
          >
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
              beforeUpload={(file) => {
                const isImg = file.type.startsWith("image/");
                if (!isImg) {
                  message.error("You can only upload image files!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error("Image must be smaller than 2MB!");
                }
                return isImg && isLt2M ? true : Upload.LIST_IGNORE;
              }}
            >
              <div>
                <UploadOutlined />
                <div >Upload</div>
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
