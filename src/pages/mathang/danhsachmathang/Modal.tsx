// import React, { Fragment, useEffect, useState } from "react";
// import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload } from 'antd'
// import { categoryServices } from "../../../utils/services/categoryServices";
// import { message } from "antd";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { UploadOutlined } from '@ant-design/icons';
// import type { UploadFile } from 'antd/es/upload/interface';
// import dayjs from "dayjs";
// import { Tabs } from "antd"
// import type { RcFile, UploadProps } from 'antd/es/upload';
// import { PlusOutlined } from '@ant-design/icons';
// import { GET } from "../../../utils/services/productServices ";
// const FormItem = Form.Item


// interface Props {
//     curData: any,
//     open: boolean,
//     handleModal: Function,
//     action: string,
//     getData: any,
//     category: any,
//     material: any

// }
// const getBase64 = (file: RcFile): Promise<string> =>
//     new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = (error) => reject(error);
//     });
const ModalAddMatHang = () => {
  return 0
//     const [messageApi, contextHolder] = message.useMessage();
//     const [form] = Form.useForm()
//     const { curData, open, handleModal, action, getData } = props
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewImage, setPreviewImage] = useState('');
//     const [previewTitle, setPreviewTitle] = useState('');

//     const handlePreview = async (file: UploadFile) => {
//         if (!file.url && !file.preview) {
//             file.preview = await getBase64(file.originFileObj as RcFile);
//         }

//         setPreviewImage(file.url || (file.preview as string));
//         setPreviewOpen(true);
//         setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
//     };

//     const uploadButton = (
//         <div>
//             <PlusOutlined />
//             <div style={{ marginTop: 8 }}>Upload</div>
//         </div>
//     );
//     useEffect(() => {
//         if (curData) {

//             form.setFieldsValue({
//                 name: curData?.name ? curData?.name : "",
//                 price: curData?.price ? curData?.price : "",
//                 unit: curData?.unit ? curData?.unit : "",
//                 description: curData?.description ? curData?.description : "",
//                 image: curData?.image ? curData?.image : "",
//             })
//         }
//     }, [curData, form])
//     const onFinish = async (values: any) => {
//         try {
//             const formData = new FormData();
//             formData.append("name", values.name);
//             formData.append("price", values.price);
//             formData.append("unit", values.unit);
//             formData.append("description", values.description);

//             // Đảm bảo values.file là một File object
//             if (values.file instanceof File) {
//                 formData.append("file", values.file.uid);
//             }
//             console.log(values)
//             console.log(values.file.uid)
//             if (action === "Add") {
//                 const res = await productServices.create({
//                     ...values,
//                     role_id: "U",
//                     // Chuyển dữ liệu thành FormData
//                     formData,
//                 });

//                 if (res.status) {
//                     getData();
//                     handleModal();
//                     message.success("Thêm mới thành công");
//                 } else {
//                     message.error(res.message);
//                 }
//             } else {
//                 const res = await productServices.update(curData.id, {
//                     ...values,
//                     // Chuyển dữ liệu thành FormData
//                     formData,
//                 });

//                 if (res.status) {
//                     getData();
//                     handleModal();
//                     message.success("Chỉnh sửa thành công");
//                 } else {
//                     message.error(res.message);
//                 }
//             }
//         } catch (err: any) {
//             console.error(err);
//             message.error("Thất bại");
//         }
//     };
//     return <Fragment>
//         {contextHolder}
//         <Modal
//             title={action === "Add" ? "Thêm mới các mặt hàng" : "Chỉnh sửa mặt hàng"}
//             open={open}
//             footer={null}
//             onCancel={() => handleModal()}
//         >
//             <Form onFinish={onFinish} layout="vertical" form={form} >

//                 <Row gutter={16}>
//                     <Col span={12} className="gutter-row">
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "Tên mặt hàng"
//                             }
//                             name='name'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Nhập tên mặt hàng'
//                                 }
//                             ]}
//                         >
//                             <Input placeholder='Nhập tên mặt hàng' />
//                         </FormItem>
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "Giá"
//                             }
//                             name='price'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Nhập giá'
//                                 }
//                             ]}
//                         >
//                             <Input placeholder='Nhập giá' />
//                         </FormItem>
//                     </Col>
//                     <Col span={12} className="gutter-row">
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "đơn vị tính"
//                             }
//                             name='unit'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Nhập đơn vị tính'
//                                 }
//                             ]}
//                         >
//                             <Input placeholder='Nhập đơn vị tính' />
//                         </FormItem>
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "Loại mặt hàng "
//                             }
//                             name='id_category'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Hãy nhập tên loại mặt hàng '
//                                 }
//                             ]}
//                         >
//                             <Select options={props.category} placeholder="Chọn tên loại mặt hàng" />
//                         </FormItem>
//                         {/* <FormItem
//                                     style={{ marginBottom: "4px" }}
//                                     label={
//                                         "vật liệu "
//                                     }
//                                     name='id_material'
//                                     rules={[
//                                         {
//                                             required: true,
//                                             message: 'Hãy nhập vật liệu '
//                                         }
//                                     ]}
//                                 >
//                                     <Select options={props.material} placeholder="Chọn vật liệu" />
//                                 </FormItem> */}
//                     </Col>
//                     <Col span={24}>
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "Nhập mô tả "
//                             }
//                             name='description'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Hãy nhập mô tả '
//                                 }
//                             ]}
//                         >
//                             <Input.TextArea rows={4} placeholder="Nhập mô tả" />
//                         </FormItem>
//                     </Col>
//                     <Col>
//                         <FormItem
//                             style={{ marginBottom: "4px" }}
//                             label={
//                                 "Ảnh"
//                             }
//                             name='file'
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Nhập ảnh'
//                                 }
//                             ]}
//                         >
//                             <Upload

//                                 listType="picture-card"
//                                 onPreview={handlePreview}

//                             >
//                                 {uploadButton}
//                             </Upload>


//                         </FormItem>
//                     </Col>
//                 </Row>



//                 <Row>

//                     <Col span={4}></Col>
//                     <Col span={16}
//                     >
//                         <Form.Item>
//                             <div style={{ display: "flex", marginTop: "10px", alignItems: "center", justifyContent: "center" }}>

//                                 {
//                                     action === "Add" ? <Button type="primary" htmlType="submit">Thêm mới</Button> : <Button style={{ width: "80px" }} type="primary" htmlType="submit">Lưu</Button>
//                                 }
//                                 <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => handleModal()}>Hủy</Button>

//                             </div>
//                         </Form.Item>

//                     </Col>
//                     <Col span={4}></Col>

//                 </Row>
//             </Form>

//         </Modal>
//     </Fragment>
};

export default ModalAddMatHang
