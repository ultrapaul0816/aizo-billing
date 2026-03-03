import UserAPIs from "./UserAPIs";
import axios from "axios";
import OutletManagementAPIs from "./OutletManagementAPIs";
import OrderManagement from "./OrderManagement";
import TemperatureAPI from "./TemperatureAPI";
import { BaseUrl } from "../config";
import { getAuthUser } from "utils/helpers";
const ENABLE_LOGGING = false;
// const BaseUrl = "http://192.168.0.21:1234";

const getAuthHeader = () => ({ Authorization: `Token ${getAuthUser().token}` });

export const requestPost = ({
  url = "",
  body,
  header = true,
  extUrl,
  errorCallback,
  extraConfig = {},
}) =>
  axios
    .post(`${extUrl ? url : BaseUrl + url}`, body, {
      headers: header ? { ...getAuthHeader() } : extraConfig,
    })
    .then((res) => {
      if (ENABLE_LOGGING) console.log("API Data", res.data);
      return res;
    })
    .catch((err) => {
      if (errorCallback) errorCallback(err);
      else console.log(err);
      return false;
    });
export const requestPatch = ({
  url = "",
  body,
  header = true,
  errorCallback,
  extraConfig = {},
}) =>
  axios
    .patch(`${BaseUrl}${url}`, body, {
      headers: header ? { ...getAuthHeader() } : extraConfig,
    })
    .then((res) => {
      if (ENABLE_LOGGING) console.log("API Data", res.data);
      return res;
    })
    .catch((err) => {
      if (errorCallback) errorCallback(err);
      else console.log(err);
      return false;
    });

export const requestGet = ({ url = "", extUrl = false, errorCallback }) =>
  axios
    .get(`${extUrl ? url : BaseUrl + url}`, { headers: getAuthHeader() })
    .then((res) => {
      if (ENABLE_LOGGING) console.log("API Data", res.data);
      return res;
    })
    .catch((err) => {
      if (errorCallback) errorCallback(err);
      else console.log(err);
      return false;
    });

export const requestGetWithQuery = ({ url = "", body = {} }) => {
  console.log(url, body);
  // const body = new FormData();
  const esc = encodeURIComponent;

  const queryString = Object.keys(body)
    .map((key) => `${key}=${body[key]}`)
    .join("&");

  const finalUrl = url + "?" + queryString;
  return axios
    .get(`${BaseUrl}${finalUrl}`, { headers: getAuthHeader() })
    .then((res) => {
      if (ENABLE_LOGGING) console.log("API Data", res.data);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
export const UserAPI = UserAPIs;
export const OutletManagementAPI = OutletManagementAPIs;
export const OrderManagementAPI = OrderManagement;
export { TemperatureAPI };
