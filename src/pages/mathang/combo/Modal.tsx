import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload } from 'antd'
import { message } from "antd";
import { comboServices } from "../../../utils/services/comboServices";
const FormItem = Form.Item


interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    action: string,
    getData: any,

}
const ModalAddCombo = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const { curData, open, handleModal, action, getData } = props
    useEffect(() => {
        if (curData) {

            form.setFieldsValue({
                name: curData?.name ? curData?.name : "",
                price: curData?.price ? curData?.price : "",
            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
        try {
            if (action === "Add") {
                const res = await comboServices.create({
                    ...values,
                    role_id: "U"
                })
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Thêm mới thành công")
                } else {
                    message.error(res.message)
                }
            } else {

                const res = await comboServices.update(curData.id, values)
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Chỉnh sửa thành công")
                } else {
                    message.error(res.message)
                }
            }
        } catch (err: any) {
            console.log(err)
            message.error(" thất bại")
        }

    }
    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới các combo" : "Chỉnh sửa combo"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <Row gutter={16}>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Tên mặt hàng"
                            }
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập tên combo'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập tên combo' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Giá"
                            }
                            name='price'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập giá'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập giá' />
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
                                <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => handleModal()}>Hủy</Button>

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={4}></Col>

                </Row>
            </Form>

        </Modal>
    </Fragment>
};

export default ModalAddCombo
