import Sider from "antd/es/layout/Sider";
import { Image, Menu } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";

import logo from '../../assets/snapedit_1702777474789.png'
import { RouterLinks } from "../../const/RouterLinks";
import {
  ReconciliationOutlined,
  HomeOutlined,
  InboxOutlined,
  UsergroupAddOutlined,
  FieldTimeOutlined,
  CoffeeOutlined,
  MoneyCollectOutlined,
  TableOutlined,
  DropboxOutlined,
  
} from "@ant-design/icons";
import {
  UploadOutlined,
  UserOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import SubMenu from "antd/es/menu/SubMenu";
import { memo } from "react";

interface props {
  collapsed: any,
  setCollapsed: any
}

const Sidebar = () => {
  const permissions_storage = localStorage.getItem('permissions');
  const permissions = permissions_storage?.split(',')

  const menuItems = [
    {
      permission: "view_invoice",
      key: RouterLinks.TONG_QUAN,
      label: "Tổng quan",
      icon: (
        <HomeOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
  
    },
    {
      permission: "view_invoice",
      key: "hoadon",
      label: "Quản lý hóa đơn",
      icon: (
        <MoneyCollectOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
      children: [
        {
          key: RouterLinks.HOA_DON,
          label: "Danh sách hóa đơn",
        },
        // {
        //   key: RouterLinks.THANH_TOAN_HOA_DON,
        //   label: "Thanh toán hoá đơn",
        // },
      ],
    },
    {
      key: "mathang",
      label: "Mặt hàng",
      icon: (
        <CoffeeOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
      children: [
        {
          permission: "view_product",
          key: RouterLinks.DS_MAT_HANG,
          label: "Danh sách mặt hàng",
        },
        {
          permission: "view_category",
          key: RouterLinks.DANH_MUC,
          label: "Danh mục",
        },
        // {
        //   key: RouterLinks.LUA_CHON,
        //   label: "Nhóm lựa chọn",
        // },
        {
          permission: "view_combo",
          key: RouterLinks.COMBO,
          label: "Combo",
        },
      ],
    },
    {
      permission: "view_table_food",
      key: RouterLinks.BAN,
      label: "Quản lý bàn",
      icon: (
        <TableOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
  
    },
    {
      permission: "view_workshift",
      key: RouterLinks.CA_LAM,
      label: "Quản lý ca làm",
      icon: (
        <FieldTimeOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
  
    },
    {
      permission: "view_employee",
      key: RouterLinks.BAO_CAO_NHAN_VIEN,
      label: "Nhân viên",
      icon: (
        <UserOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
  
    },
    {
      permission: "view_customer",
      key: RouterLinks.DANH_SACH_KHACH_HANG,
      label: "Danh sách khách hàng",
      icon: (
        <UsergroupAddOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
    },
    {
      permission: "view_supplier",
      key: RouterLinks.DANH_SACH_NHA_CC,
      label: "Danh sách nhà cung cấp",
      icon: (
        <UsergroupAddOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
    },
    // {
    //   key: RouterLinks.KHUYEN_MAI,
    //   label: "Khuyến mãi ",
    //   icon: (
    //     <AppstoreAddOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
    //   ),
  
    // },
    {
      permission: "view_shipment",
      key: "khohang",
      label: "Kho ",
      icon: (
        <DropboxOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
      children: [
        {
          permission: "view_shipment",
          key: RouterLinks.KHO_HANG,
          label: "Danh sách tồn kho",
        },
        {
          permission: "view_shipment",
          key: RouterLinks.NHAP_KHO,
          label: "Nhập kho ",
        },
        {
          permission: "view_shipment",
          key: RouterLinks.KIEM_KE,
          label: "Kiểm kê kho",
        },
      ],
  
    },
    {
      key: "user",
      label: "Quản lý người dùng",
      icon: (
        <UserOutlined style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }} />
      ),
      children: [
        {
          permission: "view_user",
          key: RouterLinks.USER_PAGE,
          label: "Tài khoản",
        },
        {
          permission: "view_role",
          key: RouterLinks.ROLE_PAGE,
          label: "Quyền người dùng",
        },
      ],
  
    },
   
  ];

  const filteredMenuItems: any = []
  menuItems.forEach((item: any) => {
    if (permissions) {
        if (item?.children) {
          const child_custom = item?.children.filter((child: any) => permissions.includes(child.permission))
          if (child_custom && child_custom.length > 0) {
            filteredMenuItems.push({
              ...item, 
              children: child_custom
            })
          }
         
        } else {
          if (permissions.includes(item.permission)) {
            filteredMenuItems.push(item)
          }
        }
    }
  });

  const navigate = useNavigate();
  const onClick = (e: any) => {
    navigate(e.key)
  }
  return (
    <Sider style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }} width={300} trigger={null}>
      <Image src={logo} preview={false} style={{ padding: 5, width: "200px", marginLeft: "34px" }} />
      <Menu
        selectedKeys={['/' + window.location.pathname.split("/")[1] + '/' + window.location.pathname.split("/")[2]]}
        defaultOpenKeys ={[window.location.pathname.split("/")[1]]}
        theme="dark"
        mode="inline"
        items={filteredMenuItems}
        onClick={onClick}
      >
        {/* {menuItems.map((item) => {
          if (item.children) {
            return (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    {" "}
                    {item.icon}
                    {item.label}
                  </span>
                }
              >
                {item.children.map((childItem: any) => {
                  if (permissions?.includes(childItem?.permisison) ) {
                    return (
                      <Menu.Item
                        key={childItem.key}
                      >
                        {childItem.label}{`${childItem?.permisison} check`}
                      </Menu.Item>
                    );
                  }
                })}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={item.key}
                icon={item.icon}
              >
                {item.label}
              </Menu.Item>
            );
          }
        })} */}
      </Menu>

    </Sider>
  );
};

export default memo(Sidebar);
