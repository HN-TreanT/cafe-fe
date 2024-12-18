import React, { useEffect, useState, useContext, useRef } from "react";
import { Table, Row, Col, Card, Breadcrumb, Divider, Input, Button, Space, Typography, Popconfirm } from "antd";
import { ColumnProps } from "antd/es/table";
import { message } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { userServices } from "../../../utils/services/userService";
import ModalAddEdit from "./Modal";
interface DataType {
    key: number;
    name: string;
    username: string;
    role: any;
}
const NguoiDungPage: React.FC = () => {
    const [data, setData] = useState([])
    const [roles, setRoles] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [name, setName] = useState<any>()
    const [curData, setCurData] = useState({})
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false)
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)

    const handleModaledit = () => {
        setIsOpenModalEdit(!isOpenModalEdit)
    }
    const handleModalAdd = () => {
        setIsOpenModalAdd(!isOpenModalAdd)
    }


    const getAllRoles = () => {
        userServices.getRole().then(res => {
            setRoles(res.data)
        }).catch(err => {
            console.log(err)
        })
    }
    

    const getData = () => {
        userServices.getUser({
            page: currentPage,
            size: rowsPerPage,
            ...(name && name !== "" && { name: name })
        }).then(res => {
            setData(res.data.data)
            setCount(res.data.count)
        }).catch(err => {
            console.log(err)
        })

    }

    const hanldeUpdate = (record: any) => {
        setIsOpenModalEdit(true)
        setCurData(record)

    }
    const hanldeDelete = (id : any) => {
        userServices.deleteUser(id).then(res => {
            if (res.status) {
                getData()
                message.success("Xóa thành công")
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            console.log(err)
        })

    }
    const columns: ColumnProps<DataType>[] = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text: any, record: any, index: any) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Tên người dùng",
            dataIndex: "name",
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "username",
        },
        {
            title: "Quyền",
            dataIndex: "role",
            render: (value: any) => value?.name
        },
        {
            title: 'Thao tác',
            width: '108px',
            render: (record: any, index: any) => <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', paddingLeft: '20px' }}>

                <EditOutlined onClick={() => hanldeUpdate(record)} style={{ marginRight: '1rem', color: '#036CBF', cursor: 'pointer' }} />
                <Popconfirm onConfirm={() => hanldeDelete(record.id)} title="Bạn chắc chắn xóa?" cancelText='Hủy' okText='Đồng ý'>
                    <DeleteOutlined style={{ color: 'red', cursor: 'point' }} />
                </Popconfirm>
            </div>
        }
    ]

    useEffect(() => {
        getAllRoles()
    }, [])

    useEffect(() => {
        getData()
    }, [name, currentPage, rowsPerPage])
    return <div >
    {/* {contextHolder} */}
    <Row>
        <Breadcrumb
            style={{ margin: "auto", marginLeft: 0 }}
            items={[
                {
                    title: "Quản lý người dùng",
                },
                {
                    title: (
                        <span style={{ fontWeight: "bold" }}>Quản lý tài khoản</span>
                    ),
                },
            ]}
        />
        <Button
            type="primary"
            style={{ marginLeft: "auto", width: 100 }}
            className="blue-button"
            onClick={() => {
                setIsOpenModalAdd(true)
                setCurData({})
            }}
        >
            Thêm mới
        </Button>
        <Divider style={{ margin: "10px" }}></Divider>
    </Row>
    <Row>
        <Col span={6}>
            <Space direction="vertical" style={{ width: "100%", textAlign: "left" }}>
                <Typography.Text >Tên người dùng</Typography.Text>
                <Input
                    type="text"
                    placeholder="Tìm kiếm"
                    style={{ height: "34px" }}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setName('')
                        }
                    }}
                    onKeyPress={(e: any) => {
                        if (e.key === "Enter") {
                            setName(e.target?.value)
                            setCurrentPage(1)
                        }
                    }}
                />
            </Space>
        </Col>
        <Divider style={{ margin: "10px" }}></Divider>
    </Row>
    <Row>

        <Table
            // loading={loading}
            style={{ width: "100%" }}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={data}
            columns={columns}
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
    <ModalAddEdit curData={curData} action="Add" handleModal={handleModalAdd} open={isOpenModalAdd} getData={getData} roles={roles}/>
    <ModalAddEdit curData={curData} action="Edit" handleModal={handleModaledit} open={isOpenModalEdit} getData={getData} roles={roles}/>
</div>;


}

export default NguoiDungPage