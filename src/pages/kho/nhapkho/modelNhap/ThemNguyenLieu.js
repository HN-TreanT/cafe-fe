import React from "react";
import { Form, Row, Col, Button, Select, Input, DatePicker } from "antd";
import { message } from "antd";
import { ShipmentServices } from "../../../../utils/services/shipmentDetail";

const { Option } = Select;

const ThemNguyenLieu = ({ material, onBack, onFinishNL }) => {
    const [form] = Form.useForm();
    return (
        <Form onFinish={onFinishNL} layout="vertical" form={form}>
            <Row gutter={15}>
                <Col span={12}>
                    <Form.Item
                        style={{ marginBottom: "4px" }}
                        label={"Amount"}
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Nhập số lượng",
                            }

                        ]}
                    >
                        <Input type="number" placeholder="Nhập số lượng" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        style={{ marginBottom: "4px" }}
                        label={"Price"}
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Nhập giá",
                            }

                        ]}
                    >
                        <Input type="number" placeholder="Nhập giá" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item
                        style={{ marginBottom: "4px" }}
                        label={"Material"}
                        name="id_material"
                        rules={[
                            {
                                required: true,
                                message: "Chọn nguyên liệu",
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn nguyên liệu"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                            }
                        >
                            {material.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        style={{ marginBottom: "4px" }}
                        label={"Ngày hết hạn"}
                        name="expiration_date"
                        rules={[
                            {
                                required: true,
                                message: "Nhập ngày hết hạn",
                            }

                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày hết hạn" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={4}></Col>
                <Col span={16}>
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                marginTop: "10px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            &nbsp;
                            <Button onClick={onBack}>Back</Button>
                        </div>
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
            </Row>
        </Form>
    );
};

export default ThemNguyenLieu;