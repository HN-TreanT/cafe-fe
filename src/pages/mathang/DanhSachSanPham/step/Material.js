import { Table, Input, Card, Modal, Button, Form, Select, Space, Row, Col, } from "antd";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { Label,  UncontrolledTooltip } from "reactstrap";
import { Plus, X } from "react-feather";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

import useAction from "../../../../../src/redux/useActions";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
} from "../../../../../src/utils/services/productServices ";
import withReactContent from "sweetalert2-react-content";
import { message, Upload } from "antd";
import {
  createMaterial,
  getMaterial,
} from "../../../../utils/services/material";
import { createMany } from "../../../../utils/services/useMaterial";
const Material = ({
  step,
  setStep,
  id,
  getData,
  action,
  category,
  handleModal,
  idEdit,
}) => {
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [form] = Form.useForm();
  const [material, setMaterial] = useState([]);
  const getAllMaterial = () => {
    getMaterial({
      param: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const temps = res.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setMaterial(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onReset = () => {
    form.resetFields();
    handleModal();
  };
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    getAllMaterial();
  }, []);
  const onFinish = (values) => {
    const t = values.users.map((item) => {
        return {
          id_product: id.data.id,
          ...item,
        };
      });
      
      
    if (action === "Add") {
      createMany(t)
        .then((res) => {
          MySwal.fire({
            title: "Thêm mới thành công",
            text: "Yêu cầu đã được phê duyệt!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success",
            },
          }).then((result) => {
            getData();
            handleModal();
          });
        })
        .catch((err) => {
          MySwal.fire({
            title: "Thêm mới thất bại",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    } else {
      updateProduct(idEdit, values)
        .then((res) => {
          MySwal.fire({
            title: "Chỉnh sửa thành công",
            text: "Yêu cầu đã được phê duyệt!",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success",
            },
          }).then((result) => {
            handleModal();
            getData();
            form.resetFields();
          });
        })
        .catch((err) => {
          MySwal.fire({
            title: "Chỉnh sửa thất bại",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    }
  };

  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      layout="vertical"
    >
      
        <Form.List name="users" style={{ marginTop: "15px" }}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={15}>
                    <Col span={12}>
                      <Form.Item
                        style={{ marginBottom: "4px" }}
                        name={[name, "id_material"]}
                        label="Tên nguyên liệu"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nguyên liệu",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          allowClear
                          filterOption={filterOption}
                          options={material}
                          style={{  width:"100%" }}
                          placeholder="Chọn nguyên liệu"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        label={
                          <span>
                            Số lượng
                          </span>
                        }
                        name={[name, "amount"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng",
                          },
                        ]}
                      >
                        
                        <Input
                          // style={{ width:"100%"}}
                          placeholder="Nhập số lượng"
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                  </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm nguyên liệu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
     
      <Form.Item style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          htmlType="submit"
          className="addBtn"
          style={{ marginRight: "20px", width: "94px" }}
        >
          Lưu
        </Button>
        <Button
          htmlType="button"
          className="addBtn"
          onClick={onReset}
          style={{ width: "94px" }}
        >
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Material;
