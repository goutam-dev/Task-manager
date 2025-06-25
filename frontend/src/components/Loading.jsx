import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Spin } from "antd";

const Loading = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#23272f" : "#f0f2f5",
      }}
    >
      <Spin
        tip={<span style={{ color: isDarkMode ? '#fff' : '#222' }}>Loading...</span>}
        size="large"
      >
        <div
          style={{
            padding: 50,
            borderRadius: 16,
            background: isDarkMode ? "rgb(15 26 47)" : "#fff",
            boxShadow: isDarkMode
              ? "0 6px 32px 0 rgba(0,0,0,0.45), 0 1.5px 6px 0 rgba(0,0,0,0.25)"
              : "0 6px 32px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10)",
          }}
        >
          {/* Empty div for spinner center box */}
        </div>
      </Spin>
    </div>
  );
};

export default Loading;
