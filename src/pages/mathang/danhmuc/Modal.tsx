import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button } from 'antd'
import { categoryServices } from "../../../utils/services/categoryServices";
import { message } from "antd";
import dayjs from "dayjs";
const FormItem = Form.Item


interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    action: string,
    getData: any

}
const ModalAddCanBo = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const { curData, open, handleModal, action, getData } = props
    useEffect(() => {
        if (curData) {

            form.setFieldsValue({
                name: curData?.name ? curData?.name : "",


            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
        try {
            if (action === "Add") {
                const res = await categoryServices.create({
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

                const res = await categoryServices.update(curData.id, values)
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
            title={action === "Add" ? "Thêm mới danh mục" : "Chỉnh sửa danh mục"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <FormItem
                    style={{ marginBottom: "4px" }}
                    label={
                        "Tên danh mục"
                    }
                    name='name'
                    rules={[
                        {
                            required: true,
                            message: 'Nhập tên danh mục'
                        }
                    ]}
                >
                    <Input placeholder='Nhập tên danh mục' />
                </FormItem>

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

export default ModalAddCanBo
