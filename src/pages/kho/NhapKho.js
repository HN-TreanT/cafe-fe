import {
  Table,
  Input,
  Card,
  Modal,
  Button,
  Popconfirm,
  Breadcrumb,
  Form,
  Select,
  Divider,
  Space
} from "antd";
import React, { useState, useEffect, useRef } from "react"
import { Label, Row, Col, UncontrolledTooltip } from "reactstrap";
import moment from "moment";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getShipment,
  createShipment,
  deleteShipment,
  updateShipment,
} from "../../utils/services/shipment";
import { getEmployee } from "../../utils/services/employee";
import { getSupplier } from "../../utils/services/supplier";
import { getMaterial } from "../../utils/services/material";

import withReactContent from "sweetalert2-react-content";

const NhapKho = () => {
  // const ability = useContext(AbilityContext)
  const [form] = Form.useForm();

  const selected = useRef();
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idEdit, setIdEdit] = useState();

  const [material, setMaterial] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [supplier, setSupplier] = useState([]);

  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [action, setAction] = useState("Add");

  const [search, setSearch] = useState("");
  const [isAdd, setIsAdd] = useState(false);

 
  const getData = () => {
    getShipment({
      params: {
        page: currentPage,
        limit: rowsPerPage,
        ...(search && search !== "" && { search }),
      },
    })
      .then((res) => {
        setData(res.data.data);
        setCount(res.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEmployees = () => {
    getEmployee({
      params: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const data = res.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setEmployee(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getMaterials = () => {
    getMaterial({
      params: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const data = res.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setMaterial(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const options = []
  material.map(item => {
    options.push({
      label: item.id,
      value: item.name
    })
  })

  const getSuppliers = () => {
    getSupplier({
      params: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const data = res.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setSupplier(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    getEmployees();
    getSuppliers();
    getMaterials();
  }, [currentPage, rowsPerPage, search]);

  const handleModal = () => {
    setIsAdd(false);
  };
  
  const handleEdit = (record) => {
    form.setFieldsValue(record);
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
      createShipment(values)
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
      updateShipment(idEdit, values)
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
  const handleDelete = (key) => {
    deleteShipment(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa lượng Lô hàng  thành công",
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
          title: "Xóa lượng Lô hàng  thất bại",
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
      title: "Mã Lô hàng ",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Nhân viên nhập hàng",
      dataIndex: "id_employee",
      render: (text, record, index) => {
        return <span>{record.employee.name}</span>;
      },
    },
    {
      title: "Người cung cấp",
      dataIndex: "id_supplier",

      render: (text, record, index) => {
        return <span>{record.supplier.name}</span>;
      },
    },
    {
      title: "Giá trị lô hàng",
      dataIndex: "price",
      align: "center",
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {
            <>
              <EditOutlined
                id={`tooltip_edit${record.ID}`}
                style={{ color: "#036CBF", cursor: "pointer" }}
                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip_edit${record.ID}`}
              >
                Chỉnh sửa
              </UncontrolledTooltip>
            </>
          }
          {
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record.id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                id={`tooltip_delete${record.ID}`}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip_delete${record.ID}`}
              >
                Xóa
              </UncontrolledTooltip>
            </Popconfirm>
          }
        </div>
      ),
    },
  ];
  return (
    <Card>
      <Breadcrumb
        style={{ margin: "auto", marginBottom: "14px", marginLeft: 0 }}
        items={[
          {
            title: "Quản lý kho hàng",
          },
          {
            title: (
              <span style={{ fontWeight: "bold" }}>Lịch sử nhập lô hàng</span>
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
            placeholder="Tên Lô hàng"
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
      {/* <ThemMoi open={modalAdd} type="add" handleModal={handleModal}  getData={getData} /> */}
    </Card>
  );
};

// const ThemMoi = React.lazy(() => import("./modelNhap/themmoi"))
export default NhapKho;
