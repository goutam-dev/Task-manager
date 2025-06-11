import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

/**
 * 403 Forbidden Page
 * Shows when a user does not have permission to access a route.
 */
const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Result
        status="403"
        title="403 Forbidden"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button onClick={() => navigate(-1)} type="primary">
            Go Back
          </Button>
        }
      />
    </div>
  );
};

export default Forbidden;
