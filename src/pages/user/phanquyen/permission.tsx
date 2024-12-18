import React, { useEffect, useState, useContext, useRef } from "react";
import { Table, Row, Col, Card, Breadcrumb, Divider, Checkbox, Button } from "antd";
import { ColumnProps } from "antd/es/table";
import { userServices } from "../../../utils/services/userService";
import { message } from "antd";
interface DataType {
    id: string;
    name: string;
    create: { id: string; active: boolean };
    edit: { id: string; active: boolean };
    delete: { id: string; active: boolean };
    view: { id: string; active: boolean };
}

interface Props {
    id_role: any,
}

const PermissionTable: React.FC<Props> = (props: Props) => {
    const {id_role} = props;
    const [permissions, setPermissions] = useState<any>([])
    const [permissionRoles, setPermissionsRoles] = useState<any>([])
    const getAllPermissions = () => {
       userServices.getAllPermissionRole(id_role).then((role) => {
        userServices.getAllPermission().then((res) => {
            const permisison_role = role.data ? role.data : []
            setPermissionsRoles(permisison_role)

            const data_permissions = res.data
            const keys = Object.keys(data_permissions);
            const custom_data = keys.map((item) => {
                const permission_list = data_permissions[`${item}`]
                const name = permission_list[0]?.name
                return {
                    id: item,
                    name: name,
                    create: {
                       id : permission_list.find((p: any) => p.method === "create").id,
                       active: permisison_role.includes(permission_list.find((p: any) => p.method === "create").id)
                    },
                    edit: {
                        id : permission_list.find((p: any) => p.method === "edit").id,
                        active: permisison_role.includes(permission_list.find((p: any) => p.method === "edit").id)
                     },
                    delete: {
                        id : permission_list.find((p: any) => p.method === "delete").id,
                        active: permisison_role.includes(permission_list.find((p: any) => p.method === "delete").id)
                     },
                     view: {
                        id : permission_list.find((p: any) => p.method === "view").id,
                        active: permisison_role.includes(permission_list.find((p: any) => p.method === "view").id)
                     },

                }
            })
            setPermissions(custom_data)
        }).catch((err) => {
            console.log(err)
        });
       })
    }

    const handleCheckboxChange = (id: string, method: string) => {
        setPermissions((prevPermissions: any) =>
            prevPermissions.map((permission: any) =>
                permission.id === id
                    ? {
                          ...permission,
                          [method]: { ...permission[method], active: !permission[method].active },
                      }
                    : permission
            )
        );
    };

    const handleSave = (id_role: any) =>  {
      const change_permission: string[] = [];
      permissions.forEach((item:any) => {
         if (item?.create.active) {
            change_permission.push(item?.create.id)
         }
         if (item?.edit.active) {
            change_permission.push(item?.edit.id)
         }
         if (item?.view.active) {
            change_permission.push(item?.view.id)
         }
         if (item?.delete.active) {
            change_permission.push(item?.delete.id)
         }
      });

      const data_subtmit = {
        id_role: id_role,
        permissions: change_permission
      }
      console.log(data_subtmit)
      userServices.editPermissionRole(data_subtmit).then((res) => {
        getAllPermissions()
        message.success("Cập nhật quyền thành công")

      }).catch((err) => {
        message.error("Cập nhật quyền thất bại")
        console.log(err)
      })
    }

    useEffect(() => {
        getAllPermissions()
    }, [id_role])

    const columns: ColumnProps<DataType>[] = [
        {
            title: "Mã quyền",
            dataIndex: "id",
            align: "center"
        },
        {
            title: "Tên quyền",
            dataIndex: "name",
            align: "center"
        },
        {
            title: "Xem",
            dataIndex: "view",
            align: "center",
            render: (value, record) => (
                <Checkbox
                    checked={value.active}
                    onChange={() => handleCheckboxChange(record.id, "view")}
                />
            ),
        },
        {
            title: "Thêm",
            dataIndex: "create",
            align: "center",
            render: (value, record) => (
                <Checkbox
                    checked={value.active}
                    onChange={() => handleCheckboxChange(record.id, "create")}
                />
            ),
        },
        {
            title: "Sửa",
            dataIndex: "edit",
            align: "center",
            render: (value, record) => (
                <Checkbox
                    checked={value.active}
                    onChange={() => handleCheckboxChange(record.id, "edit")}
                />
            ),
        },
        {
            title: "Xoá",
            dataIndex: "delete",
            align: "center",
            render: (value, record) => (
                <Checkbox
                    checked={value.active}
                    onChange={() => handleCheckboxChange(record.id, "delete")}
                />
            ),
        }
    ]

    
    return <div>
            <Row>
                <h3>Danh sách quyền</h3>
                <Divider style={{ margin: "10px" }}></Divider>
            </Row>
            <Row>
                <Table
                    style={{ width: "100%" }}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={permissions}
                    columns={columns}
                    pagination={{
                        defaultPageSize: 10,
                    }}
                />
            </Row>
            <Row justify="center" style={{ marginTop: "5px" }}>
                <Button onClick={() => handleSave(id_role)} style={{width:"100px"}} type="primary">Lưu</Button>
            </Row>
    </div>
}
export default  PermissionTable