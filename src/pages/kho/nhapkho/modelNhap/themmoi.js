import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Steps } from 'antd'
import { message } from "antd";
import ThemNguyenLieu from "./ThemNguyenLieu";
import ThongTinChung from "./ThongTinChung";
import { theme } from 'antd';
import { nhanvienServices } from "../../../../utils/services/nhanvienService";
import { supplierServices } from "../../../../utils/services/supplier";
import { materialService } from "../../../../utils/services/materialService";
import { ShipmentServices } from "../../../../utils/services/shipment";
import { detail_shipmentServices } from "../../../../utils/services/detail_shipment";
const FormItem = Form.Item

const ThemMoi = ({ open, handleModal, action }) => {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [step1Id, setStep1Id] = useState(null);
    const [nhanvien, setNhanVien] = useState([]);
    const [nhacc, setNhaCC] = useState([]);
    const [material, setMaterial] = useState([]);
    const [form] = Form.useForm()
    const [current, setCurrent] = useState(0)
    const onFinish = async (values) => {
        try {
            const res = await detail_shipmentServices.create(values);
            if (res.status) {
                message.success("Thêm mới thành công");
                // onSuccess(res.data, res.data.id);
                setStep1Id(res.data.id);
                console.log(res.data.id)
                next();
            } else {
                message.error(res.message);
            }
        } catch (err) {
            console.log(err);
            message.error("Thất bại");
        }
    };

    const onFinishNL = async (values) => {
        console.log(values);
        try {
            const dataSubmit = {
                ...values,
                id_shipment: step1Id
            };
            const res = await ShipmentServices.create(dataSubmit);
            if (res.status) {
                message.success("Thêm mới thành công");
                handleModal()
                // onSuccess(res.data);
            } else {
                console.log("Lỗi từ API khi gửi lại:", res);
                message.error(res.message || "Có lỗi xảy ra khi gửi lại dữ liệu");
            }
        } catch (err) {
            console.log("Lỗi khi gửi lại:", err);
            message.error("Thất bại khi gửi lại dữ liệu");
        }
    };
    const onBack = () => {
        prev(); // Gọi hàm prev để quay lại bước trước đó
    };
    const steps = [
        {
            key: "1",
            title: 'Thông tin chung',
            content: <ThongTinChung nhacc={nhacc} nhanvien={nhanvien} onFinish={onFinish} />,
        },
        {
            key: "2",
            title: 'Nguyên liệu',
            content: <ThemNguyenLieu material={material} onBack={onBack} onFinishNL={onFinishNL} />,
        },
    ]
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
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
    useEffect(() => {
        getNhanvien();
    }, []);
    useEffect(() => {
        getNhaCC();
    }, []);
    useEffect(() => {
        getMaterial();
    }, [])
    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới lịch học" : "Chỉnh sửa lịch học"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >   <Steps current={current} items={steps} />
            <div >{steps[current].content}</div>
        </Modal>
    </Fragment>
};

export default ThemMoi
