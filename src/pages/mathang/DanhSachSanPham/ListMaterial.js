import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Row, Col, Divider,Tooltip } from "antd"
import React, { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import { categoryServices } from "../../../../src/utils/services/categoryServices"
import withReactContent from "sweetalert2-react-content"
import { deleteUseMaterial } from "../../../utils/services/useMaterial"
const ListMaterial = ({record, getProduct}) => {
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        getProduct()
        const t = record.use_materials
        setData(t)
    }
    const handleModal = () => {
        setIsAdd(false)
    }
    const handleDelete = (record) => {
        deleteUseMaterial(record)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa nguyên liệu thành công",
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
                    title: "Xóa nguyên liệu thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage])

    const handleEdit = (record) => {
        console.log(record)
       
        form.setFieldsValue({
            id_material: record.material.id,
            amount: record.material.amount
        });
        setAction('Edit')
        setIdEdit(record.id)
        setIsAdd(true)
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
            title: "Tên nguyên liệu",
            render: (text, record, index) => {
                return(`${record.material.name}`)
            }
        },
        {
            title: "Số lượng sử dụng",
            dataIndex: "amount",
        },
        {
            title: "Số lượng trong kho",
            render: (text, record, index) => {
                return(`${record.material.amount}`)
            }
        },
        {
            title: "Đơn vị tính",
            render: (text, record, index) => {
                return(`${record.material.unit}`)
            }
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
                       cancelText="Hủy"
                       okText="Đồng ý"
                       onConfirm={() => handleDelete(record.id)}
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
        <Card
           
        >
          <Breadcrumb
                style={{ margin: "auto",marginBottom:"14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách nguyên liệu cần dùng</span>
                        ),
                    },
                ]}
            />
              <Divider style={{ margin: "10px" }}></Divider>
            <Row style={{justifyContent: "flex-end", display: "flex", marginBottom:'10px' }}>
                <Col sm="12" >
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
            
            <AddModal isAdd={isAdd} idEdit={idEdit} idProduct={record.id} getData={getData} action={action} handleModal={handleModal}/>
            </Card>
    )
}
const AddModal = React.lazy(() => import("./AddModalM"))
export default ListMaterial 
