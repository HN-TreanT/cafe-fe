import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Breadcrumb, Divider, Popconfirm, Button, Input } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { message } from "antd";
import { ShipmentServices } from "../../../utils/services/shipment";
import { nhanvienServices } from "../../../utils/services/nhanvienService";
import { supplierServices } from "../../../utils/services/supplier";
import { materialService } from "../../../utils/services/materialService";
import { detail_shipmentServices } from "../../../utils/services/detail_shipment";
import NguyenLieu from "./NguyenLieu";
const { Column } = Table;
const { Search } = Input;

const NhapKho = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [search, setSearch] = useState('');
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [curData, setCurData] = useState({});
  const [data, setData] = useState([]);
  const [nhanvien, setNhanVien] = useState([]);
  const [nhacc, setNhaCC] = useState([]);
  const [material, setMaterial] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [count, setCount] = useState(0);
  const [shipment, setShipment] = useState([])
  const hanldeModalAdd = () => {
    setOpenModalAdd(false)
  }
  const handleModalEdit = () => {
    setOpenModalEdit(false)
  }
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };

  const handleUpdate = (record) => {
    setCurData(record);
    setOpenModalEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await ShipmentServices.deleteById(id);
      if (res.status) {
        getData();
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "TT",
      dataIndex: "id",
      width: 30,
      align: 'center',
      render: (text, record, index) => <span>{(((currentPage - 1) * rowsPerPage) + index + 1)}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: 'center',
      width: '20%',
      render: (text) => (
        <div>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(text)}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
    },
    {
      title: "Nhân viên",
      dataIndex: "shipment",
      align: "center",
      render: (shipment) => <span>{shipment ? getNhanVien(shipment.id_employee) : ""}</span>,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "shipment",
      align: "center",
      render: (shipment) => <span>{shipment ? getNhaCungCap(shipment.id_supplier) : ""}</span>,
    },
    {
      title: 'Thao tác',
      width: '108px',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', paddingLeft: '20px' }}>
          <EditOutlined onClick={() => handleUpdate(record)} style={{ marginRight: '1rem', color: '#036CBF', cursor: 'pointer' }} />
          <Popconfirm onConfirm={() => handleDelete(record.Ma_Loai_TTB)} title="Bạn chắc chắn xóa?" cancelText='Hủy' okText='Đồng ý'>
            <DeleteOutlined style={{ color: 'red', cursor: 'point' }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  //lấy dữ liệu nhân viên
  const getNhanvien = () => {
    nhanvienServices.get({
      page: 1,
      size: 100,
    }).then(res => {
      if (res.status) {
        setNhanVien(res.data.data);
      }
    })
  }
  //lấy dữ liệu nhà cung cấp
  const getNhaCC = () => {
    supplierServices.get({
      page: 1,
      size: 100,
    }).then(res => {
      if (res.status) {
        setNhaCC(res.data.data);
      }
    })
  }
  //lấy dữ liệu chi tiết sản phẩm
  const getData = () => {
    ShipmentServices.get({
      page: currentPage,
      size: rowsPerPage,
      ...(search && search !== "")
    }).then(res => {
      if (res.status) {
        setCount(res.data.TotalPage);
        setData(res.data.data);
      }
    }).catch((err) => {
      console.error(err);
    });
  };
  //lấy dữ liệu của nguyên liệu
  const getMaterial = () => {
    materialService.get({
      page: 1,
      size: 100,
    }).then(res => {
      if (res.status) {
        setMaterial(res.data.data);
      }
    })
  }
  //lấy dữ liêu của shipment
  const getshipment = () => {
    detail_shipmentServices.get({
      page: 1,
      size: 100,
    }).then(res => {
      if (res.status) {
        setShipment(res.data.data);
      }
    })
  }
  // Tìm tên nhân viên dựa trên employeeId từ state employees
  const getNhanVien = (Id) => {
    const nhanviens = nhanvien.find((emp) => emp.id === Id);
    return nhanviens ? nhanviens.name : "";
  };
  //Tìm tên nhà cung cấp dựa trên id nhà cung cấp
  const getNhaCungCap = (Id) => {
    const nhacungcaps = nhacc.find((emp) => emp.id === Id);
    return nhacungcaps ? nhacungcaps.name : "";
  };
  useEffect(() => {
    getNhanvien();
  }, []);
  useEffect(() => {
    getNhaCC();
  }, []);
  useEffect(() => {
    getMaterial();
  }, [])
  useEffect(() => {
    getshipment()
  }, [])
  useEffect(() => {
    getData();
  }, [currentPage, rowsPerPage, search]);

  return (
    <div className="ds_nguyenlieu">
      {contextHolder}
      <Row>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Quản lý nguyên liệu",
            },
            {
              title: (
                <span style={{ fontWeight: "bold" }}>Danh sách nguyên liệu </span>
              ),
            },
          ]}
        />
        <Button
          type="primary"
          style={{ marginLeft: "auto", width: 100 }}
          className="blue-button"
          onClick={() => {
            setOpenModalAdd(true);
            setCurData({});
          }}
        >
          Thêm mới
        </Button>
        <Divider style={{ margin: "10px" }} />
      </Row>
      <Row>
        <Col span={6}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <label style={{ marginBottom: "4px" }}>Tên người nhập</label>
            <Search
              type="text"
              placeholder="Tìm kiếm"
              style={{ height: "34px" }}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearch('');
                }
              }}
              onSearch={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </Col>
        <Divider style={{ margin: "10px" }} />
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data.map((item) => {
            return {
              ...item,
              key: item.id
            }
          })}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => {
              return <NguyenLieu nl={record} />
            },

          }}
          pagination={{
            current: currentPage,
            pageSize: rowsPerPage,
            defaultPageSize: rowsPerPage,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", '100'],
            total: count,
            locale: { items_per_page: "/ trang" },
            showTotal: (total, range) => <span>Tổng số: {total}</span>,
            onShowSizeChange: (current, pageSize) => {
              setCurrentPage(current);
              setRowsPerPage(pageSize);
            },
            onChange: (pageNumber) => {
              setCurrentPage(pageNumber);
            },
          }}
        />
      </Row>

      <ModalAdd shipment={shipment} material={material} nhacc={nhacc} nhanvien={nhanvien} curData={curData} open={openModalAdd} handleModal={hanldeModalAdd} action="Add" getData={getData} />
      <ModalAdd shipment={shipment} material={material} nhacc={nhacc} nhanvien={nhanvien} curData={curData} open={openModalEdit} handleModal={handleModalEdit} action="Edit" getData={getData} />

      {/* <Modal curData={curData} action="Add" handleModal={hanldeModalAdd} open={openModalAdd} getData={getData}
      />
      <Modal curData={curData} action="Edit" handleModal={handleModalEdit} open={openModalEdit} getData={getData}
      /> */}
    </div>
  );
};
const ModalAdd = React.lazy(() => import("./ModalNhapKho"))
// const Modal = React.lazy(() => import("../../kho/modelNhap/themmoi"))
export default NhapKho;