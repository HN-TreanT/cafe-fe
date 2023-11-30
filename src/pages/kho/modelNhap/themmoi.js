import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Steps } from 'antd'
import { message } from "antd";
import ThemNguyenLieu from "./ThemNguyenLieu";
import ThongTinChung from "./ThongTinChung";
import { theme } from 'antd';
const FormItem = Form.Item

const ThemMoi = ({ open, handleModal, action, getData }) => {
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()

    const [current, setCurrent] = useState(0)
    const steps = [
        {
            key: "1",
            title: 'Thông tin chung',
            content: <ThongTinChung />,
        },
        {
            key: "2",
            title: 'Nguyên liệu',
            content: <ThemNguyenLieu />,
        },
    ]
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới lịch học" : "Chỉnh sửa lịch học"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >   <Steps current={current} items={steps} />
            <div >{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </Modal>
    </Fragment>
};

export default ThemMoi
