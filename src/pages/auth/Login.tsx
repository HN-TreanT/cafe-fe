import React from "react";
import { Form, Button, Input, Row, Col } from "antd"
import { message } from "antd";
import { authServices } from "../../utils/services/authService ";
import { useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { useNavigate } from "react-router-dom";
import { RouterLinks } from "../../const/RouterLinks";
const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const actions = useAction()

  const onFinish = async (value: any) => {
    try {
      const res = await authServices.login(value);
      console.log(res)
      if (res.status) {
        dispatch(actions.AuthActions.userInfo(res.data))
        localStorage.setItem("username", res.data.TaiKhoan)
        localStorage.setItem("token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)
        navigate(RouterLinks.HOME_PAGE)
      } else {
        message.error(res.message)
      }
    } catch (err) {
      console.log(err);
      message.error("Đăng nhập thất bại")
    }
  }
  return <div className="login">
    {contextHolder}
    <Row>
      <Col span={8}></Col>
      <Col span={8}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={
              [
                {
                  required: true,
                  message: "Tên đăng nhập không được bỏ trống"
                },
                {
                  validator: async (_, value) => {
                    if (value) {
                      const regex = /^\s*$/
                      if (regex.test(value)) {
                        throw new Error("Tên bài không hợp lệ !")
                      }

                    }
                  },
                }
              ]
            }
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={
              [
                {
                  required: true,
                  message: "Mât khảu không được bỏ trống"
                },

              ]
            }
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">Đăng nhập</Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}></Col>
    </Row>
  </div>;
};

export default Login;
