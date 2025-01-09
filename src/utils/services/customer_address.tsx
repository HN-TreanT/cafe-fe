import createApiServices from "../createApiService";
const api = createApiServices();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer-address`,
    method: "GET",
    params: params,
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/online/customer-address",
    method: "POST",
    data,
  });
};

const remove = (Id: string) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer-address/${Id}`,
    method: "DELETE",
  });
};

const update = (Id: string, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer-address/${Id}`,
    method: "PUT",
    data,
  });
};

export const customerAddressServices = { get, remove, create, update };
