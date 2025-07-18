// import { useEffect } from "react";
import { Form, Input, Button, Upload, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_PATHS, API_BASE_URL } from "../utils/apiPaths";

export default function UserProfileEditForm({
  initialValues = {},
  onFinish,
  loading,
  imageUploading,
  setImageUploading,
  onCancel,
  isDarkMode,
  showPasswordField = false,
  form: externalForm,
}) {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  const handleImageUpload = (info) => {
    if (info.file.status === "uploading") {
      setImageUploading(true);
      return;
    }
    if (info.file.status === "done") {
      setImageUploading(false);
      const imageUrl = info.file.response?.imageUrl;
      if (imageUrl) {
        form.setFieldsValue({ profileImageUrl: imageUrl });
        form.validateFields(['profileImageUrl']);
        console.log('Image uploaded, setFieldsValue:', imageUrl, 'Current form value:', form.getFieldValue('profileImageUrl'));
        setTimeout(() => {
          const input = document.querySelector('input[name="profileImageUrl"]');
          if (input) input.blur();
        }, 0);
        message.success("Image uploaded successfully");
      } else {
        message.error("Upload failed: No image URL returned");
      }
    } else if (info.file.status === "error") {
      setImageUploading(false);
      message.error("Image upload failed");
    }
  };

  const uploadProps = {
    name: "image",
    action: API_BASE_URL + API_PATHS.AUTH.UPLOAD_IMAGE,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    showUploadList: false,
    onChange: handleImageUpload,
    accept: 'image/*',
  };

  // Intercept form submit to always use latest values
  const handleFormFinish = () => {
    const values = form.getFieldsValue(true);
    onFinish(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormFinish}
      requiredMark={false}
      initialValues={{
        name: initialValues.name,
        email: initialValues.email,
        profileImageUrl: initialValues.profileImageUrl,
        password: undefined,
      }}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}> 
        <Input />
      </Form.Item>
      {showPasswordField && (
        <Form.Item name="password" label="New Password" extra="Leave blank to keep current password"> 
          <Input.Password autoComplete="new-password" /> 
        </Form.Item>
      )}
      {/* Hidden field for profileImageUrl to ensure it is submitted */}
      <Form.Item name="profileImageUrl" style={{ display: 'none' }}>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item label="Profile Image">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={imageUploading}>Upload</Button>
        </Upload>
        {form.getFieldValue('profileImageUrl') && (
          <img
            src={form.getFieldValue('profileImageUrl')}
            alt="Profile"
            style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={imageUploading}>Save</Button>
        </Space>
      </Form.Item>
    </Form>
  );
} 