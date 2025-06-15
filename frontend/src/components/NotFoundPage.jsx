import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonHover, setButtonHover] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const getShapeStyle = (index) => {
    const speed = (index + 1) * 0.02;
    const xOffset = (mousePosition.x - 0.5) * 20 * speed;
    const yOffset = (mousePosition.y - 0.5) * 20 * speed;

    return {
      transform: `translate(${xOffset}px, ${yOffset}px)`,
      transition: "transform 0.1s ease-out",
    };
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "slideUp 0.8s ease-out",
  };

  const errorNumberStyle = {
    fontSize: "clamp(60px, 15vw, 140px)",
    fontWeight: 900,
    background: "linear-gradient(135deg, #1890ff, #722ed1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
    textAlign: "center",
    margin: 0,
    animation: "bounce 2s infinite",
  };

  const buttonStyle = {
    background: buttonHover
      ? "linear-gradient(135deg, #40a9ff, #9254de)"
      : "linear-gradient(135deg, #1890ff, #722ed1)",
    border: "none",
    borderRadius: "8px",
    height: "48px",
    paddingLeft: "32px",
    paddingRight: "32px",
    fontSize: "16px",
    fontWeight: 600,
    boxShadow: buttonHover
      ? "0 6px 20px rgba(24, 144, 255, 0.6)"
      : "0 4px 15px rgba(24, 144, 255, 0.4)",
    transform: buttonHover ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.3s ease",
  };

  const floatingShapes = [
    {
      style: {
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "80px",
        height: "80px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite",
        ...getShapeStyle(0),
      },
    },
    {
      style: {
        position: "absolute",
        top: "70%",
        right: "10%",
        width: "60px",
        height: "60px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "30%",
        animation: "float 6s ease-in-out infinite 2s",
        ...getShapeStyle(1),
      },
    },
    {
      style: {
        position: "absolute",
        bottom: "20%",
        left: "20%",
        width: "40px",
        height: "40px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite 4s",
        ...getShapeStyle(2),
      },
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .ant-card {
            overflow: visible;
          }

          .ant-card-body {
            padding: 48px 32px;
          }

          @media (max-width: 768px) {
            .ant-card-body {
              padding: 32px 24px;
            }
          }

          @media (max-width: 576px) {
            .ant-card-body {
              padding: 24px 16px;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Floating Shapes */}
        {floatingShapes.map((shape, index) => (
          <div key={index} style={shape.style} />
        ))}

        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={22} sm={20} md={16} lg={12} xl={10} xxl={8}>
            <Card style={cardStyle} bordered={false}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%", textAlign: "center" }}
              >
                <div style={errorNumberStyle}>404</div>

                <Title
                  level={1}
                  style={{
                    margin: 0,
                    color: "#262626",
                    fontSize: "clamp(24px, 5vw, 32px)",
                  }}
                >
                  Oops! Page Not Found
                </Title>

                <Paragraph
                  style={{
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    color: "#8c8c8c",
                    margin: 0,
                    lineHeight: "1.6",
                    maxWidth: "400px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  The page you're looking for seems to have wandered off into
                  the digital void. Don't worry though, we'll help you find your
                  way back home.
                </Paragraph>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleGoBack}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                  style={buttonStyle}
                  icon={<ArrowLeftOutlined />}
                >
                  Go Back
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default NotFoundPage;
