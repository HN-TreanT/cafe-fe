import createApiServices from "../createApiService";
const api = createApiServices();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/order`,
    method: "GET",
    params: params,
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/online/order",
    method: "POST",
    data,
  });
};

const remove = (Id: string) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/order/${Id}`,
    method: "DELETE",
  });
};

const update = (Id: string, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/order/${Id}`,
    method: "PUT",
    data,
  });
};

const changeStatus = (data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/order/change-status`,
    method: "POST",
    data,
  });
};

export const orderServices = { get, remove, create, update, changeStatus };
