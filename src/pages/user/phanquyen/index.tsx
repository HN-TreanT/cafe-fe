import React, { useEffect, useState, useContext, useRef } from "react";
import { Table, Row, Col, Card, Breadcrumb, Divider, Input, Button, Space, Typography, Popconfirm } from "antd";
import { ColumnProps } from "antd/es/table";
import { message } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { userServices } from "../../../utils/services/userService";
import ModalAddEdit from "./Modal";
import PermissionTable from "./permission";
interface DataType {
    key: React.Key;
    name: string;
    id: any;
}
const PhanQuyenPage: React.FC = () => {
    const [roles, setRoles] = useState([])
    const [count, setCount] = useState(0)
    const [curData, setCurData] = useState({})
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
    

    const hanldeUpdate = (record: any) => {
        setIsOpenModalEdit(true)
        setCurData(record)

    }
    const hanldeDelete = (id : any) => { 
        userServices.deleteRole(id).then(res => {
            if (res.status) {
                getAllRoles()
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
                <span>{index + 1}</span>
            ),
        },
        {
            title: "Mã quyền",
            dataIndex: "id",
        },
        {
            title: "Tên quyền",
            dataIndex: "name",
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
                        <span style={{ fontWeight: "bold" }}>Quản lý quyền</span>
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

        <Table
            style={{ width: "100%" }}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={roles.map((item: any) => {
                return {
                    ...item,
                    key: item.id,
                }
            })}
            columns={columns}
            expandable={{
                expandedRowRender: (record) => <PermissionTable key={record.id} id_role={record.id}/>,
                rowExpandable: (record) => record.name !== 'Not Expandable',
            }}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30", '100'],
                total: count,
                locale: { items_per_page: "/ trang" },
                showTotal: (total, range) => <span>Tổng số: {total}</span>,

            }}
        />

    </Row>
    <ModalAddEdit curData={curData} action="Add" handleModal={handleModalAdd} open={isOpenModalAdd} getData={getAllRoles} roles={roles}/>
    <ModalAddEdit curData={curData} action="Edit" handleModal={handleModaledit} open={isOpenModalEdit} getData={getAllRoles} roles={roles}/>
</div>;


}

export default PhanQuyenPage