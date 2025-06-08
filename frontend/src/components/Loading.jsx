import { Spin } from "antd";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Spin tip="Loading..." size="large">
        <div style={{ padding: 50 }} />
      </Spin>
    </div>
  );
};

export default Loading;
