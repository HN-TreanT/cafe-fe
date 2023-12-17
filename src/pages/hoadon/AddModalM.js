import {
Row,
  Input,
  Col,
  Modal,
  Button,
  Form,
  Select
} from "antd";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { Plus, X } from "react-feather";
import {
  PlusOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { message, Upload } from "antd";
import { createUseMaterial, updateUseMaterial } from "../../utils/services/useMaterial";
import { getMaterial, updateMaterial } from "../../utils/services/material";
const AddModal = ({
  isAdd,
  getData,
  action,
  idProduct,
  handleModal,
  idEdit,
}) => {
  const [form] = Form.useForm();
  const [material, setMaterial] = useState()
  const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const onReset = () => {
    form.resetFields();
    handleModal();
  };
  const [file, setFile] = useState(null);
  const MySwal = withReactContent(Swal);
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = (uploadFile) => {
    setFileUrl(URL.createObjectURL(uploadFile));
    return false;
  };
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
 useEffect(() => {
  getAllMaterial()
 }, [])
  const onFinish = (values) => {
    if (action === "Add") {
      createUseMaterial({
        id_product: idProduct,
        ...values
      })
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
            form.resetFields();
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
      updateUseMaterial(idEdit, {
        id_product : idProduct,
        ...values
      })
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
    <Modal
      open={isAdd}
      toggle={handleModal}
      onCancel={onReset}
      contentClassName="pt-0"
      autoFocus={false}
      className="modal-xl"
      footer={[]}
    >
      <div className="" toggle={handleModal} tag="div">
        <h2 className="modal-title">
          {action === "Add" ? "Thêm mới nguyên liệu" : "Chỉnh sửa nguyên liệu"}
        </h2>
      </div>

      <div className="flex-grow-1">
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={15}>
                    <Col span={12}>
                      <Form.Item
                        style={{ marginBottom: "4px" }}
                        name="id_material"
                        label={
                          <span>
                            Tên nguyên liệu<span className="redColor">(*)</span>
                          </span>
                        }
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
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span>
                            Số lượng<span className="redColor">(*)</span>
                          </span>
                        }
                        name="amount"
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
          </Row>
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
      </div>
    </Modal>
  );
};
export default AddModal;
