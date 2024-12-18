import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { message } from "antd";
import { userServices } from "../../../utils/services/userService";
import { authServices } from "../../../utils/services/authService ";
const FormItem = Form.Item


interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    action: string,
    getData: any,
    roles: any

}
const ModalAddEdit = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const { curData, open, handleModal, action, getData, roles } = props
    const handleModalClose = () => {
        handleModal()
        form.resetFields()
    }
    useEffect(() => {
        if (curData) {
            form.setFieldsValue({
                name: curData?.name ? curData?.name : "",
                username: curData?.username ? curData?.username : "",
                id_role: curData?.id_role ? curData?.id_role :null
            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
        try {
            if (action === "Add") {
                authServices.register(values).then((res) => {
                    getData()
                    handleModalClose()
                    message.success("Thêm mới thành công")
                }).catch(err => {
                    console.log(err)
                    message.error("Thêm người dùng thất bại")
                })
            } else {
               const  data = {
                    ...values,
                    password: "dhdh"

                }
                userServices.editUser(data).then((res) => {
                    getData()
                    handleModalClose()
                    message.success("Chỉnh sửa người dùng thành công")
                }).catch(err => {
                    console.log(err)
                    message.error("Chỉnh sửa  người dùng thất bại")
                })
            }
        } catch (err: any) {
            console.log(err)
            message.error(" thất bại")
        }

    }
    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới người dùng" : "Chỉnh sửa người dùng"}
            open={open}
            footer={null}
            onCancel={() => handleModalClose()}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <Row gutter={16}>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Tên người dùng"
                            }
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người dùng'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập tên người dùng' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Tên đăng nhập"
                            }
                            name='username'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên đăng nhập'
                                }
                            ]}
                        >
                            <Input  disabled={action === "Edit" ? true : false} placeholder="Nhập tên đăng nhập" />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Mật khẩu"
                            }
                            name='password'
                            rules={[
                                {
                                    required: action === "Edit" ? false : true,
                                    message: 'Vui lòng nhập mật khẩu'
                                }
                            ]}
                        >
                            <Input.Password 
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            disabled={action === "Edit" ? true : false} placeholder='Nhập mật khẩu' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Quyền người dùng"
                            }
                            name='id_role'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn quyền người dùng'
                                }
                            ]}
                        >
                            <Select options={roles.map((item: any) =>  {
                                return {
                                    label: item.name,
                                    value: item.id
                                }
                            })} placeholder='Chọn quyền' allowClear />
                        </FormItem>
                    </Col>
                   
                </Row>
                <Row>

                    <Col span={4}></Col>
                    <Col span={16}
                    >
                        <Form.Item>
                            <div style={{ display: "flex", marginTop: "10px", alignItems: "center", justifyContent: "center" }}>

                                {
                                    action === "Add" ? <Button type="primary" htmlType="submit">Thêm mới</Button> : <Button style={{ width: "80px" }} type="primary" htmlType="submit">Lưu</Button>
                                }
                                <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => handleModalClose()}>Hủy</Button>

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={4}></Col>

                </Row>
            </Form>

        </Modal>
    </Fragment>
};

export default ModalAddEdit
