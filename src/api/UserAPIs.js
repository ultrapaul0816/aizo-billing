import { requestPost, requestGet, requestGetWithQuery, requestPatch } from "./";

export default class UserAPI {
  static async login(body) {
    const res = await requestPost({
      url: "/user/login/",
      body,
      header: null,
    });
    const { success } = res.data;
    if (success) {
      if (localStorage) localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  }
  static async logout() {
    const { token } = localStorage
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {};
    if (token) {
      const res = await requestPost({
        url: "/user/logout/",
        body: { token },
      });
      localStorage.removeItem("user");
      localStorage.removeItem("localities");
      return res ? res.data.success : false;
    }
  }
  static async getOrderDetails(body) {
    const res = await requestPost({
      url: "/user/orderdetail/",
      body,
    });
    const { success, data } = res.data;
    return success ? data : null;
  }
  static async changePassword(body) {
    const res = await requestPost({
      url: "/user/posuser/cpass/",
      body,
    });
    const { success, data } = res.data;
    return success ? data : null;
  }
  static async getProfileDetails() {
    const res = await requestGet({ url: "/user/posuser/list/" });
    return res.data;
  }
  static async updateProfile(body) {
    const res = await requestGet({ url: "/user/profile/update/" });
    const { success, data } = res.data;
    return success ? data : null;
  }
  static async searchCustomer(body) {
    const res = await requestPost({
      url: "/customer/list/",
      body,
    });
    const { data } = res.data;
    return res.data?.success ? data : null;
  }
  static async getCustomerDetails(body) {
    const res = await requestPost({
      url: "/customer/order/",
      body,
    });
    const { success, data } = res.data;
    return success ? data : null;
  }
  static async getStaffList() {
    const res = await requestGetWithQuery({
      url: "/attendance/list/",
    });
    // const {success, data} = res.data
    return res;
  }
  static async markAttendance(body) {
    const res = await requestPost({
      url: "/attendance/create/",
      body,
    });
    const { success, data } = res.data;
    return res.data;
  }
  static async markLogout(body) {
    const res = await requestPatch({
      url: "/attendance/logout/",
      body,
    });
    const { success, data } = res.data;
    return res.data;
  }
  static async updateTemp(body) {
    const res = await requestPatch({
      url: "/attendance/update/",
      body,
    });
    return res;
  }
  static async centerList() {
    const res = await requestGet({
      url: "/attendance/center/list/",
    });
    return res.data;
  }
}
