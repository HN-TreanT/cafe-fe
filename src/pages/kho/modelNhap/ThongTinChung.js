
  // <Form
  //   form={form}
  //   name="control-hooks"
  //   onFinish={onFinish}
  //   layout="vertical"
  // >
  //   <Row>
  //     <div className=" col col-12">
  //       <Form.Item
  //         style={{ marginBottom: "4px" }}
  //         name="id_employee"
  //         label="Nhân viên nhập hàng"
  //         rules={[
  //           {
  //             required: true,
  //             message: "Vui lòng chọn nhân viên nhập hàng",
  //           },
  //         ]}
  //       >
  //         <Select
  //           allowClear
  //           options={employee}
  //           style={{ width: "100%" }}
  //           placeholder="Chọn nhân viên nhập hàng"
  //         ></Select>
  //       </Form.Item>
  //     </div>
  //     <div className=" col col-12">
  //       <Form.Item
  //         style={{ marginBottom: "4px" }}
  //         name="amount"
  //         label="Nhà cung ứng"
  //         rules={[
  //           {
  //             required: true,
  //             message: "Vui lòng chọn Nhà cung ứng",
  //           },
  //         ]}
  //       >
  //         <Select
  //           allowClear
  //           options={employee}
  //           style={{ width: "100%" }}
  //           placeholder="Chọn nhà cung ứng"
  //         ></Select>
  //       </Form.Item>
  //     </div>
  //     <div className=" col col-12">
  //       <Form.Item
  //         style={{ marginBottom: "4px" }}
  //         name="id_material"
  //         label="Nguyên liệu"
  //         rules={[
  //           {
  //             required: true,
  //             message: "Vui lòng chọn nguyên liệu",
  //           },
  //         ]}
  //       >
  //         <Space style={{ width: '100%' }} direction="vertical">
  //           <Select
  //           mode="multiple"
  //           allowClear
  //           style={{ width: '100%' }}
  //           placeholder="Please select"
  //           defaultValue={['a10', 'c12']}
  //           onChange={handleChange}
  //           options={material}
  //           />
  //       </Space>
  //       </Form.Item>
  //     </div>
  //   </Row>
  //   <Form.Item style={{ display: "flex", justifyContent: "center" }}>
  //     <Button
  //       type="primary"
  //       htmlType="submit"
  //       className="addBtn"
  //       style={{ marginRight: "20px", width: "94px" }}
  //     >
  //       Lưu
  //     </Button>
  //     <Button
  //       htmlType="button"
  //       className="addBtn"
  //       onClick={onReset}
  //       style={{ width: "94px" }}
  //     >
  //       Hủy
  //     </Button>
  //   </Form.Item>
  // </Form>