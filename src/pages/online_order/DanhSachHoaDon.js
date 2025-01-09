import {
  Table,
  Card,
  Breadcrumb,
  Select,
  Divider,
  Tag,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
import { Label } from "reactstrap";
import moment from "moment";
import { orderServices } from "../../utils/services/orderService";
import { convertPrice } from "../../utils/helper/convertPrice";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { values } from "lodash";

const OnlineOrder = () => {
  const [loading, setLoading] = useState(false);
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [openDetail, setOpenDetail] = useState(false);
  const [record, setRecord] = useState();

  const handelOpenDetail = () => {
    setOpenDetail(false);
  };

  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [employee, setEmployee] = useState([]);
  //search
  const [searchEmployee, setSearchEmployee] = useState();
  const [searchStatus, setSearchStatus] = useState();

  const [isEdit, setIsEdit] = useState(false);
  const [seletedRecord, setSeletedRecord] = useState();

  const MySwal = withReactContent(Swal);

  const handleModalEdit = () => {
    setIsEdit(false);
  };

  const onReset = () => {
    form.resetFields();
    handleModalEdit();
  };

  const status = [
    {
      value: 0,
      label: "Đang giao hàng",
    },
    {
      value: 1,
      label: "Đã giao hàng",
    },
    {
      value: 2,
      label: "Đơn hủy",
    },
  ];

  const getData = () => {
    setLoading(true);
    orderServices
      .get({
        page: currentPage,
        limit: rowsPerPage,

        id_employee: searchEmployee,
        status: searchStatus,
      })
      .then((res) => {
        const t = res.data.data.map((item) => {
          return {
            ...item,
            key: item.id,
          };
        });
        setData(t);
        setCount(res.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [currentPage, rowsPerPage, searchEmployee, searchStatus]);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 30,
      align: "center",
      render: (text, record, index) => (
        <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
      ),
    },

    {
      title: "Khách hàng",
      dataIndex: "customer",
      align: "center",
      render: (text, record, index) => {
        return (
          <span>
            {record?.customer?.name ? record?.customer?.name : "Khách vãng lai"}
          </span>
        );
      },
    },

    {
      title: "Số điện thoại liên hệ",
      dataIndex: "customer",
      align: "center",
      render: (text, record, index) => {
        return (
          <span>
            {record?.customer?.phone_number
              ? record?.customer?.phone_number
              : ""}
          </span>
        );
      },
    },

    {
      title: "Email",
      dataIndex: "customer",
      align: "center",
      render: (text, record, index) => {
        return (
          <span>{record?.customer?.email ? record?.customer?.email : ""}</span>
        );
      },
    },

    {
      title: "Thành tiền",
      dataIndex: "total_price",
      align: "center",
      render: (value) => convertPrice(value),
    },

    {
      title: "Trạng thái",
      align: "center",
      render: (text, record, index) => {
        return (
          <Tag
            color={
              record.status === 1
                ? "green"
                : record.status === 2
                ? "red"
                : "blue"
            }
          >
            {record.status === 1
              ? "Đã giao hàng"
              : record.status === 2
              ? "Đã huỷ"
              : "Đang giao hàng"}
          </Tag>
        );
      },
    },

    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {localStorage.getItem("role") === "sp" ? (
            <Tooltip
              destroyTooltipOnHide
              placement="top"
              title="Xác nhận giao hàng thành công"
            >
              <CheckOutlined
                style={{
                  color: "#036CBF",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => handleConfirm(record?.id)}
              />
            </Tooltip>
          ) : (
            <>
              <Tooltip destroyTooltipOnHide placement="top" title="Chỉnh sửa">
                <EditOutlined
                  style={{
                    color: "#036CBF",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsEdit(true);
                    setSeletedRecord(record.id);
                  }}
                />
              </Tooltip>

              <Popconfirm
                title="Bạn chắc chắn huỷ?"
                // onConfirm={() => handleDelete(record.id)}
                cancelText="Hủy"
                okText="Đồng ý"
              >
                <Tooltip destroyTooltipOnHide placement="top" title="Xoá">
                  <DeleteOutlined
                    style={{
                      color: "red",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  />
                </Tooltip>
              </Popconfirm>

              <>
                <Tooltip
                  destroyTooltipOnHide
                  placement="top"
                  title="Xem chi tiết"
                >
                  <EyeOutlined
                    style={{
                      color: "#036CBF",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRecord(record);
                      setOpenDetail(true);
                    }}
                  />
                </Tooltip>
              </>
            </>
          )}
        </div>
      ),
    },
  ];

  const onFinish = (values) => {
    const dataSubmit = {
      ...values,
      id_oder: seletedRecord,
    };
    orderServices
      .changeStatus(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Chuyển trạng thái thành công",
          text: "Yêu cầu đã được phê duyệt!",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-success",
          },
        }).then((result) => {
          getData();
          form.resetFields();
          handleModalEdit();
        });
      })
      .catch((err) => {
        MySwal.fire({
          title: "Chuyển trạng thái thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
    console.log(dataSubmit);
  };

  const handleConfirm = (id) => {
    const dataSubmit = {
      status: 1,
      id_oder: id,
    };
    orderServices.changeStatus(dataSubmit).then((res) => {
      MySwal.fire({
        title: "Chuyển trạng thái thành công",
        text: "Yêu cầu đã được phê duyệt!",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
      }).catch((err) => {
        MySwal.fire({
          title: "Chuyển trạng thái thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        console.log(err);
      });
    });
  };

  return (
    <Card>
      <Breadcrumb
        style={{ margin: "auto", marginLeft: 0 }}
        items={[
          {
            title: "Online",
          },
          {
            title: (
              <span style={{ fontWeight: "bold" }}>Danh sách đơn hàng</span>
            ),
          },
        ]}
      />
      <Divider style={{ margin: "10px" }}></Divider>
      <Row gutter={15} style={{ marginBottom: "10px" }}>
        {/* <Col span={6} style={{ textAlign: "start" }}>
          <div>Nhân viên</div>
          <div style={{ width: "100%" }}>
            <Select
              onChange={(e) => {
                setSearchEmployee(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={employee}
              style={{ width: "100%" }}
              placeholder="Chọn nhân viên"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col> */}
        {/* <Col span={6} style={{ textAlign: "start" }}>
          <div>Trạng thái</div>
          <div style={{ width: "100%" }}>
            <Select
              onChange={(e) => {
                setSearchStatus(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={status}
              style={{ width: "100%" }}
              placeholder="Chọn trạng thái"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col> */}
        <Col span={8}></Col>
      </Row>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        // expandable={{
        //   expandedRowRender: (record) => {
        //     return <OrderDetail record={record?.id} />;
        //   },
        //   rowExpandable: (record) => record.name !== "Not Expandable",
        // }}
        pagination={{
          current: currentPage,
          pageSize: rowsPerPage,
          defaultPageSize: rowsPerPage,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "100"],
          total: count,
          locale: { items_per_page: "/ trang" },
          showTotal: (total, range) => <span>Tổng số: {total}</span>,
          onShowSizeChange: (current, pageSize) => {
            setCurrentPage(current);
            setRowsPerpage(pageSize);
          },
          onChange: (pageNumber) => {
            setCurrentPage(pageNumber);
          },
        }}
      />{" "}
      <Modal
        open={isEdit}
        toggle={handleModalEdit}
        onCancel={onReset}
        contentClassName="pt-0"
        autoFocus={false}
        className="modal-md"
        footer={[]}
      >
        <div className="" toggle={handleModalEdit} tag="div">
          <h2 className="modal-title">Chuyển trạng thái đơn hàng</h2>
        </div>

        <div className="flex-grow-1">
          <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            layout="vertical"
          >
            <Row gutter={15}>
              <Col span={24}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="status"
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn trạng thái",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    options={status}
                    style={{ width: "100%" }}
                    placeholder="Chọn trạng thái"
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
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
      {/* <LocationPicker /> */}
      <Detail
        data={record}
        isOpen={openDetail}
        handleModal={handelOpenDetail}
        setData={setRecord}
      />
      {/* <BasicMap /> */}
      {/* <LocationPicker position_cur={{ lat: "23", lng: "28323" }} /> */}
    </Card>
  );
};

const Detail = React.lazy(() => import("./Detail"));
export default OnlineOrder;
