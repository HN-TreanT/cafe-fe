import {
    Table,
    Input,
    Row,
    Col,
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
  
  import useAction from "../../../../../src/redux/useActions";
  import { useDispatch, useSelector } from "react-redux";
  import {
    createProduct,
    updateProduct,
  } from "../../../../../src/utils/services/productServices ";
  import withReactContent from "sweetalert2-react-content";
  import { message, Upload } from "antd";
  const Thongtinchung = ({
    step,
    setStep,
    setId,
    getData,
    action,
    category,
    handleModal,
    idEdit,
  }) => {
    const [form] = Form.useForm();
  
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
  
    const handlePreview = async (file) => {
      let src = file.url || "";
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    };
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
   
    const handleChangeFile = (e) => {
      setFile(e.file);
    };
  
    useEffect(() => {
      if(action === 'Edit') {
       console.log("idedit", idEdit)
      form.setFieldValue(idEdit)
     }
    }, [idEdit?.id])
    const onFinish = (values) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", values.name);
      formData.append("unit", values.unit);
      formData.append("price", values.price);
      formData.append("id_category", values.id_category);
  
      if (action === "Add") {
        createProduct(formData)
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
              setId(res)
              setStep(step+1) 
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
        updateProduct(idEdit?.id, values)
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
            <Row gutter={16}>
            <Col span={12} className="gutter-row">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="name"
                    label="Tên sản phẩm"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên sản phẩm",
                      },
                      {
                        validator: (rule, value) => {
                          if (value && value.trim() === "") {
                            return Promise.reject("Không hợp lệ");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
              </Col>
              <Col span={12} className="gutter-row">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="id_category"
                    label="Loại sản phẩm"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập loại sản phẩm",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      options={category}
                      style={{ width: "100%" }}
                      placeholder="Chọn loại sản phẩm"
                      onKeyPress={(e) => {}}
                    ></Select>
                  </Form.Item>
                </Col>  
                <Col span={12} className="gutter-row">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="price"
                  label="Giá bán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá bán",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject("Không hợp lệ");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập giá bán" />
                </Form.Item>
              </Col>
              <Col span={12} className="gutter-row">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="unit"
                  label="Đơn vị tính"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập đơn vị tính",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject("Không hợp lệ");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập đơn vị tính" />
                </Form.Item>
              </Col>
              <Col span={12} className="gutter-row">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="description"
                  label="Mô tả"
                  rules={[
                    {
                      message: "Vui lòng nhập mô tả",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Nhập mô tả" />
                </Form.Item>
              </Col>
              <Col span={12} className="gutter-row">
                  <Form.Item
                    label="Ảnh mặt hàng"
                    name="file"
                    rules={[
                      {
                        required: true,
                        message: "Ảnh mặt hàng không  được bỏ trống",
                      },
                    ]}
                  >
                    <Upload
                      name="file"
                      onChange={handleChangeFile}
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={handleUpload}
                      onPreview={handlePreview}
                    >
                      {fileUrl ? (
                        <img
                          src={fileUrl ? fileUrl : ""}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
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
    );
  };
  export default Thongtinchung;
  