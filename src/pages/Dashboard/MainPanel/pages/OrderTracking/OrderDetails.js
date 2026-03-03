import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Tooltip,
  Position,
  Tag,
  Spinner,
} from "@blueprintjs/core";
import {
  IoMdCart,
  IoIosGlobe,
  IoMdInformationCircle,
  IoMdWallet,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { GoPackage } from "react-icons/go";
import moment from "moment";
import OrderManagement from "../../../../../api/OrderManagement";
import OutletManagementAPIs from "../../../../../api/OutletManagementAPIs";
import NoSelectImage from "../../../../../utils/images/select.png";

import TemperatureAPI from "../../../../../api/TemperatureAPI";
import FoodTag from "../../../../../components/FoodTag";
import { Expanded, CenterContent } from "../../../../../components/Layout";
import { printBill, printKOT } from "../Billing/utils";
import printJS from "print-js";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder } from "../../../../../redux/Orders/actions";
import { Select } from "@blueprintjs/select";
import OrderTransfer from "../../../../../components/Popups/OrderTransfer";
import Notif from "../../../../../components/Notification";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { AiOutlineWallet } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
const ACCENT_COLOR = "#2979ff";
const orderStatus = [
  { id: 1, title: "Recieved", color: "#009688", stat: "Received" },
  { id: 2, title: "Accepted", color: "#009688", stat: "Accepted" },
  { id: 3, title: "Food Ready", color: "#009688", stat: "Food Ready" },
  { id: 4, title: "Dispatched", color: "#2196f3", stat: "Dispatched" },
  { id: 5, title: "Delivered", color: "#4a148c", stat: "Delivered" },
  { id: 6, title: "Settled", color: "#0D8050", stat: "Settle" },
  { id: 7, title: "Cancelled", color: "#DB3737", stat: null },
];
const sources = {
  swiggy: "swiggy.jpg",
  pos: "ipOS.png",
  "call center": "ipOS.png",
  website: "insta.png",
  dunzo: "dunzo.png",
  satellite: "satellite.png",
  ubereats: "uber.png",
  zomato: "zomato.png",
  "z market": "z_market.png",
};
let detailsTimer = null;
export default function OrderDetails(props) {
  const [order, setOrder] = useState({ load: false });
  const [state, setState] = useState({
    openTransfer: false,
    loadTransfer: false,
    receiptConfig: [],
  });
  const [receivedConfig, setReceivedConfig] = useState([]);
  const dispatchOrderUpdate = useDispatch();
  const [outlets, setOutlet] = useState({
    items: [],
    selectedOutlet: { Outletname: "" },
  });
  const [isSpecialInst, setIsSpecialInst] = useState("");
  const [taxDetail, setTaxDetail] = useState([]);
  const { currency } = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const reduxoutlets = useSelector((state) => state.outlets);
  const { order_transfer } = useSelector((state) => state.permissions);
  const transferOrder = (transferDetails) => {
    OrderManagement.cancelorder({
      id: order.id,
      order_cancel_reason: `Order transferred ${transferDetails.transfer_reason}`,
    }).then((res) => {
      // console.log('order transfer 1', res)
      if (res.success) {
        const {
          name,
          email,
          mobile,
          address,
          order_description,
          taxes,
          sub_total,
          source,
          order_type,
          delivery_instructions,
          special_instructions,
          discount_name,
          total_bill_value,
          discount_value,
        } = order;
        const p = {
          customer: { name, mobile, email },
          address1: address,
          order_description,
          order_time: moment().toDate().toISOString(),
          taxes: taxes,
          sub_total: sub_total || total_bill_value,
          cart_discount: discount_value,
          Delivery_Charge: 0,
          Packing_Charge: 0,
          Order_Type: order_type ?? "Delivery",
          Payment_source: "payTm",
          Order_Source: source,
          delivery_instructions: delivery_instructions ?? "",
          special_instructions: special_instructions ?? "",
          outlet_id: transferDetails.outlet_id,
          settlement_details: [],
          discount_name: discount_name ?? "",
          is_transferred: true,
        };
        OrderManagement.placeOrder(p).then((r) => {
          if (r.success) {
            Notif.success(`Order #${order.id} transferred successfully!`, 4000);
            setState((st) => ({
              ...st,
              loadTransfer: false,
              openTransfer: false,
            }));
            setOrder({ load: false });
            dispatchOrderUpdate(updateOrder({ id: order.id, order_status: 7 }));
            fetchOrderDetails(order.id);
          } else {
            setState((st) => ({ ...st, loadTransfer: false }));
            Notif.error("Cannot transfer order! Plese try again.");
          }
        });
      } else {
        setState((st) => ({ ...st, loadTransfer: false }));
        Notif.error("Cannot transfer order! Plese try again.");
      }
    });
  };
  // console.log(order.log)
  const { path } = useRouteMatch();
  useEffect(() => {
    // console.log(reduxoutlets)
    if (reduxoutlets)
      setOutlet((ps) => ({
        ...ps,
        items: reduxoutlets.filter((o) => o.is_open) ?? [],
      }));
  }, [reduxoutlets]);
  useEffect(
    () => () => {
      if (detailsTimer) clearInterval(detailsTimer);
    },
    []
  );
  // useEffect(() => {
  //   console.log("order updated", order);
  // }, [order]);
  useEffect(() => {
    if (
      order.order_status &&
      order.order_status !== props.selectedOrder?.order_status
    ) {
      setOrder((o) => ({
        ...o,
        order_status: props.selectedOrder?.order_status,
        detail: props.selectedOrder,
      }));
    }
  }, [props]);
  useEffect(() => {
    // console.log(props)
    const { id, order_status } = props.selectedOrder ?? {};
    if (!!order.id && id !== order.id) {
      setOrder({ load: false });
      if (detailsTimer) clearInterval(detailsTimer);
    }
    if (id) {
      fetchOrderDetails(id);
      if (detailsTimer) clearInterval(detailsTimer);
      if (order_status < 7)
        detailsTimer = setInterval(() => {
          // console.log('timer')
          fetchOrderDetails(id);
        }, 4000);
    }
  }, [props.selectedOrder]);
  useEffect(() => {
    if (order?.special_instructions && order.order_status === 2) {
      speak(order.special_instructions);
    }
  }, [order.id]);
  useEffect(() => {
    if (props.selectedOrder) {
      OrderManagement.getReceivedConfig({
        id: props.selectedOrder.outlet_id,
      }).then((r) => {
        if (r.success) {
          setState((st) => ({
            ...st,
            receiptConfig: r.data[0],
          }));
          setOrder({ load: false });
          // dispatchOrderUpdate(updateOrder({ id: order.id, order_status: 7 }));
          fetchOrderDetails(order.id);
        } else {
          setState((st) => ({ ...st, loadTransfer: false }));
          // Notif.error('Cannot transfer order! Plese try again.')
        }
      });
      if (props.selectedOrder.outlet_id) {
        TemperatureAPI.getInvoiceData({
          id: props.selectedOrder.outlet_id,
        }).then((res) => {
          if (res) {
            // console.log("temp data", res.data[0]);
            setReceivedConfig(res.data[0]);
          }
        });
      }
    }
  }, [props.selectedOrder]);
  const fetchOrderDetails = (id) => {
    setOrder((o) => ({ ...o, load: true }));
    OrderManagement.getOrderDetails({ id })
      .then((res) => {
        dispatchOrderUpdate(
          updateOrder({
            id: props.selectedOrder.id,
            order_status: res.data[0].order_status,
            rider_detail: res.data[0]?.rider_detail ?? [],
            is_rider_assign: res.data[0]?.is_rider_assign,
            rider_id: res.data[0]?.rider_id,
          })
        );
        setOrder({
          ...res.data[0],
          load: false,
        });
      })
      .catch((err) => {
        console.log(err);
        setOrder((o) => ({ ...o, load: false }));
      });
  };
  const getStatus = (v) => {
    let t = null;
    for (let o of order.log) if (o.status_name === v) t = o;
    return t;
  };
  const statusColor = orderStatus[order.order_status]
    ? orderStatus[order.order_status - 1].color
    : "#DB3737";

  const renderAllowed = order && Object.keys(order).length > 1;
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance();
      // msg.voice = speechSynthesis.getVoices()[1]
      msg.text = text ?? order.special_instructions;
      speechSynthesis.speak(msg);
    }
  };
  useEffect(() => {
    OutletManagementAPIs.getTax({ status: true }).then((res) => {
      if (res && res.success) {
        setTaxDetail(res.data);
      }
    });
  }, []);
  // useEffect(() => {
  //   console.log("order details", order);
  // }, [order]);
  const settingLog = (orderId, event) => {
    OrderManagement.setLog({ event_name: event, order_id: orderId });
  };
  const intl = useIntl();
  return (
    <div className="order-det">
      <OrderTransfer
        load={state.loadTransfer}
        // data={order}
        callback={(tdata) => {
          // console.log(tdata)
          setState((st) => ({ ...st, loadTransfer: true }));
          transferOrder(tdata);
        }}
        onClose={() => {
          setState((st) => ({ ...st, openTransfer: false }));
        }}
        isOpen={state.openTransfer}
      />
      <div className="head">
        <span>
          {renderAllowed ? (
            <>
              <span
                className={`head-title head-title--${
                  order.order_status === 7 ? "cancelled" : "active"
                }`}
              >
                <Icon icon="blank" iconSize={12} />
                {order?.channel_order_id ?? order?.other_order_id}
              </span>
              {order.order_status < 7 ? (
                <Tooltip
                  position={Position.RIGHT}
                  className="o-refresh"
                  content="Refresh order"
                >
                  <Button
                    onClick={() => fetchOrderDetails(order.id)}
                    large
                    // text='Refresh'
                    icon="refresh"
                    intent="primary"
                    minimal
                    disabled={order.load}
                    loading={order.load}
                  />
                </Tooltip>
              ) : null}
            </>
          ) : null}
        </span>
        <div>
          {renderAllowed ? (
            <>
              {[
                {
                  name: "Print KOT",
                  icon: "print",
                  action: () => {
                    settingLog(order.other_order_id, "kot");
                    printJS({
                      printable: printKOT({
                        invoice: order.channel_order_id ?? order.other_order_id,
                        cart: order.order_description,
                        outlet: order?.outlet_name ?? "",
                        outlet_id: order?.outlet_id ?? "",
                        tokenNumber: props.tokenNumber,
                        configuration: receivedConfig,
                      }),
                      type: "raw-html",
                      documentTitle: "KOT",
                      showModal: false,
                    });
                  },
                },
                {
                  name: "Print Bill",
                  icon: "print",
                  action: () => {
                    settingLog(order.other_order_id, "bill");
                    printJS({
                      printable: printBill({
                        billNumber:
                          order.channel_order_id ?? order.other_order_id,
                        outlet: props.selectedOrder
                          ? props.selectedOrder.outlet_name
                          : null,
                        outlet_id: props.selectedOrder
                          ? props.selectedOrder.outlet_id
                          : null,
                        invoice: order.channel_order_id
                          ? `aggregator#${order.channel_order_id}`
                          : `Invoice#${order.other_order_id}`,
                        cart: order.order_description,
                        paymentMode: order.payment_mode
                          ? order.payment_mode
                          : "N/A",
                        total: {
                          subTotal: order.sub_total,
                          pc: order.packing_charge,
                          dc: order.delivery_charge,
                          tax: order.taxes || 0,
                          dis: order.discount_value,
                          grandTotal:
                            order.sub_total -
                            order.discount_value +
                            order.packing_charge +
                            order.delivery_charge +
                            order.taxes,
                        },
                        taxDetail: order.tax_detail,
                        bill: "order",
                        delivery_instructions: order.delivery_instructions,
                        customer: {
                          name: order.name,
                          email: order.email,
                          mobile: order.mobile,
                          address:
                            (order.address && order.address[0]?.address) ||
                            order.address?.address ||
                            "N/A",
                          locality:
                            (order.address && order.address[0]?.locality) ||
                            order.address?.locality ||
                            "",
                        },
                        source: order.source,
                        configuration: receivedConfig,
                        receiptData: state.receiptConfig,
                        orderTime: order.order_time,
                      }),
                      type: "raw-html",
                      documentTitle: "Bill",
                      showModal: false,
                    });
                  },
                },
                {
                  name: "Edit order",
                  icon: "annotation",
                  action: () => {
                    history.push(`${path}billing`, {
                      outlet: {
                        Outletname: order.outlet_name,
                        id: order.outlet_id,
                        // is_menu_synced: false,
                        // is_pos_open: true,
                        // is_urban_synced: false,
                        // opening_time: "23:12:23",
                        // total_order: 1,
                        // total_sale: 200,
                      },
                      order_type: 1,
                      existingOrder: order,
                    });
                  },
                },
                {
                  name: "Transfer order",
                  icon: "swap-horizontal",
                  action: () => {
                    setState({ openTransfer: true });
                  },
                  disabled: order.order_status > 1 && order_transfer,
                },
              ].map((o, i) =>
                o.disabled ? null : (
                  <Tooltip
                    key={i}
                    position={Position.BOTTOM_RIGHT}
                    content={o.name}
                  >
                    <Button
                      className="o-head-action"
                      large
                      onClick={o.action}
                      icon={o.icon}
                      intent="primary"
                      style={{ animationDelay: `${i / 40}s` }}
                    />
                  </Tooltip>
                )
              )}
            </>
          ) : (
            ""
          )}
          {/* <Button text='Edit' large icon='edit' intent='primary' minimal/> */}
        </div>
      </div>
      {renderAllowed ? (
        <div className="d-cont">
          <div className="d-status">
            <span
              className="stat-line"
              style={{
                width: `calc(${
                  order.order_status === 7
                    ? order.log.length - 1
                    : order.order_status
                }*8vw)`,
              }}
            >
              {order.order_status === 7 ? (
                <span className="stat-line-indicator stat-line-indicator--cancel">
                  <Icon icon="cross" />
                  {order.order_status === 7 && (
                    <span className="stat-line-box">
                      <span>{order?.cancel_reason ?? ""}</span>
                      {
                        order.log.filter(
                          (o) => o.status_name === "Cancelled"
                        )[0]?.created_at
                      }
                    </span>
                  )}
                </span>
              ) : (
                <span className="stat-line-indicator" />
              )}
            </span>
            {orderStatus.map((v, i) => {
              const active_stat = getStatus(v.stat);
              // console.log("vvvvvvvvvvvvvvvvvccccccccccc", active_stat);
              if (v.stat)
                return (
                  <div className="stat-item" key={v.id}>
                    <Icon
                      iconSize={14}
                      icon={active_stat ? "tick" : "time"}
                      className="icon"
                      style={
                        active_stat
                          ? {
                              backgroundColor: ACCENT_COLOR,
                              color: "#fff",
                              borderColor: ACCENT_COLOR,
                            }
                          : {
                              backgroundColor: "#ddd",
                              color: "#fff",
                            }
                      }
                    />
                    <span
                      className={`title title--${
                        active_stat ? "active" : "inactive"
                      }`}
                    >
                      {v.title}
                      {active_stat?.created_at && (
                        <span className="title-time">
                          <Icon color="#2979ff" icon="tick" iconSize={10} />
                          {moment(active_stat.created_at.slice(0, 19)).format(
                            "hh:mm a"
                          )}
                        </span>
                      )}
                      {active_stat && <span className="ac-arrow" />}
                    </span>
                    {active_stat && active_stat.key_person && (
                      <span
                        style={{ animationDelay: `${i / 30}s` }}
                        className="stat-date"
                      >
                        <Icon icon="person" iconSize={13} />
                        {active_stat?.key_person ?? ""}
                      </span>
                    )}
                  </div>
                  // </Tooltip>
                );
              else return null;
            })}
          </div>
          {/* <hr /> */}
          <div className="d-order">
            <div className="d-o-f">
              <div className="o-content">
                <div className="o-c-card">
                  <span className="title">
                    {/* <IoMdPerson />  */}
                    Customer Details
                  </span>
                  <div className="o-c-content customer">
                    {/* <span className='name'>
                      {order.name}
                      <Tag minimal intent='primary'>
                        {order.customer_type || 'N/A'}
                      </Tag>
                    </span> */}
                    <span
                      className="name"
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      <Icon intent="none" icon="person" />
                      {order.name || <i>Not Specified</i>}
                    </span>
                    <span
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      <Icon intent="none" icon="office" />
                      {(order.address &&
                        order.address[0]?.address +
                          order.address[0]?.locality) ||
                        order.address?.address +
                          ", " +
                          order.address?.locality || <i>Not Specified</i>}
                    </span>
                    <span>
                      <Icon intent="none" icon="phone" />
                      {order.mobile || <i>Not Specified</i>}
                    </span>
                    <span>
                      <Icon intent="none" icon="envelope" />
                      {order.email || <i>Not Specified</i>}
                    </span>
                  </div>
                </div>
                <div className="o-c-card cart">
                  <div className="title">
                    {/* <IoMdBookmark />  */}
                    Special Instructions
                    <Button
                      disabled={
                        order.special_instructions.trim().length ? false : true
                      }
                      intent="primary"
                      onClick={() => speak()}
                      icon="volume-up"
                    />
                    <Tooltip
                      position={Position.RIGHT}
                      style={{ float: "right" }}
                      className="edit-right-adj rightadj1"
                      content="Edit Special Instructions"
                    >
                      <Button
                        style={{ float: "right" }}
                        className="o-head-action edit-right-button"
                        large
                        onClick={() => setIsSpecialInst(true)}
                        name="Edit order"
                        icon="annotation"
                        // intent="primary"
                        // style={{ animationDelay: `${i / 40}s` }}
                      />
                    </Tooltip>
                  </div>
                  <div className="o-c-content">
                    {order.special_instructions ? (
                      <Tag
                        className="sp-inst"
                        minimal
                        large
                        fill
                        intent="primary"
                      >
                        {order.special_instructions}
                      </Tag>
                    ) : (
                      <i>Not Specified</i>
                    )}
                  </div>
                  <div className="title">
                    {/* <FaMotorcycle />  */}
                    Delivery Instructions
                    <Tooltip
                      position={Position.RIGHT}
                      style={{ float: "right" }}
                      className="edit-right-adj rightadj1"
                      content="Edit Delivery Instructions"
                    >
                      <Button
                        style={{ float: "right" }}
                        className="o-head-action edit-right-button"
                        large
                        // onClick={o.action}
                        name="Edit order"
                        icon="annotation"
                        // intent="primary"
                        // style={{ animationDelay: `${i / 40}s` }}
                      />
                    </Tooltip>
                  </div>
                  <div className="o-c-content">
                    {order.delivery_instructions || <i>Not Specified</i>}
                  </div>
                  <span className="title">
                    {/* <FaMotorcycle />  */}
                    Rider Details
                  </span>
                  <div className="o-c-content">
                    {order?.rider_detail?.length ? (
                      <div>
                        <span>
                          <Icon icon="person" />
                          {order.rider_detail[0].name}
                        </span>
                        <span>
                          <Icon icon="phone" />
                          +91 {order.rider_detail[0].mobile}
                        </span>
                        {/* <span>
                          <Icon iconSize={12} icon='envelope' />
                          {order.rider_detail[0].email}
                        </span> */}
                      </div>
                    ) : (
                      <i>Not Specified</i>
                    )}
                  </div>
                  <span className="title">
                    {/* <IoMdCash />  */}
                    Charges
                  </span>
                  <div className="o-c-content">
                    <span>
                      <span>
                        <Icon icon="bank-account" />
                        Subtotal
                      </span>
                      <p>{currency + " " + order.sub_total}</p>
                    </span>
                    <span>
                      <span>
                        <Icon icon="tag" />
                        Discount
                        {order?.discount_name ? (
                          <Tag intent="primary">{order?.discount_name}</Tag>
                        ) : null}
                      </span>
                      <p>
                        {currency +
                          " " +
                          parseFloat(order.discount_value).toFixed(2)}
                      </p>
                    </span>
                    <span>
                      <span>
                        <Icon icon="percentage" />
                        Total Tax value
                        {/* <Tag round minimal intent='primary'>
          
                        </Tag> */}
                      </span>
                      <p>
                        {currency} {order.taxes ? order.taxes.toFixed(2) : 0}
                      </p>
                    </span>
                    {order &&
                      order.tax_detail &&
                      order.tax_detail.map((data, idx) => (
                        <span>
                          <span>
                            <Icon icon="percentage" />
                            {data.tax_name}
                            <Tag round minimal intent="primary">
                              {data?.tax_percent + "%"}
                            </Tag>
                          </span>
                          <p>
                            {currency}{" "}
                            {data.tax_value ? data.tax_value.toFixed(2) : 0}
                          </p>
                        </span>
                        // <span>
                        //   <span>
                        //     <Icon icon='percentage' />
                        //     CGST
                        //     <Tag round minimal intent='primary'>
                        //       2.5%
                        //     </Tag>
                        //   </span>
                        //   <p>{(order.taxes / 2).toFixed(2) || 0}</p>
                        // </span>
                        // <span>
                        //   <span>
                        //     <Icon icon='percentage' />
                        //     SGST
                        //     <Tag round minimal intent='primary'>
                        //       2.5%
                        //     </Tag>
                        //   </span>
                        //   <p>{(order.taxes / 2).toFixed(2) || 0}</p>
                        // </span>
                      ))}
                    <span>
                      <span>
                        <Icon icon="cube-add" />
                        Packaging
                      </span>
                      <p>
                        {currency}{" "}
                        {order.packing_charge
                          ? order.packing_charge.toFixed(2)
                          : 0}
                      </p>
                    </span>
                    <span>
                      <span>
                        <Icon icon="cube-add" />
                        Delivery
                      </span>
                      <p>
                        {currency}{" "}
                        {order.delivery_charge
                          ? order.delivery_charge.toFixed(2)
                          : 0}
                      </p>
                    </span>
                    <hr />
                    <span className="g-total">
                      <span>
                        <Icon icon="plus" />
                        Grand Total
                      </span>
                      <p>
                        {currency + " " + order.total_bill_value?.toFixed(2)}
                      </p>
                    </span>
                    <span className="g-total">
                      <span>Payment Mode</span>
                      <p>
                        {/* {order.payment_mode
                          ? order.payment_mode.map((payment) => payment)
                          : "N/A"} */}

                        {order?.payment_mode}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-o-s">
              <div
                className="o-brand"
                style={{
                  borderColor: statusColor,
                }}
              >
                <div>
                  <span style={{ textTransform: "uppercase" }}>
                    {/* <IoIosGlobe /> */}
                    {order.source ? (
                      <img className="o-source" src={order.pic} />
                    ) : (
                      <span className="o-source">{order.source}</span>
                    )}
                    <span> {order.source || "N/A"}</span>
                  </span>
                  <span>
                    <AiOutlineWallet />
                    <span className="extra-info">Total</span>
                    <span>
                      {currency + " " + order.total_bill_value?.toFixed(2)}
                    </span>
                  </span>
                  <span>
                    <GoPackage />
                    <span className="extra-info">Order Type</span>
                    <span>{order?.order_type ?? "Delivery"}</span>
                  </span>
                  <span>
                    <IoMdInformationCircleOutline />
                    <span className="extra-info">Status</span>
                    <span>{order.order_status_name}</span>
                  </span>
                </div>
              </div>
              <div className="head">
                <span>
                  <IoMdCart />
                  Items
                </span>
              </div>
              <div className="item-cont">
                <div className="i-head">
                  <span>
                    {/* <Icon icon='shopping-cart' /> */}
                    Items
                  </span>
                  <Tag minimal round>
                    Total items: {order.order_description.length}
                  </Tag>
                </div>
                {order.order_description.map((item) => {
                  return (
                    <div className="item-card" key={item.id}>
                      <div className="i-cont" style={{ flex: 1 }}>
                        <FoodTag
                          back={false}
                          variant="fancy"
                          size={0}
                          type={item.food_type === "Vegetarian"}
                        />
                        <span className="i-t">{item.name}</span>
                        <span style={{ color: "#424242" }}>
                          {currency + " " + item.price}
                        </span>
                        <Tag
                          style={
                            item.quantity > 1
                              ? { animation: "blinkIndicator 4s infinite" }
                              : {}
                          }
                          className="qty"
                        >
                          {item.quantity}
                        </Tag>
                      </div>
                      <div className="i-cust">
                        {item.size !== "N/A" || item.varients !== "N/A" ? (
                          <div className="i-v">
                            <Tag
                              minimal
                              // intent='primary'
                              // rightIcon='chevron-right'
                              round
                            >
                              Variant
                            </Tag>
                            <Tag minimal>{item.size || item.varients}</Tag>
                          </div>
                        ) : (
                          ""
                        )}
                        {item.add_ons && item.add_ons.length ? (
                          <div className="i-c">
                            <Tag
                              minimal
                              // intent='primary'
                              // rightIcon='chevron-right'
                              round
                            >
                              Add ons
                            </Tag>
                            <div>
                              {item.add_ons.map(
                                (a, i) => (
                                  // a.addon_name ? (
                                  // v.add_ons.map(a => (
                                  <Tag
                                    round
                                    intent="none"
                                    minimal
                                    key={`${a.addon_id}${i}`}
                                  >
                                    {`${a.addon_name || a.title} ${
                                      currency + " " + a.price
                                    }`}
                                  </Tag>
                                )
                                // ))
                                // ) : (
                                //   <Tag round intent='none' minimal>
                                //     {`${a.name || a.title} ₹${a.price}`}
                                //   </Tag>
                                // )
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Expanded>
          <CenterContent>
            {props.selectedOrder ? (
              <div>
                {<Spinner size={Spinner.SIZE_SMALL} intent="primary" />}
              </div>
            ) : (
              <div className="no-select">
                <img src={NoSelectImage} />
                <span>
                  {intl.formatMessage({ id: "Please select an order" })}
                </span>
              </div>
            )}
          </CenterContent>
        </Expanded>
      )}
    </div>
  );
}
