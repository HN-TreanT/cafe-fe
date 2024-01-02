import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Breadcrumb, Divider, Popconfirm, Space, Tooltip, Button, Select, Typography, Input } from "antd"
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { message } from "antd";
import { comboServices } from "../../../utils/services/comboServices";
import { Label} from "reactstrap"
import { getProduct } from "../../../utils/services/productServices ";
import SanPham from "./SanPham";
interface DataType {
  key: number;
  createdAt: Date;
  price: string;
  name: string;
}
const Combo = () => {
  const dispatch = useDispatch()
  const actions = useAction()
  const loading = useSelector((state: any) => state.state.loadingState)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(9)
  const [search, setSearch] = useState<string>('')
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [curData, setCurData] = useState({})
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [messageApi, contextHolder] = message.useMessage();
  const [product, setProduct] = useState([]);
  //lấy dữ liệu sản phẩm
  const getComboProduct = () => {
    getProduct({
      page: 1,
      size: 100,
    }).then(res => {
      if (res.status) {
        setProduct(res.data.data);
      }
    })
  }
  //lấy dữ liệu Combo
  const getData = () => {
    dispatch(actions.StateAction.loadingState(true))
    comboServices.get({
      page: currentPage,
      size: rowsPerPage,
      ...(search && search !== " " && { search })
    }).then((res) => {
      if (res.status) {
        const t = res.data.data.map((item: any) => {
          return {
            ...item,
            key: item.id
          }
        })
        setCount(res.data.TotalPage)
        setData(t)
      }
      dispatch(actions.StateAction.loadingState(false))

    }).catch((err: any) => {
      console.log(err)
      dispatch(actions.StateAction.loadingState(false))

    })
  }
  const hanldeModalAdd = () => {
    setOpenModalAdd(false)
  }
  const handleModalEdit = () => {
    setOpenModalEdit(false)
  }

  const hanldUpdate = (data: any) => {

    setCurData(data)
    setOpenModalEdit(true)
  }

  const hanldeDelete = async (id: number) => {
    try {
      const res = await comboServices.deleteById(id)
      if (res.status) {
        getData()
      } else {
        message.error(res.message)
      }
    } catch (err: any) {
      console.log(err)
      message.error("Xóa thất bại")
    }
  }
  useEffect(() => {
    getComboProduct();
  }, []);
  const columns: ColumnProps<DataType>[] = [
    {
      title: "TT",
      dataIndex: "ID",
      width: 30,
      align: 'center',
      render: (text, record, index) => <span>{(((currentPage - 1) * rowsPerPage) + index + 1)}</span>
    },
    {
      title: "Combo",
      dataIndex: "name",
      align: "center"
    },
    {
      title: "ngày tạo",
      dataIndex: "createdAt",
      align: 'center',
      width: '20%',
      render: (text, record, index) => <span>{text ? dayjs(text).format("DD/MM/YYYY") : ""}</span>
    },
    {
      title: "giá",
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
      title: 'Thao tác',
      width: '108px',
      render: (record: any, index: any) => <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', paddingLeft: '20px' }}>

        <EditOutlined onClick={() => hanldUpdate(record)} style={{ marginRight: '1rem', color: '#036CBF', cursor: 'pointer' }} />
        <Popconfirm onConfirm={() => hanldeDelete(record.id)} title="Bạn chắc chắn xóa?" cancelText='Hủy' okText='Đồng ý'>
          <DeleteOutlined style={{ color: 'red', cursor: 'point' }} />
        </Popconfirm>
      </div>
    }
  ]

  useEffect(() => {
    getData()
  }, [currentPage, rowsPerPage, search])
  return <div className="ds_combo">
    {contextHolder}
    <Row>
      <Breadcrumb
        style={{ margin: "auto", marginLeft: 0 }}
        items={[
          {
            title: "Quản lý các combo",
          },
          {
            title: (
              <span style={{ fontWeight: "bold" }}>Danh sách combo</span>
            ),
          },
        ]}
      />
    
      <Divider style={{ margin: "10px" }}></Divider>
    </Row>
   <Row style={{ justifyContent: "space-between", display: "flex", marginBottom:'10px' }}>
   <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
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
                                setSearch("")
                            }
                        }}
                        onKeyPress={(e: any) => {
                          if (e.key === "Enter") {
                            setSearch(e.target?.value)
                            setCurrentPage(1)
                          }
                        }}
                    />
                </Col>
      <Col span={6} style={{display: "flex", justifyContent: "flex-end"}}>
      <Button
        type="primary"
        style={{
          padding: 6,
          backgroundColor: '#036CBF'
      }}
        className="blue-button"
        onClick={() => {
          setOpenModalAdd(true)
          setCurData({})
        }}
      >
        Thêm mới
      </Button>
      </Col>
      <Divider style={{ margin: "10px" }}></Divider>
    </Row>
    <Row>

      <Table
        loading={loading}
        style={{ width: "100%" }}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={data.map((item: any) => ({
          ...item,
          key: item.id, // Assuming ID is the unique key for each item
        }))}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return <SanPham record={record} />;
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
            setCurrentPage(current)
            setRowsPerpage(pageSize)
          },
          onChange: (pageNumber) => {
            setCurrentPage(pageNumber)
          }
        }}
      />

    </Row>
    <Modal curData={curData} action="Add" handleModal={hanldeModalAdd} open={openModalAdd} getData={getData} product={product}
    />
    <Modal curData={curData} action="Edit" handleModal={handleModalEdit} open={openModalEdit} getData={getData} product={product}
    />

  </div>;
};

const Modal = React.lazy(() => import("./Modal"))

export default Combo;
