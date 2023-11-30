import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, DatePicker, Select, Button, Input } from 'antd'
import { message } from "antd";
import { useDispatch } from "react-redux";
import useAction from "../../../redux/useActions";
import dayjs from "dayjs";
import { nhanvienServices } from "../../../utils/services/nhanvienService";
import { supplierServices } from "../../../utils/services/supplier";
import { ShipmentServices } from "../../../utils/services/shipment";
import { Space } from 'antd';
const FormItem = Form.Item;
const ModalNhanKho = ({ shipment, material, nhacc, nhanvien, curData, open, handleModal, action, getData }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    // const options = Array.isArray(material)
    //     ? material.map((item) => ({
    //         ...item,
    //         value: item.id,
    //         label: item.name,
    //     }))
    //     : [];

    const onFinish = async (values) => {
        const dataSubmit = {
            ...values,
        }
        try {
            if (action === "Add") {
                const res = await ShipmentServices.create(dataSubmit)
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Thêm mới thành công")
                } else {
                    message.error(res.message)
                }
            } else {
                const res = await ShipmentServices.update(curData.Ma_LSTT, dataSubmit)
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Chỉnh sửa thành công")
                } else {
                    message.error(res.message)
                }
            }
        } catch (err) {
            console.log(err)
            message.error(" thất bại")
        }

    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    useEffect(() => {
        // Thiết lập giá trị cho các trường của form từ curData khi curData thay đổi
        form.setFieldsValue({
            id: curData?.id,
            amount: curData?.amount ?? null, // Sử dụng nullish coalescing operator (??) để xác định giá trị mặc định
            price: curData?.price ?? null,
            material: curData?.material ?? null
        });
    }, [curData, form]);

    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới người mượn " : "Chỉnh sửa người mượn"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >
                <Row gutter={15}>
                    <Col span={12}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                " mã nhà cung cấp với nhân viên"
                            }
                            name='id_shipment'
                            rules={[
                                {
                                    required: true,
                                    message: 'chọn nhà cung cấp với nhân viên'
                                }
                            ]}
                        >
                            <Select allowClear showSearch options={Array.isArray(shipment) ? shipment.map((item) => {
                                return {
                                    ...item,
                                    value: item.id,
                                    label: item.id,
                                }
                            }) : []} placeholder="chọn nhà cung cấp với nhân viên"
                                filterOption={filterOption}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "ngày hết hạn "
                            }
                            name='expiration_date'
                            rules={[
                                {
                                    required: true,
                                    message: 'nhập ngày'
                                }
                            ]}
                        >

                            <DatePicker style={{ width: "100%" }} placeholder='Chọn ngày hết hạn' />
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "số lượng "
                            }
                            name='amount'
                            rules={[
                                {
                                    required: true,
                                    message: 'số lượng'
                                }
                            ]}
                        >
                            <Input placeholder='giá' />
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "giá "
                            }
                            name='price'
                            rules={[
                                {
                                    required: true,
                                    message: 'giá'
                                }
                            ]}
                        >
                            <Input placeholder='giá' />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "nguyên liệu "
                            }
                            name='id_material'
                            rules={[
                                {
                                    required: true,
                                    message: 'nhập nguyên liệu'
                                }
                            ]}
                        >
                            <Select allowClear showSearch options={Array.isArray(material) ? material.map((item) => {
                                return {
                                    ...item,
                                    value: item.id,
                                    label: item.name,
                                }
                            }) : []} placeholder="chọn nguyên liệu"
                                filterOption={filterOption}
                            />
                            {/* <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="chọn nguyên liệu"
                                defaultValue={[]}
                                // onChange={handleChange}
                                optionLabelProp="label"
                                options={options}

                            /> */}
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

export default ModalNhanKho
