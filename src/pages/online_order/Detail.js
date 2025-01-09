import {
  Row,
  Input,
  Col,
  Modal,
  Button,
  Form,
  Select,
  Descriptions,
  Table,
} from "antd";

import React, { useState, Fragment, useEffect, useRef } from "react";
import LocationPicker from "../../components/GoogleMap/LocationPicker";
import axios from "axios";

const Detail = ({ data, isOpen, handleModal, setData }) => {
  const [addressName, setAddressName] = useState("");
  const [split, setSplit] = useState([]);

  const nameAdress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "Accept-Language": "vi",
          },
        }
      );
      setAddressName(response.data.display_name);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data) {
      if (data?.address) {
        const result = data.address.replace(/[\[\]]/g, "");
        const split = result.split(",");
        nameAdress(split[0], split[1]);
        setSplit(split);
      }
    } else {
      nameAdress(21.001881582088934, 105.73372572109439);
      setSplit([21.001881582088934, 105.73372572109439]);
    }
  }, [data]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 30,
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (text, record, index) => {
        return record?.product ? record?.product?.name : record?.combo.name;
      },
    },
    {
      title: "Giá",
      dataIndex: "product",
      render: (text, record, index) => {
        return text.price;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quanity",
    },
  ];

  const handleClostModal = () => {
    handleModal();
    setData(null);
  };

  return (
    <Modal
      open={isOpen}
      toggle={handleClostModal}
      width={1000}
      onCancel={() => handleClostModal()}
      contentClassName="pt-0"
      autoFocus={false}
      footer={[]}
    >
      <div className="" toggle={handleModal} tag="div">
        <h2 className="modal-title">Chi tiết đơn hàng</h2>
      </div>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Descriptions>
            <Descriptions.Item label="Tên khách hàng">
              {data?.customer.name}
            </Descriptions.Item>
            <Descriptions.Item label="Điện thoại liên hệ">
              {data?.customer.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {data?.customer.email}
            </Descriptions.Item>
            <Descriptions.Item label="Thành tiền">
              {data?.total_price}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{addressName}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <LocationPicker
            position_cur={split[0] ? { lat: split[0], lng: split[1] } : null}
          />
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data?.order_details ? data?.order_details : []}
            bordered
          />{" "}
        </Col>
      </Row>
    </Modal>
  );
};
export default Detail;
