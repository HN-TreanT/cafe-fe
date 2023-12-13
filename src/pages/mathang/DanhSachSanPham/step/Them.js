import React, { useState } from 'react';
import { Modal, Steps, Form, Input, Button } from 'antd';
import Thongtinchung from './Thongtinchung';
const { Step } = Steps;

const Them = ({ isAdd, action, getData, category, handleModal, idEdit }) => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'Thông tin sản phẩm',
      content: <Thongtinchung  isAdd={isAdd} action={action} getData={getData} category={category} handleModal={handleModal} idEdit={idEdit}/>,
    },
    {
      title: 'Nguyên liệu',
      content: (
        <Form>
          <Form.Item label="Nguyên vật liệu 1">
            <Input />
          </Form.Item>
          <Form.Item label="Nguyên vật liệu 2">
            <Input />
          </Form.Item>
        </Form>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Modal
      visible={isAdd}
      onCancel={handleModal}
      // width={800}
      // height={400}
      style={{ top: 20 }}
      footer={null}
    >
      <Steps current={current}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Quay lại
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Tiếp theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => handleModal()}>
            Hoàn thành
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default Them;
