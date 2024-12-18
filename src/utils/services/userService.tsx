
import CreateApiService from "../createApiService";

const api = CreateApiService();

const getUser = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/auth/list-user`,
    method: "GET",
    params: params
  });
};

const editUser = (data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/auth/edit-user`,
      method: "POST",
      data: data
    });
  };

  const deleteUser = (id: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/auth/delete-user/${id}`,
      method: "DELETE",
    });
  };
const editPermissionRole = (data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/permission_role/edit`,
        method: "POST",
        data: data
    });
};



const getAllPermissionRole = (role_id: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/permission_role/${role_id}`,
        method: "GET",
    });
};


const getAllPermission = () => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/permissions`,
        method: "GET",
    });
};

const deleteRole = (id_role:any) => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/role/${id_role}`,
        method: "DELETE",
    });
};

const editRole = (data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/role`,
        method: "PUT",
        data: data
    });
};

const getRole = () => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/role`,
        method: "GET",
    });
};


const createRole = (data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/auth/role`,
        method: "POST",
        data: data
    });
};



export const userServices = {
  getUser, editUser, editPermissionRole, getAllPermission, getAllPermissionRole, deleteRole, getRole, createRole, editRole,deleteUser
};
