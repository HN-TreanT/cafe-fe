import React, { useState, useRef } from "react";
import { Card, Button, Alert, Space, Typography } from "antd";
import {
  CameraOutlined,
  RetweetOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const FaceRegistration = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [status, setStatus] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setStatus("Đang mở camera...");
      }
    } catch (err) {
      setStatus("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCapturing(false);
      setStatus("");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const context = canvas.getContext("2d");
    if (context && videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      setStatus("Đã chụp ảnh thành công!");
      stopCamera();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleRegister = () => {
    // Thêm logic xử lý đăng ký tại đây
    setStatus("Đang xử lý đăng ký...");
  };

  return (
    <Card
      style={{ maxWidth: 800, margin: "0 auto" }}
      title={
        <Title level={4} style={{ margin: 0, textAlign: "center" }}>
          <CameraOutlined /> Đăng Ký Bằng Khuôn Mặt
        </Title>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            backgroundColor: "#000",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {!capturedImage && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured face"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <Space
          style={{ width: "100%", justifyContent: "center" }}
          size="middle"
        >
          {!isCapturing && !capturedImage && (
            <Button
              type="primary"
              icon={<CameraOutlined />}
              onClick={startCamera}
            >
              Bắt Đầu
            </Button>
          )}

          {isCapturing && (
            <Button
              type="primary"
              icon={<CameraOutlined />}
              onClick={captureImage}
            >
              Chụp Ảnh
            </Button>
          )}

          {capturedImage && (
            <>
              <Button icon={<RetweetOutlined />} onClick={retake}>
                Chụp Lại
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleRegister}
              >
                Xác Nhận Đăng Ký
              </Button>
            </>
          )}
        </Space>

        {status && (
          <Alert
            message={status}
            type={status.includes("không thể") ? "error" : "info"}
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};

export default FaceRegistration;
