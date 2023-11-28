// import React, { useState, useRef, useEffect, Fragment } from "react";
// // import { Button, Modal } from 'antd'
// import { X } from "react-feather";
// import Wizard from "@components/wizard";
// import { ThongTinChung } from "./ThongTinChung";

// import { Modal } from "antd";

// const ThemMoi = ({ open, handleModal, type, getData, idEdit }) => {
//   const CloseBtn = (
//     <X className="cursor-pointer" size={15} onClick={handleModal} />
//   );
//   const ref = useRef(null);
//   const [id, setId] = useState();
//   const [count, setCount] = useState();
//   const [eduContent, setEduContent] = useState();
//   // ** State
//   const [stepper, setStepper] = useState(null);

//   useEffect(() => {
//     if (idEdit !== undefined) {
//       setEduContent(idEdit);
//     }
//   }, [idEdit]);

//   const steps = [
//     {
//       id: "thongtinchung",
//       title: "Thông tin chung",
//       content: (
//         <ThongTinChung
//           getData={getData}
//           action={type}
//           educationScheduleID={educationSchedule.ID}
//           setEduContent={setEduContent}
//           eduContent={eduContent}
//           stepper={stepper}
//           handleModal={handleModal}
//         />
//       ),
//     },
//     {
//       id: "chuongtrinhchitiet",
//       title: "Danh sách nguyên liệu",
//       content: (
//         <ThemNguyeLieu
//           eduContent={eduContent}
//           setCount={setCount}
//           getData={getData}
//           stepper={stepper}
//           action={type}
//           educationSchedule={educationSchedule}
//         />
//       ),
//     },
//   ];
//   return (
//     <Modal
//       open={isAdd}
//       toggle={handleModal}
//       onCancel={onReset}
//       contentClassName="pt-0"
//       autoFocus={false}
//       className="modal-md"
//       footer={[]}
//     >
//       <div className="" toggle={handleModal} tag="div">
//         <h2 className="modal-title">
//           {action === "Add" ? "Thêm mới Lô hàng " : "Chỉnh sửa Lô hàng "}{" "}
//         </h2>
//       </div>

//       <div className="horizontal-wizard">
//         <Wizard
//           ref={ref}
//           steps={steps}
//           options={{
//             linear: false,
//           }}
//           instance={(el) => setStepper(el)}
//         />
//       </div>
//     </Modal>
//   );
// };
// export default ThemMoi;
