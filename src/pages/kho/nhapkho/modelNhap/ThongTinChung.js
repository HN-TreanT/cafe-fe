import React, { Fragment } from "react";
import { Form, Row, Col, Button, Select } from "antd";
import { message } from "antd";

const { Option } = Select;

const ThongTinChung = ({ nhacc, nhanvien, onFinish }) => {
  const [form] = Form.useForm();
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <Fragment>
      <Form onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: "4px" }}
              label={"Nhà cung cấp"}
              name="id_supplier"
              rules={[
                {
                  required: true,
                  message: "Chọn nhà cung cấp",
                },
              ]}
            >

              <Select allowClear showSearch options={Array.isArray(nhacc) ? nhacc.map((item) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.name
                }
              }) : []} placeholder="Chọn nhà cung cấp  "
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: "4px" }}
              label={"Nhân viên nhập kho"}
              name="id_employee"
              rules={[
                {
                  required: true,
                  message: "Chọn nhân viên nhập kho",
                },
              ]}
            >

              <Select allowClear showSearch options={Array.isArray(nhanvien) ? nhanvien.map((item) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.name,
                }
              }) : []} placeholder="chọn nhà cung cấp với nhân viên"
                filterOption={filterOption}
              />
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
                  Next
                </Button>
              </div>
            </Form.Item>
          </Col>
          <Col span={4}></Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default ThongTinChung;