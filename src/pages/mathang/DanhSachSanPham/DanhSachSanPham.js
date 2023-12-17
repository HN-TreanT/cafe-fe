import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Select, Divider,Tooltip } from "antd"
import React, { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import ListMaterial from './ListMaterial'
import {getProduct, createProduct, deleteProduct, updateProduct } from "../../../../src/utils/services/productServices "
import { categoryServices } from "../../../../src/utils/services/categoryServices"
import withReactContent from "sweetalert2-react-content"
const DanhSachSanPham = () => {
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(2)
    const [action, setAction] = useState('Add')

    const [category, setCategory] = useState([])
    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        getProduct({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
            name: search
        })
            .then((res) => {
                const t = res.data.data.map((item) => {
                    return {
                        ...item,
                        key: item.id
                    }
                })
                setData(t)
                setCount(res.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const handleModal = () => {
        setIsAdd(false)
    }
   const getAllCategory = () => {
    categoryServices.get({
        params : {
            page: 1,
            limit: 100
        },
    })
    .then((res) => {
        const temps = res.data.data.map((item) => {
            return {
                value: item.id,
                label: item.name
            }
        })
        setCategory(temps)
    })
    .catch((e) => {
        console.log(e)
    })
   }
    useEffect(() => {
        getData()
        getAllCategory()
    }, [currentPage, rowsPerPage, search])

    const handleEdit = (record) => {
        setAction('Edit')
        setIdEdit(record)
        setIsAdd(true)
    }
   
    const handleDelete = (key) => {
        deleteProduct(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa sản phẩm thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    if (currentPage === 1) {
                        getData(1, rowsPerPage)
                    } else {
                        setCurrentPage(1)
                    }
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa sản phẩm thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }
   
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Ảnh",
            dataIndex: "image",
            width: 50,
            height: 50,
            render: (record, index) => (
              <img src={record} alt={`Ảnh ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            )
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
        },
        {
            title: "Loại",
            dataIndex: "id_category",
            render: (text, record, index) => {
                const temp = category.find((item) => item.value === record.id_category)
                 return <span>{`${temp?.label ? temp.label : ""}`}</span>
            }
        },
        {
            title: "Giá Bán",
            dataIndex: "price",
        },
        {
            title: "Đơn vị tính",
            dataIndex: "unit",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
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
                            style={{ color: '#036CBF', marginRight: '10px' }}
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
                        style={{ color: "red", cursor: 'pointer', marginRight: '10px' }}
                        />
                        </Tooltip>
                     
                    </Popconfirm>

                    }

                </div>
            ),
        },
    ]
    const showTotal = (count) => `Tổng số: ${count}`

    return (
        <Card>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Mặt hàng",
            },
            {
              title: (
                <span style={{ fontWeight: "bold" }}>Danh sách mặt hàng</span>
              ),
            },
          ]}
        />

              <Divider style={{ margin: "10px" }}></Divider>
            <Row style={{ justifyContent: "space-between", display: "flex", marginBottom:'10px' }}>
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
                                setSearch("")
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }
                        }}
                    />
                </Col>
                <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                    {
                         <Button
                            style={{backgroundColor: "#036CBF"}}
                            onClick={(e) => {
                            setAction('Add')
                            setIsAdd(true)
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
                expandable={{
                    expandedRowRender: (record) => {
                      return <ListMaterial type="Add" record={record} category={category} getProduct={getData}/>
                    },
                    rowExpandable: (record) => record.name !== "Not Expandable",
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
            <Them isAdd={isAdd} action={action} getData={getData} category={category} handleModal={handleModal} idEdit={idEdit}/>
           {/* <AddModal isAdd={isAdd} action={action} getData={getData} category={category} handleModal={handleModal} idEdit={idEdit} /> */}
                 </Card>
    )
}
const Them = React.lazy(() => import("./step/Them"))
// const AddModal = React.lazy(() => import("./addModal"))
export default DanhSachSanPham 
