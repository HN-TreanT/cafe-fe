import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload, Checkbox } from 'antd'
import { message } from "antd";
import { comboServices } from "../../../utils/services/comboServices";
const FormItem = Form.Item


interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    action: string,
    getData: any,
    product: any,

}
const { Option } = Select;
const ModalAddCombo = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const { curData, open, handleModal, action, getData, product } = props
    useEffect(() => {
        if (curData) {
    
          const id_details = Array.isArray(curData?.detail_combos) ? curData?.detail_combos.map((item: any) => item.id_product) : []
            form.setFieldsValue({
                name: curData?.name ? curData?.name : "",
                price: curData?.price ? curData?.price : "",
                id_products: id_details
            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
      
        const dataSubmit = {
            ...values,
            id_products:Array.isArray( values?.id_products) ? values?.id_products.map((item: any) => {
                return {
                    id_product: item,
                    check_bonus: false
                }
            }) : []
        }
        try {
            if (action === "Add") {
                const res = await comboServices.create({
                    ...dataSubmit,
                
                })
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Thêm mới thành công")
                } else {
                    message.error(res.message)
                }
            } else {

                const res = await comboServices.update(curData.id, dataSubmit)
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
                    <Col span={24}>
                        <Form.Item
                            style={{ marginBottom: "4px" }}
                            label={"Sản phẩm"}
                            name="id_products"
                            rules={[
                                {
                                    required: true,
                                    message: "Chọn sản phẩm",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                mode="multiple"
                                showSearch
                                placeholder="Chọn sản phẩm"
                                filterOption={(input: any, option: any) =>
                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {product.map((item: any) => (                               
                                        <Option key={item._product} value={item.id} name={item.id_product}>
                                            
                                            {item.name}
                                        </Option>                                 
                                ))}

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>

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
