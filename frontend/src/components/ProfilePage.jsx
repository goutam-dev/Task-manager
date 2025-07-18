import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import DashboardLayout from "./DashboardLayout";
import { ProfileCard } from "./UserDetailView";
import { Card, Form, Input, Button, Upload, message, Space, Input as AntInput, App as AntdApp } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS, API_BASE_URL } from "../utils/apiPaths";
import UserProfileEditForm from "./UserProfileEditForm";

export default function ProfilePage() {
  const { user, updateUser } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Ensure form fields are set when editing is enabled
  useEffect(() => {
    if (editing && user && !form.isFieldsTouched()) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        password: undefined,
      });
    }
  }, [editing, form]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
    form.setFieldValue('password', undefined);
  };

  const handleFinish = async (values) => {
    console.log('Submitted values:', values);
    console.log('Submitted profileImageUrl:', values.profileImageUrl);
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, values);
      updateUser(data);
      message.success("Profile updated successfully");
      setEditing(false);
      form.setFieldValue('password', undefined);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AntdApp>
      <DashboardLayout defaultActiveKey="profile">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <ProfileCard user={user} isDarkMode={isDarkMode} editable onEdit={handleEdit} showEdit={true} />
          {editing && (
            <Card
              style={{
                maxWidth: 500,
                margin: "0 auto",
                borderRadius: 16,
                background: isDarkMode ? "rgb(15 26 47)" : undefined,
                color: isDarkMode ? "#fff" : undefined,
              }}
              styles={{ body: { padding: 24 } }}
              title="Edit Profile"
            >
              <UserProfileEditForm
                form={form}
                initialValues={{
                  name: user.name,
                  email: user.email,
                  profileImageUrl: user.profileImageUrl,
                }}
                onFinish={handleFinish}
                loading={loading}
                imageUploading={imageUploading}
                setImageUploading={setImageUploading}
                onCancel={handleCancel}
                isDarkMode={isDarkMode}
                showPasswordField={true}
              />
            </Card>
          )}
        </Space>
      </DashboardLayout>
    </AntdApp>
  );
}