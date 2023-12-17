import {
  Table,
  Input,
  Card,
  Modal,
  Button,
  Popconfirm,
  Tooltip,
  Select,
  Form,
  Row,
  Col,
  DatePicker,
  Breadcrumb,
  Divider,
  TimePicker
} from "antd";
import { useState, Fragment, useEffect, useRef } from "react";
import { Label, ModalHeader, ModalBody } from "reactstrap";
import { Plus, X } from "react-feather";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../../utils/services/employee";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";
import WorkShift from "./WorkShift";
import { getPosition } from "../../utils/services/position";
import dayjs from "dayjs";
// import { AbilityContext } from '@src/utility/context/Can'

const Employee = () => {
  // const ability = useContext(AbilityContext)
  const [form] = Form.useForm();

  const selected = useRef();
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idEdit, setIdEdit] = useState();

  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [action, setAction] = useState("Add");

  const [search, setSearch] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  
  const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const gender = [
    {
        value: 1,
        label: 'Nữ'
    },
    {
        value: 0,
        label: 'Nam'
    }
  ]
  
  const getData = () => {
    getEmployee({
      page: currentPage,
      size: rowsPerPage,
      ...(search && search !== "" && { search }),
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllPosition = () => {
  getPosition()
    .then((res) => {
      const t = res.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setPosition(t);
    })
    .catch((e) => {
      console.log(e);
    });
};

  useEffect(() => {
    getData();
    getAllPosition();
  }, [currentPage, rowsPerPage, search]);

  const handleModal = () => {
    setIsAdd(false);
    // setIsEdit(false)
  };
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  );
  const handleEdit = (record) => {
    console.log(record)
    form.setFieldsValue({
        ...record,
        birthday: dayjs(record.birthday),
    })
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
      createEmployee(values)
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
      updateEmployee(idEdit, values)
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
  const callEdit = (data) => {
    const dataSubmit = {
      ...selected.current,
      ...data,
    };
  };

  const handleDelete = (key) => {
    deleteEmployee(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa nhân viên thành công",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-success",
          },
        }).then((result) => {
          if (currentPage === 1) {
            getData(1, rowsPerPage);
          } else {
            setCurrentPage(1);
          }
        });
      })
      .catch((error) => {
        MySwal.fire({
          title: "Xóa nhân viên thất bại",
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
      title: "Tên nhân viên",
      dataIndex: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      render: (text, record, index) => {
        const birthdayDate = moment(record.birthday);
        return birthdayDate.format("DD/MM/YYYY");
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      render: (text, record, index) => {
        const temp = gender.find((item) => item.value === record.gender)

        return (`${temp?.label }`)
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
      align: "center",
    },
    {
      title: "Vị trí",
      dataIndex: "id_position",
      align: "center",
      render: (text, record, index) => {
        return record?.position?.name;
      },
    },
    // {
    //     title: "Ca làm",
    //     align: "center",
    //     render: (text, record, index) => {
    //         const workshifts = record?.employee_workshifts;

    //         if (workshifts && workshifts.length > 0) {
    //             const arrivalTimes = workshifts.map(item => item.workshift.arrival_time);
    //             return arrivalTimes.join(" / ");
    //         }

    //         return "No workshifts"; // or any default value you prefer if there are no workshifts
    //     }
    // },

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
                  onClick={() => handleEdit(record)}
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
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: (
                <span style={{ fontWeight: "bold", paddingBottom: '15px' }}>Danh sách nhân viên</span>
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
              style={{
                padding: 6,
                backgroundColor: '#036CBF'
              }}
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
        expandable={{
          expandedRowRender: (record) => {
            return <WorkShift type="Add" record={record} />;
          },
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        paginame={{
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
        width={800}
        height={400}
        footer={null}
      >
        <Card
        title={action === "Add" ? "Thêm mới thông tin nhân viên" : "Chỉnh sửa thông tin nhân viên"}
        style={{ backgroundColor: "white", width: "100%", height: "100%", fontSize: '21px' }}
      >

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
                  name="name"
                  label="Họ và tên"
                  rules={[
                    {
                      required: true,
                      message: "Nhập họ và tên",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
             <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="username"
                  label="Tên đăng nhập"
                  rules={[
                    {
                      required: true,
                      message: "Nhập tên đăng nhập",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên đăng nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: "Nhập mật khẩu",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
             
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="gender"
                  label="Giới tính"
                  rules={[
                    {
                      required: true,
                      message: "Nhập giới tính",
                    },
                  ]}
                >
                   <Select
                          showSearch
                          allowClear
                          filterOption={filterOption}
                          options={gender}
                          style={{  width:"100%" }}
                          placeholder="Chọn giới tính"
                        />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="birthday"
                  label="Ngày sinh"
                  rules={[
                    {
                      required: true,
                      message: "Nhập ngày sinh",
                    },
                  ]}
                >
                  <DatePicker
                                size='large'
                                style={{
                                    width: "100%",
                                    height: " 34px"
                                }}
                                placeholder="Ngày sinh"
                                format="DD/MM/YYYY"
                                />

                </Form.Item>
              </Col>
          
             <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    {
                      required: true,
                      message: "Nhập địa chỉ",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>  
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="phone_number"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      message: "Nhập số điện thoại",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" type="number"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Nhập email",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" type="email"/>
                </Form.Item>
              </Col>
             
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="id_position"
                  label="Vị trí"
                  rules={[
                    {
                      required: true,
                      message: "Chọn vị trí",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không hợp lệ"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                   <Row gutter={15}>
                    <Col span={12}>
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="arrival_time"
                  label="Thời gian bắt đầu"
                  rules={[
                    {
                      required: true,
                      message: "Nhập thời gian bắt đầu",
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
                    placeholder="Thời gian bắt đầu"
                    format={"HH:mm:ss"}
                  />
                </Form.Item>
              </Col>
                    <Col span={12}>
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
              </Col>
            </Row>
                   <Select
                          showSearch
                          allowClear
                          filterOption={filterOption}
                          options={position}
                          style={{  width:"100%" }}
                          placeholder="Chọn vị trí"
                        />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ display: "flex", justifyContent: "center", paddingTop: '12px' }}>
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
        </Card>
      </Modal>
    </Card>
  );
};
export default Employee;
