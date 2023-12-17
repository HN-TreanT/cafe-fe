import {
  Table,
  Input,
  Card,
  Modal,
  Button,
  Popconfirm,
  Tooltip,
  Breadcrumb,
  Form,
  Select,
  Divider,
  TimePicker,
} from "antd";
import { useState, Fragment, useEffect, useRef } from "react";
import { Label, Row, Col, UncontrolledTooltip } from "reactstrap";
import { Plus, X } from "react-feather";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getPromotion,
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "../../utils/services/promotion";
import { getProduct } from "../../utils/services/productServices ";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";
import dayjs from "dayjs";
const WorkShift = (record) => {
  const [form] = Form.useForm();

  const selected = useRef();
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idEdit, setIdEdit] = useState();

  const [product, setProduct] = useState([]);

  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [action, setAction] = useState("Add");

  const [search, setSearch] = useState("");
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    setData(record?.record.employee_workshifts);
  }, [currentPage, rowsPerPage, search]);

  const handleModal = () => {
    setIsAdd(false);
    // setIsEdit(false)
  };
  const handleEdit = (record) => {
    form.setFieldsValue({
      arrival_time: dayjs(`${record.arrival_time}`, "HH:mm:ss"),
      end_time: dayjs(`${record.end_time}`, "HH:mm:ss"),
    });
    setAction("Edit");
    setIsAdd(true);
    setIdEdit(record.id);
  };
  const onReset = () => {
    form.resetFields();
    handleModal();
  };
  const onFinish = (values) => {
    if (action === "Add") {
      createPromotion({
        name: values.name,
        id_product: values.id_product,
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
      updatePromotion(idEdit, values)
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
  const callEdit = (data) => {
    const dataSubmit = {
      ...selected.current,
      ...data,
    };
  };

  const handleDelete = (key) => {
    deletePromotion(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa ca làm thành công",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-success",
          },
        }).then((result) => {
          if (currentPage === 1) {
          } else {
            setCurrentPage(1);
          }
        });
      })
      .catch((error) => {
        MySwal.fire({
          title: "Xóa ca làm thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        console.log(error);
      });
  };
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
      title: "Thời gian bắt đầu",
      dataIndex: "condition",
      render: (text, record, index) => {
        const t = record.workshift.arrival_time;
        return `${t}`;
      },
    },

    {
      title: "Thời gian kết thúc",
      dataIndex: "condition",
      render: (text, record, index) => {
        const t = record.workshift.end_time;
        return `${t}`;
      },
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {
            <>
              <Tooltip destroyTooltipOnHide placement="top" title="Chỉnh sửa">
                <EditOutlined
                  style={{ color: "#036CBF", marginRight: "10px" }}
                  onClick={() => handleEdit(record.workshift)}
                />
              </Tooltip>
            </>
          }
          {
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record.id)}
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
          }
        </div>
      ),
    },
  ];
  const showTotal = (count) => `Tổng số: ${count}`;

  return (
    <Card>
      <Breadcrumb
        style={{ margin: "auto", marginBottom: "14px", marginLeft: 0 }}
        items={[
          {
            title: (
              <span style={{ fontWeight: "bold" }}>Danh sách các ca làm</span>
            ),
          },
        ]}
      />
      <Divider style={{ margin: "10px" }}></Divider>
      <Row
        style={{
          justifyContent: "space-between",
          display: "flex",
          marginBottom: "10px",
        }}
      >
        <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Label
            className=""
            style={{
              width: "100px",
              fontSize: "14px",
              height: "35px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Tìm kiếm
          </Label>
          <Input
            type="text"
            placeholder="Tìm kiếm"
            style={{ height: "35px" }}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearch("");
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setSearch(e.target.value);
                setCurrentPage(1);
              }
            }}
          />
        </Col>
        <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
          {
            <Button
              onClick={(e) => {
                setAction("Add");
                setIsAdd(true);
              }}
              type="primary"
            >
              Thêm mới
            </Button>
          }
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        bordered
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
      />
      <Modal
        open={isAdd}
        toggle={handleModal}
        onCancel={onReset}
        contentClassName="pt-0"
        autoFocus={false}
        className="modal-md"
        footer={[]}
      >
        <div className="" toggle={handleModal} tag="div">
          <h2 className="modal-title">
            {action === "Add" ? "Thêm mới ca làm" : "Chỉnh sửa ca làm"}{" "}
          </h2>
        </div>

        <div className="flex-grow-1">
          <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            layout="vertical"
          >
            <Row>
            <div className=" col col-12">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="arrival_time"
                  label="Thời gian kết thúc"
                  rules={[
                    {
                      required: true,
                      message: "Nhập thời gian kết thúc",
                    },
                  ]}
                >
                  <TimePicker
                    size="large"
                    defaultValue={moment("00:00:00", "HH:mm:ss")}
                    style={{
                      width: "100%",
                      height: " 34px",
                    }}
                    placeholder="Thời gian kết thúc"
                    format={"HH:mm:ss"}
                  />
                </Form.Item>
              </div>
              <div className=" col col-12">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="end_time"
                  label="Thời gian kết thúc"
                  rules={[
                    {
                      required: true,
                      message: "Nhập thời gian kết thúc",
                    },
                  ]}
                >
                  <TimePicker
                    size="large"
                    defaultValue={moment("00:00:00", "HH:mm:ss")}
                    style={{
                      width: "100%",
                      height: " 34px",
                    }}
                    placeholder="Thời gian kết thúc"
                    format={"HH:mm:ss"}
                  />
                </Form.Item>
              </div>
            </Row>
            <Form.Item style={{ display: "flex", justifyContent: "center", paddingTop: '15px' }}>
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
    </Card>
  );
};
export default WorkShift;
