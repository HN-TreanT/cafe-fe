import React, { useEffect, useState } from "react";
import { Row, Table, Divider, Popconfirm, Button, Tag } from "antd"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ColumnProps } from "antd/es/table";
import { detailcomboServices } from "../../../utils/services/detailComboServices";
import dayjs from "dayjs";
import { message } from "antd";
interface DataType {
    key: number;
    TG_DB: Date;
    TG_KT: Date;
    TinhTrangTTB: any

}
const SanPham = ({ record }: any) => {

    const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)

    const getData = () => {
        setLoading(true)
        detailcomboServices.get({
            page: currentPage,
            size: rowsPerPage,
            id_combo: record?.id
        }).then((res) => {
            if (res.status) {
                setCount(res.data.TotalPage)
                setData(res.data.data)
            }
            setLoading(false)
        }).catch((err: any) => {
            console.log(err)
            setLoading(false)
        })
    }

    const columns: ColumnProps<DataType>[] = [
        {
            title: "TT",
            dataIndex: "ID",
            width: 30,
            align: 'center',
            render: (text, record, index) => <span>{(((currentPage - 1) * rowsPerPage) + index + 1)}</span>
        },
        {
            title: "Ảnh",
            dataIndex: "product",
            align: "center",
            render: (product) => product ? <img src={product.image} alt={product.name} width={80} height={60} /> : null,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product",
            align: "center",
            render: (product) => <div>{product ? product?.name : ""}</div>,

        },
        {
            title: "Mô tả",
            dataIndex: "product",
            align: "center",
            render: (product) => <div>{product ? product?.description : ""}</div>,
        },
        {
            title: "giá",
            dataIndex: "product",
            align: "center",
            render: (product) => <div>{product ? product?.price : ""}</div>,

        },
        {
            title: "Đơn vị",
            dataIndex: "product",
            align: "center",
            render: (product) => <div>{product ? product?.unit : ""}</div>,
        }
    ]
    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, record])

    return <div className="ds_trangthietbi">
        <Row>
            <h3>Danh sách các sản phẩm</h3>
            <Divider style={{ margin: "10px" }}></Divider>
        </Row>
        <Row>

            <Table
                loading={loading}
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

    </div>;
};
export default SanPham;
