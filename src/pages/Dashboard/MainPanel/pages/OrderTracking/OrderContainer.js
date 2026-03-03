import React, { useEffect, useState } from "react";
import {
  Card,
  InputGroup,
  Button,
  Tabs,
  Tab,
  HTMLSelect,
  MenuItem,
} from "@blueprintjs/core";
import OrderCard from "./OrderCard";
import { useDispatch } from "react-redux";
import { updateOrder } from "../../../../../redux/Orders/actions";
import SettleDialog from "../Billing/SettleDialog";
import { OrderManagementAPI, OutletManagementAPI } from "../../../../../api";
import Notif from "../../../../../components/Notification";
import RiderList from "../../../../../components/Popups/RiderList";
import { Select } from "@blueprintjs/select";
import Confirmation from "../../../../../components/Popups/Confirmation";
import { FormattedMessage, useIntl } from "react-intl";
import NoOrderImage from "../../../../../utils/images/nf.png";

import moment from "moment";
export default function OrderContainer({
  orders,
  selectedOrder,
  orderCallback,
}) {
  const dispatchOrdersUpdate = useDispatch();
  const [orderArray, setOrderArray] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [tabOrders, setTabOrders] = useState([]);
  const [oStatus, setOStatus] = useState(0);
  const intl = useIntl();
  const [settleState, setSettleState] = useState({
    open: false,
    data: {},
    load: false,
  });
  const [confirmation, setConfirmation] = useState({
    open: false,
    data: false,
    load: false,
  });
  const [riderState, setRiderState] = useState({
    open: false,
  });

  const types = [
    {
      label: intl.formatMessage({ id: "Customer Name" }),
      value: "customer.name",
    },
    { label: "Customer Number", value: "customer.mobile" },
    { label: "Order number", value: "order_id" },
    { label: "Aggregator Order number", value: "channel_order_id" },
  ];
  const [query, setQuery] = useState({ q: "", type: types[0] });
  const updateOrders = (res) => {
    orderCallback(res);
    dispatchOrdersUpdate(
      updateOrder({ id: res.id, order_status: res.order_status + 1 })
    );
  };
  useEffect(() => {
    filterOrder();
  }, [query, tabOrders]);

  useEffect(() => {
    setOrderArray(orders);
    setTabOrders(
      oStatus &&
        orders.filter((o) => o.order_status === parseInt(oStatus)).length > 0
        ? orders.filter((o) => o.order_status === parseInt(oStatus))
        : parseInt(oStatus) === 8
        ? orders.filter((o) => !o.order_now && o.order_status === 1)
        : orders.filter(
            (o) =>
              o.order_status < 6 &&
              moment(o.order_time.slice(0, 19)).isSame(moment(), "day")
          )
    );
  }, [orders]);

  const handleQuery = (e) => {
    setQuery((q) => ({ ...q, q: e.target.value }));
  };
  const filterOrder = () => {
    console.log(tabOrders, query.type.value.split("."), query.q);
    setFilteredOrders(
      query.q
        ? [
            ...tabOrders.filter((o) => {
              const s = query.type.value.split(".");
              return normalizeString(
                s.length > 1 ? o[s[0]][s[1]] || "" : o[s[0]] || ""
              ).includes(normalizeString(query.q));
            }),
          ]
        : tabOrders
    );
  };
  const normalizeString = (st) => (st ? st.toLowerCase() : st);
  const setcommonOrders = (data) => {
    setFilteredOrders(data);
    setTabOrders(data);
  };
  const settleOrder = (data) =>
    setSettleState((st) => ({ ...st, data, open: true }));

  const cancelOrder = ({ id, reason }, callback) => {
    OrderManagementAPI.cancelorder({
      id,
      order_cancel_reason: reason || "",
    })
      .then((res) => {
        if (res.success) Notif.success("Order cancelled!");
        else Notif.error("Cannot cancel order. Please try again");
        callback();
      })
      .catch((err) => {
        console.log(err);
        callback();
      });
  };
  const confirmOrderCancellation = (data) => {
    if (data !== undefined) {
      setConfirmation((s) => ({ ...s, load: true }));
      if (data) {
        OrderManagementAPI.changeOrderStatus({
          order_id: confirmation.data.id.toString(),
        }).then((res) => {
          if (res && res.success) {
            cancelOrder(confirmation.data, () => {
              setConfirmation((s) => ({ ...s, open: false, load: false }));
            });
          } else Notif.error("An error occured while cancelling the order! ");
        });
      } else {
        cancelOrder(confirmation.data, () => {
          setConfirmation((s) => ({ ...s, open: false, load: false }));
        });
      }
    } else setConfirmation((s) => ({ ...s, open: false }));
  };

  return (
    <div className="order-cont">
      <SettleDialog
        load={settleState.load}
        data={settleState.data}
        isOpen={settleState.open}
        onClose={(data) => {
          setSettleState((st) => ({ ...st, load: true }));
          if (data) {
            OrderManagementAPI.settleOrder({
              settlement_details: data.map((d) => ({
                ...d,
                trannsaction_id: d.transaction_id,
              })),
              Payment_source: data[0].payment_name,
              id: settleState.data.id,
            }).then((res) => {
              console.log(res);
              if (res.success) {
                setSettleState((st) => ({
                  ...st,
                  open: false,
                }));
                Notif.success(
                  `Order number ${settleState.data.id} settled`,
                  1000
                );
                updateOrders({
                  ...settleState.data,
                  order_status: settleState.data.order_status + 1,
                });
              } else if (res && res.error && res.error.payment_detail) {
                Notif.error(res.error.payment_detail);
              } else
                Notif.error("An error occured while settling the order!", 1000);

              setSettleState((st) => ({
                ...st,
                load: false,
              }));
            });
          } else
            setSettleState((st) => ({
              ...st,
              open: false,
              load: false,
            }));
        }}
      />
      <div className="o-head">
        <div className="o-f">
          <div className="searchbar">
            <InputGroup
              large
              value={query.q}
              leftIcon="search"
              placeholder={intl.formatMessage({ id: "SearchOrders" })}
              onChange={handleQuery}
            />
            <Button
              icon="cross"
              minimal
              // intent='primary'
              onClick={() => setQuery((q) => ({ ...q, q: "" }))}
            />
          </div>
          <Select
            activeItem={query.type.label}
            popoverProps={{ minimal: true, usePortal: false }}
            items={types}
            filterable={false}
            itemRenderer={(props, { handleClick, modifiers }) => (
              <MenuItem
                key={props.id}
                // icon='shop'
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
                text={props.label ? props.label : ""}
              />
            )}
            onItemSelect={(type) => {
              setQuery((q) => ({ ...q, type }));
            }}
          >
            <Button
              // icon='filter'
              minimal
              large
              // className='type-filter'
              text={query.type.label}
              // intent='primary'
              rightIcon="chevron-down"
            />
          </Select>

          {/* <Button icon='refresh' minimal large intent='primary' /> */}
        </div>
        <div className="o-s">
          <Tabs
            animate
            className="o-tabs"
            selectedTabId={`tab-${oStatus}`}
            onChange={(e) => {
              const stat = parseInt(e.split("-")[1]);
              setOStatus(stat);
              orderCallback(null);
              setcommonOrders(
                stat && stat !== 8
                  ? orderArray.filter((o) => o.order_status === stat)
                  : stat === 8
                  ? orderArray.filter(
                      (o) => !o.is_order_now && o.order_status === 1
                      // &&
                      // !moment(o.order_time).isSame(moment(), "day")
                    )
                  : orderArray.filter(
                      (o) =>
                        o.order_status < 6 &&
                        moment(o?.order_time.slice(0, 19)).isSame(
                          moment(),
                          "day"
                        )
                    )
              );
            }}
          >
            <Tab
              title={
                <div className="tab-title">
                  Scheduled
                  <span>
                    {
                      orderArray.filter(
                        (o) => !o.is_order_now && o.order_status === 1
                        // &&
                        // !moment(o.order_time).isSame(moment(), "day")
                      ).length
                    }
                  </span>
                </div>
              }
              id="tab-8"
            />
            <Tab
              title={
                <div className="tab-title">
                  Received
                  <span>
                    {
                      orderArray.filter(
                        (o) =>
                          o.order_status < 6 &&
                          moment(o?.order_time.slice(0, 19)).isSame(
                            moment(),
                            "day"
                          )
                      ).length
                    }
                  </span>
                </div>
              }
              id="tab-0"
            />

            {[
              { index: 2, title: intl.formatMessage({ id: "Accepted" }) },
              { index: 3, title: intl.formatMessage({ id: "Prepared" }) },
              { index: 4, title: intl.formatMessage({ id: "Dispatched" }) },
              { index: 6, title: intl.formatMessage({ id: "Settled" }) },
              { index: 7, title: intl.formatMessage({ id: "Cancelled" }) },
            ].map((ind) => (
              <Tab
                title={
                  <div className="tab-title">
                    {ind.title}
                    <span>
                      {
                        orderArray.filter((o) => o.order_status === ind.index)
                          .length
                      }
                    </span>
                  </div>
                }
                id={`tab-${ind.index}`}
              />
            ))}
          </Tabs>
        </div>
      </div>

      <RiderList
        isOpen={riderState.open}
        order={selectedOrder}
        data={riderState.activeOutletId}
        onClose={(rider) => {
          if (rider) {
            setRiderState((st) => ({ ...st, open: false, isLoading: true }));
            OutletManagementAPI.assignRider({
              order_id: riderState.order_id,
              rider_id: rider.id,
            })
              .then((res) => {
                Notif.success("Rider assigned successfully!", 2000);
                setRiderState((st) => ({ ...st, isLoading: false }));
                dispatchOrdersUpdate(
                  updateOrder({
                    id: riderState.order_id,
                    rider_detail: [rider],
                    is_rider_assign: true,
                  })
                );
              })
              .catch((err) => {
                console.log(err);
                setRiderState((st) => ({ ...st, isLoading: false }));
              });
          } else setRiderState((st) => ({ ...st, open: false }));
        }}
      />

      <Confirmation
        loading={confirmation.load}
        isOpen={confirmation.open}
        onClose={confirmOrderCancellation}
      />
      <div className="o-cont">
        {/* display all received orders */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((v, i) => {
            return (
              <OrderCard
                delay={i}
                key={v.id}
                updateOrder={updateOrders}
                order={v}
                isRiderStateLoading={
                  v.id === riderState.order_id && riderState.isLoading
                }
                callback={orderCallback}
                confirmationCallback={(data) => {
                  setConfirmation((s) => ({ ...s, open: true, data }));
                }}
                settleCallback={settleOrder}
                riderCallback={({ id, order_id }) => {
                  if (id)
                    setRiderState((st) => ({
                      ...st,
                      open: true,
                      activeOutletId: id,
                      order_id,
                    }));
                  else Notif.error("Outlet not specified!");
                }}
              />
            );
          })
        ) : (
          // .reverse()
          <div className="no-data">
            <img src={NoOrderImage} />
            <span>
              <FormattedMessage id="No Orders!" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
