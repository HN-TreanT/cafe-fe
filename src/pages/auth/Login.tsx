import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Row, Col } from "antd";
import { message } from "antd";
import { authServices } from "../../utils/services/authService ";
import { useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { useNavigate } from "react-router-dom";
import { RouterLinks } from "../../const/RouterLinks";
import loginBack from "../../assets/login-v2.svg";
import Logo from "../../assets/snapedit_1702777474789.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import Webcam from "react-webcam";
import axios from "axios";
import { serverConfig } from "../../const/serverConfig";
const Login = () => {
  const webcamRef = useRef<any>();
  const [isLoginWithFace, setIsLoginWithFace] = useState(false);

  const handleTest = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        // Tạo một đối tượng FormData và thêm file vào đó
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
            if (!response?.data?.data) {
            } else {
              setIsLoginWithFace(false);
              dispatch(actions.AuthActions.userInfo(response.data?.data));
              localStorage.setItem("role", response.data?.data.id_role);
              localStorage.setItem("username", response.data?.data.username);
              localStorage.setItem("name", response.data?.data.name);
              localStorage.setItem("token", response.data?.data.access_token);
              localStorage.setItem(
                "refresh_token",
                response.data.refresh_token
              );
              localStorage.setItem(
                "permissions",
                response.data?.data.permissions
              );
              if (response.data?.data?.id_role === "U") {
                navigate(RouterLinks.ORDER_PAGE);
              }
              if (response.data?.data?.id_role === "M") {
                navigate(RouterLinks.CHEF_PAGE);
              } else {
                navigate(RouterLinks.HOME_PAGE);
              }
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    if (isLoginWithFace) {
      const intervalId = setInterval(async () => {
        handleTest();
      }, 100);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsLoginWithFace(false);
        message.error("Đăng nhập thất bại");
      }, 5000); // 10 giây

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [isLoginWithFace]);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const actions = useAction();

  const onFinish = async (value: any) => {
    try {
      const res = await authServices.login(value);
      if (res.status) {
        console.log("res.status", res.data.name);
        dispatch(actions.AuthActions.userInfo(res.data));
        localStorage.setItem("role", res.data.id_role);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        localStorage.setItem("permissions", res.data.permissions);
        navigate(RouterLinks.HOME_PAGE);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err);
      message.error("Đăng nhập thất bại");
    }
  };

  const handleClickFaceLogin = () => {
    setIsLoginWithFace(true);
    // startVideo();
  };

  return (
    <div className="login">
      {contextHolder}
      <Row>
        <Col span={16}>
          <img
            src={loginBack}
            className="login-background"
            alt="htht"
            style={{ width: "90%" }}
          />
        </Col>
        <Col
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          span={8}
        >
          <img src={Logo} className="logo-login" alt="htht" height={200} />
          <div
            style={{
              fontSize: "25px",
              marginBottom: "1px",
              fontWeight: "600",
              fontFamily: "cursive",
            }}
          >
            {" "}
            QUẢN LÍ BÁN CAFFE
          </div>
          <div style={{ margin: "30px", width: "75%" }}>
            {isLoginWithFace ? (
              <div style={{ height: "300px", width: "300px" }}>
                <div
                  className="appvide"
                  style={{ height: "300px", width: "300px" }}
                >
                  <Webcam height={300} width={300} ref={webcamRef} />
                </div>

                <Button
                  onClick={() => {
                    setIsLoginWithFace(false);
                  }}
                >
                  stop
                </Button>
                <Button onClick={handleTest}>Test</Button>
              </div>
            ) : (
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  style={{ marginBottom: "7px" }}
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên đăng nhập không được bỏ trống",
                    },
                    {
                      validator: async (_, value) => {
                        if (value) {
                          const regex = /^\s*$/;
                          if (regex.test(value)) {
                            throw new Error("Tên bài không hợp lệ !");
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="Tên đăng nhập" />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Mât khảu không được bỏ trống",
                    },
                  ]}
                >
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      style={{ width: "90%" }}
                      htmlType="submit"
                      type="primary"
                    >
                      Đăng nhập
                    </Button>

                    <FontAwesomeIcon
                      style={{
                        fontSize: "30px",
                        color: "#1677ff",
                        cursor: "pointer",
                      }}
                      icon={faFaceSmile}
                      onClick={handleClickFaceLogin}
                    />
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
function useCallback(arg0: () => void, arg1: React.MutableRefObject<any>[]) {
  throw new Error("Function not implemented.");
}
