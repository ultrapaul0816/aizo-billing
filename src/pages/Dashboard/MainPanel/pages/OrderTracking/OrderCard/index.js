import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Popover,
  Position,
  PopoverInteractionKind,
  Tag,
  Icon,
  InputGroup,
  Spinner,
  Tooltip,
} from "@blueprintjs/core";
import { IoMdTime } from "react-icons/io";
import moment from "moment";
import OrderManagement from "../../../../../../api/OrderManagement";
import Notif from "../../../../../../components/Notification";
import Timer from "../Timer";
import { useSelector } from "react-redux";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import CustomerCallback from "../../../../../../components/Popups/CustomerCallback";
import OrderDelayBadge from "../OrderDelayBadge";
import RiderInfo from "./RiderInfo";

const orderStatus = [
  { title: "Placed", color: "#fff" },
  { title: "Accept", color: "#009688" },
  { title: "Food Ready", color: "#2196f3" },
  { title: "Dispatch", color: "#4a148c" },
  { title: "Deliver", color: "#0D8050" },
  { title: "Settle", color: "#ff6d00" },
  { title: "Settled", color: "#30404D" },
  { title: "Cancelled", color: "#DB3737" },
];

const getTimeStatus = (now) => `${moment(now).fromNow(true)} ago`;

let inputRef;
export default function OrderCard({
  order,
  callback,
  updateOrder,
  delay,
  settleCallback,
  riderCallback,
  isRiderStateLoading,
  confirmationCallback,
}) {
  const { currency } = JSON.parse(localStorage.getItem("user"));
  const [orderState, setOrderState] = useState(order);
  const [selected, setSelected] = useState(false);
  const [load, setload] = useState({ success: false, cancel: false });
  let card = null;
  const { order_cancellation } = useSelector((state) => state.permissions);
  const { orderSource } = useSelector((state) => state.Config);
  // console.log('Permissions', order_cancellation)
  const [state, setState] = useState({ isOpen: false });

  useEffect(() => {
    document.querySelector(".o-cont").addEventListener("click", () => {
      setSelected(false);
    });
  }, []);
  useEffect(() => {
    setOrderState({ ...order });
  }, [order]);

  const enableLoading = (key) => {
    setload((l) => ({ ...l, [key]: true }));
  };
  const disableLoading = (key) => {
    setload((l) => ({ ...l, [key]: false }));
  };
  const cancelOrder = (reason) => {
    if (orderState.order_status === 2) {
      confirmationCallback({ id: orderState.id, reason });
      return;
    }
    enableLoading("cancel");
    OrderManagement.cancelorder({
      id: orderState.id,
      order_cancel_reason: reason || "",
    })
      .then((res) => {
        disableLoading("cancel");
        if (res.success) {
          setOrderState((or) => ({
            ...or,
            order_status: 7,
          }));
          updateOrder({
            ...orderState,
            order_status: 7,
          });
        } else Notif.error("Cannot cancel order. Please try again");

        // changeStatus(res)
      })
      .catch(() => {
        disableLoading("cancel");
      });
  };
  const changeStatus = (response) => {
    if (response && response.success) {
      updateOrder(orderState);
      setTimeout(function () {
        setload({ ...load, success: false });
      }, 4000);
    } else {
      console.log(response);
      Notif.error(
        response?.message || "An error occured while changing the order status!"
      );
      setload({ ...load, success: false });
    }
  };
  // `${moment(orderState.order_time).toNow()} ago`;

  const orderColorScheme = orderStatus[orderState.order_status]?.color;
  const orderStatusName = orderStatus[orderState.order_status]?.title;

  return (
    <>
      <CustomerCallback
        info={orderState}
        isOpen={state.isOpen}
        onClose={() => setState((st) => ({ ...st, isOpen: false }))}
      />

      <Card
        ref={(ref) => (card = ref)}
        className="o-card"
        style={{
          animationDelay: 1 / (delay * 10) + "s",
          // background: selected ? '#00000005' : '#fff',
          // borderColor: orderColorScheme
          boxShadow: selected ? "0 0 0 2px " + orderColorScheme : "",
        }}
        onClick={() => {
          setSelected(true);
          callback(orderState);
        }}
      >
        <div className="c-left">
          {!order.is_order_now && (
            <Tooltip content="Scheduled Order Timing">
              <Button
                intent="danger"
                className="negative"
                minimal
                text={order?.schedule_date + " " + order?.schedule_time}
                style={{ padding: "1px", margin: "1px", minHeight: "2px" }}
              />
            </Tooltip>
          )}
          {["Accepted", "Food Ready"].includes(order?.order_status_name) && (
            <OrderDelayBadge
              outletId={order?.outlet_id}
              orderTime={order?.order_time.slice(0, 19)}
              orderStatus={order?.order_status_name}
            />
          )}

          {order.source ? (
            <React.Fragment>
              <img
                className="s-icon"
                style={
                  selected
                    ? {
                        boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
                        // transform: 'translateY(-5px)',
                      }
                    : {}
                }
                src={order.pic}
                alt="logo"
              />
            </React.Fragment>
          ) : (
            <span className="s-icon">{order.source}</span>
          )}
          <span className="order-id flex justify-center items-center">
            <IoMdTime /> {getTimeStatus(orderState?.order_time.slice(0, 19))}
          </span>

          {/* <span className="time-ind">
          <Tag intent="primary">
            {orderState?.channel_order_id ?? orderState?.order_id}
          </Tag>
        </span> */}
        </div>
        <div className="c-mid">
          <div className="c-m-f">
            <span>
              {/* <IoMdPerson /> */}
              {orderState.customer.name || (
                <i style={{ color: "rgba(0,0,0,0.1)" }}> {"N/A"} </i>
              )}
              {orderState.customer_type ? (
                <Tag intent="primary" minimal>
                  {orderState.customer_type}
                </Tag>
              ) : (
                ""
              )}
            </span>
            <span>
              {/* <IoMdWallet /> */}
              <Tag
                // round
                minimal
                intent="primary"
                style={{
                  margin: 0,
                  background: "transparent",
                  color: "#000",
                  padding: "0",
                }}
                // intent={orderState.payment_mode ? 'warning' : 'success'}
              >
                {`${
                  currency + " " + orderState.total_bill_value ||
                  orderState.sub_total
                } | ${orderState.payment_mode}`}
              </Tag>
            </span>
            {/* <span>
            <IoMdCalendar />
            {moment(orderState.order_time).format('MMM DD YYYY , hh:mm a')}
          </span> */}
            {/* <hr/> */}
            <span style={{ fontWeight: "500" }}>
              {/* <FaStore /> */}
              {/* <Tag minimal style={{ background: 'transparent',fontWeight:'bold' }} intent='primary'> */}
              {orderState?.order_id ?? ""}
              {/* </Tag> */}
            </span>

            {/* <FaStore /> */}

            <div>
              <Tag minimal>{orderState.outlet_name}</Tag>
            </div>
          </div>
          <div className="c-m-s">
            {isRiderStateLoading && (
              <div className="rider-mask">
                <Spinner intent="primary" size={20} />
              </div>
            )}
            {/* <GiHelmet className='icon' /> */}

            {orderState.order_status === 2 && (
              <RiderInfo
                orderState={orderState}
                riderCallback={riderCallback}
              />
            )}
          </div>
        </div>
        <div className="c-right">
          {orderState.order_status === 1 &&
          !moment(orderState?.order_time.slice(0, 19)).isSame(
            moment(),
            "day"
          ) ? (
            <>
              <Button
                rightIcon="time"
                intent="success"
                loading={load.success}
                text={moment(orderState?.order_time.slice(0, 19)).format(
                  "DD/MM/YYYY hh:mm:ss"
                )}
                className="positive"
                style={{
                  color: orderColorScheme,
                  // border: '1px solid ' + orderColorScheme + '47',
                }}
              />

              {order_cancellation && (
                <Popover
                  position={Position.LEFT_TOP}
                  interactionKind={PopoverInteractionKind.CLICK}
                  canEscapeKeyClose
                  minimal
                  content={
                    <div className="del-opt">
                      {load.cancel && (
                        <div className="mask">
                          <Spinner size={Spinner.SIZE_SMALL} />
                        </div>
                      )}
                      {[
                        "Item out of stock",
                        "No delivery boy available",
                        "Customer cancelled order",
                      ].map((op, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            cancelOrder(op);
                          }}
                          minimal
                          icon="error"
                          text={op}
                        />
                      ))}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          cancelOrder(inputRef.value);
                        }}
                      >
                        <InputGroup
                          inputRef={(ref) => (inputRef = ref)}
                          placeholder="Custom reason"
                        />
                      </form>
                    </div>
                  }
                >
                  <Button
                    rightIcon="chevron-down"
                    intent="danger"
                    className="negative"
                    minimal
                    text="Cancel"
                    // style={{ border: '1px solid #d50000' }}
                    loading={load.cancel}
                  />
                </Popover>
              )}
            </>
          ) : orderState.order_status < 6 ? (
            <>
              {/* {order.urban_detail &&
            order.urban_detail.is_aggregator &&
            order.order_status > 3 ? null : (
              <> */}
              {/* <Timer increment start={0} color={orderColorScheme} /> */}
              <Button
                rightIcon="arrow-right"
                intent="success"
                loading={load.success}
                style={{ minWidth: "6rem", color: orderColorScheme }}
                text={orderStatusName}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(true);
                  if (orderState.order_status < 5) {
                    setload({ ...load, success: true });
                    OrderManagement.changeOrderStatus({
                      order_id: orderState.id.toString(),
                      outlet_order_id: orderState.id.toString(),
                    }).then((res) => {
                      changeStatus(res);
                    });
                  } else {
                    if (orderState.urban_detail.is_aggregator) {
                      OrderManagement.settleOrder({ id: orderState.id }).then(
                        (res) => {
                          console.log("settle", res);
                          changeStatus();
                        }
                      );
                    } else {
                      settleCallback({
                        ...orderState,
                        price: orderState?.total_bill_value?.toFixed(2) || 0,
                      });
                    }
                  }
                }}
                className="positive"
              />

              {order_cancellation && (
                <Popover
                  position={Position.LEFT_TOP}
                  interactionKind={PopoverInteractionKind.CLICK}
                  canEscapeKeyClose
                  minimal
                  content={
                    <div className="del-opt">
                      {load.cancel && (
                        <div className="mask">
                          <Spinner size={Spinner.SIZE_SMALL} />
                        </div>
                      )}
                      {[
                        "Item out of stock",
                        "No delivery boy available",
                        "Customer cancelled order",
                      ].map((op, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            cancelOrder(op);
                          }}
                          minimal
                          icon="error"
                          text={op}
                        />
                      ))}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          cancelOrder(inputRef.value);
                        }}
                      >
                        <InputGroup
                          inputRef={(ref) => (inputRef = ref)}
                          placeholder="Custom reason"
                        />
                      </form>
                    </div>
                  }
                >
                  <Button
                    rightIcon="chevron-down"
                    intent="danger"
                    className="negative"
                    minimal
                    style={{ minWidth: "6rem" }}
                    text="Cancel"
                    // style={{ border: '1px solid #d50000' }}
                    loading={load.cancel}
                  />
                </Popover>
              )}
              {order.source !== "Swiggy" && (
                <Button
                  intent="success"
                  className="call-button"
                  onClick={() => setState((st) => ({ ...st, isOpen: true }))}
                >
                  {" "}
                  <Icon
                    style={{ marginRight: 3, marginBottom: 2 }}
                    icon="phone"
                    iconSize={10}
                  />{" "}
                  Call
                </Button>
              )}
            </>
          ) : (
            <span className="no-process" style={{ color: orderColorScheme }}>
              <span>
                <Icon icon="error" />
                {orderStatusName}
              </span>
            </span>
          )}
        </div>
        <span
          className="status"
          style={{
            backgroundColor: orderColorScheme,
          }}
        />
      </Card>
    </>
  );
}
