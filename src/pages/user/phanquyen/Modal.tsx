import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { message } from "antd";
import { userServices } from "../../../utils/services/userService";
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
                id: curData?.id ? curData?.id : "",
            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
        try {
            if (action === "Add") {
                userServices.createRole(values).then((res) => {
                    getData()
                    handleModalClose()
                    message.success("Thêm mới thành công")
                }).catch(err => {
                    console.log(err)
                    message.error("Thêm mới thất bại")
                })
            } else {
                userServices.editRole(values).then((res) => {
                    getData()
                    handleModalClose()
                    message.success("Chỉnh sửa  thành công")
                }).catch(err => {
                    console.log(err)
                    message.error("Chỉnh sửa thất bại")
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
                                "Mã quyền"
                            }
                            name='id'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã quyền'
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
                                "Tên quyền"
                            }
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên quyền'
                                }
                            ]}
                        >
                            <Input   placeholder="Nhập tên quyền" />
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
