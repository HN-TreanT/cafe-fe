import {
  Table,
  Input,
  Card,
  Modal,
  Button,
  Popconfirm,
  Tooltip,
  Breadcrumb,
  Form,
  Select,
  Divider,
  Tag,
  Tabs,
  Upload,
  message,
} from "antd";
import { useState, Fragment, useEffect, useRef } from "react";
import { Label, Row, Col } from "reactstrap";
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { serverConfig } from "../../const/serverConfig";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

const EditAccount = () => {
  const userInfo = useSelector((state) => state.auth.user_info);
  const [userForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");

  const handleLogin = async (intervalId) => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    if (context && videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capImage = canvas.toDataURL("image/jpeg");

      const response = await fetch(capImage);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      const formData = new FormData();
      formData.append("image", file);
      const url = `${serverConfig.server}/api/v1/search-image`;
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            const url = `${serverConfig.server}/api/v1/delete-face/${userInfo?.id}`;

            axios
              .get(url)
              .then((res) => {
                if (res?.data.data?.status === "ok") {
                  clearInterval(intervalId);
                  message.success("Làm mới khuôn mặt thành công");
                  stopCamera();
                }
              })
              .catch((err) => {
                console.log(err);
                message.success("Làm mới thất bại");
              });
          }
        });
    }
  };

  const hadleResetFace = async () => {
    try {
      //start came
      startCamera();

      const intervalId = setInterval(async () => {
        handleLogin(intervalId);
      }, 100);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        message.error("Làm mới khuôn mặt thất bại");
        stopCamera();
      }, 5000); // 10 giây
    } catch (err) {
      console.log(err);
    }
  };

  // Xử lý camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      message.error("Không thể truy cập camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    if (context && videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };

  // Xử lý form thông tin
  const handleUpdateInfo = (values) => {
    console.log("Update info:", values);
    message.success("Cập nhật thông tin thành công");
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = (values) => {
    console.log("Change password:", values);
    message.success("Đổi mật khẩu thành công");
    passwordForm.resetFields();
  };

  // Xử lý đăng ký khuôn mặt
  const handleFaceRegister = async () => {
    if (capturedImage) {
      try {
        const response = await fetch(capturedImage);

        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        const formData = new FormData();
        formData.append("image", file);
        const url = `${serverConfig.server}/api/v1/upsert-image`;

        axios
          .post(url, formData, {
            params: {
              name: userInfo.name,
              id: userInfo.id,
            },
            headers: {
              //   "Content-Type": "application/octet-stream", // Đặt kiểu content-type cho dữ liệu byteArray
            },
          })
          .then((response) => {
            console.log("Response:", response.data);
            if (response?.data?.status) {
              if (response?.data?.data?.status === 200) {
                message.success("Thêm khuôn mặt thành công");
              } else {
                console.log(response?.data?.data);
                if (response?.data?.data?.message.includes("skewed")) {
                  message.success("Mặt lệch quá");
                } else if (response?.data?.data?.message.includes("no")) {
                  message.success("Không tìm thấy khuôn mặt đâu");
                } else {
                  message.success("Chi được có 1 khuôn mặt trong khung hình");
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            message.error("Đăng ký thất bại");
          });

        // setCapturedImage(null);
      } catch (err) {
        console.log(err);
        message.error("Đăng ký thất bại");
      }
    }
  };

  return (
    <Card>
      <Breadcrumb
        style={{ marginBottom: "14px" }}
        items={[
          {
            title: (
              <span style={{ fontWeight: "bold" }}>Thông tin tài khoản</span>
            ),
          },
        ]}
      />
      <Divider style={{ margin: "10px" }} />

      <Tabs
        defaultActiveKey="1"
        className="custom-tabs"
        // style={tabStyle}
        items={[
          {
            key: "1",
            label: (
              <span>
                <UserOutlined />
                Thông tin cá nhân
              </span>
            ),
            children: (
              <Form
                form={userForm}
                layout="vertical"
                onFinish={handleUpdateInfo}
                initialValues={{
                  name: name,
                  username: username,
                }}
              >
                <Row>
                  <Col sm="6">
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm="6">
                    <Form.Item
                      label="Tên tải khoản"
                      name="username"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <LockOutlined />
                Đổi mật khẩu
              </span>
            ),
            children: (
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
              >
                <Form.Item
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu mới",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Đổi mật khẩu
                </Button>
              </Form>
            ),
          },
          {
            key: "3",
            label: (
              <span>
                <CameraOutlined />
                Đăng ký khuôn mặt
              </span>
            ),
            children: (
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    backgroundColor: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 16,
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

                <div style={{ textAlign: "center" }}>
                  {!isCapturing && !capturedImage && (
                    <>
                      <Button
                        type="primary"
                        icon={<CameraOutlined />}
                        onClick={startCamera}
                      >
                        Bắt đầu
                      </Button>

                      <Button
                        type="primary"
                        // icon={<CameraOutlined />}
                        // onClick={startCamera}
                        onClick={() => hadleResetFace()}
                        style={{ marginLeft: "4px" }}
                      >
                        Xoá khuôn mặt
                      </Button>
                    </>
                  )}

                  {isCapturing && (
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      onClick={captureImage}
                    >
                      Chụp ảnh
                    </Button>
                  )}

                  {capturedImage && (
                    <>
                      <Button
                        style={{ marginRight: 8 }}
                        onClick={() => {
                          setCapturedImage(null);
                          startCamera();
                        }}
                      >
                        Chụp lại
                      </Button>
                      <Button type="primary" onClick={handleFaceRegister}>
                        Xác nhận đăng ký
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default EditAccount;
