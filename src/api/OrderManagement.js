import { requestPost, requestGet } from "./";

export default class OrderManagement {
  static async listOrdersProcess() {
    const { data } = await requestGet({
      url: "/order/processlist/",
    });
    return data ? data : false;
  }
  static async changeOrderStatus(body) {
    const { data } = await requestPost({
      url: "/ordermgnt/ChangeStatus/",
      body,
    });
    return data ? data : false;
  }
  static async fetchAllOrders(errorCallback) {
    const { brand } = localStorage
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {};
    const { data } = await requestGet({
      url: `/ordermgnt/Order/?brand=${brand}`,
      errorCallback,
    });
    return data ? data : false;
  }
  static async getOrderDetails(body) {
    const { data } = await requestPost({
      url: "/ordermgnt/Retrieval/",
      body,
    });
    return data ? data : false;
  }
  static async newOrderListener(errorCallback) {
    const { brand } = localStorage
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {};
    const { data } = await requestPost({
      url: "/ordernotification/seen/",
      errorCallback,
      body: { brand: brand },
    });
    return data ? data : false;
  }
  static async newOrderListener2(errorCallback) {
    const { brand } = localStorage
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {};
    const { data } = await requestPost({
      url: "/ordernotification/seen/",
      errorCallback,
      body: { brand: brand },
    });
    return data ? data : false;
  }

  // static async acceptOrder(id) {
  //   const { data } = await requestPost({
  //     url: '/ordernotification/accepted/',
  //     body: { id, is_accepted: true }
  //   })
  //   return data ? data : false
  // }
  static async cancelorder({ id, order_cancel_reason }) {
    const { data } = await requestPost({
      url: "/ordernotification/accepted/",
      body: { id, order_cancel_reason, is_accepted: "false" },
    });
    return data ? data : false;
  }
  static async placeOrder(body) {
    // console.log("final Payloaddddddddddddddd", body)
    const { data } = await requestPost({
      url: "/ordermgnt/Orderprocess/",
      body,
    });
    return data ? data : false;
  }
  static async getDiscountData(body) {
    const { data } = await requestPost({
      url: "/alldiscount/",
      body,
    });
    return data ? data : false;
  }

  static async getCouponData(body) {
    const { data } = await requestPost({
      url: "/couponcode/",
      body,
    });
    return data ? data : false;
  }
  static async settleOrder(body) {
    const { data } = await requestPost({
      url: "/order/billsettle/",
      body,
    });
    return data ? data : false;
  }
  static async getReceivedConfig(body) {
    // console.log("Received configuration", body);
    const { data } = await requestPost({
      url: "/outletmgmt/receipt/",
      body,
    });
    return data ? data : false;
  }
  static async getPaymentMethods(body) {
    const { data } = await requestPost({
      url: "/payment/list/",
      body,
    });
    return data ? data : false;
  }

  static async getOrderSource(body) {
    const { data } = await requestGet({
      url: "https://zapio-admin.com/api/v2/listing/source/",
      extUrl: true,
      body,
    });
    return data;
  }
  static async getLocalities() {
    const { data } = await requestGet({
      url: "/city/",
    });
    return data;
  }
  static async setLog(body) {
    const { data } = await requestPost({
      url: "v2/brand/log/",
      body,
    });
    return data ? data : false;
  }
  static async postEditedOrder(body) {
    const { data } = await requestPost({
      url: "/ordermgnt/editorder/",
      body,
    });
    return data ? data : false;
  }
  static async postRiderDetails(body) {
    const { data } = await requestPost({
      url: "/rider/orderdetail/",
      body,
    });
    return data ? data : false;
  }
  static async postCallDetails(body) {
    return await requestPost({
      url: "/ordermgnt/callnotes/",
      body,
    });
  }
}
