import { Modal } from "antd";

import EditAccount from "../pages/auth/edit-account";
const ModalTaiKhoan = ({ isAdd, handleModal, setModalAddKhuonMat }) => {
  return (
    <Modal
      open={isAdd}
      toggle={handleModal}
      onCancel={handleModal}
      contentClassName="pt-0"
      autoFocus={false}
      width={800}
      height={400}
      footer={null}
    >
      <EditAccount />
    </Modal>
  );
};
export default ModalTaiKhoan;
