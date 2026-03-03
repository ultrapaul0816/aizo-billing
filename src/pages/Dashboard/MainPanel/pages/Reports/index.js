import { Button, Card, MenuItem, Spinner } from "@blueprintjs/core";
import { DateInput, DateRangeInput } from "@blueprintjs/datetime";
import { Select } from "@blueprintjs/select";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { OutletManagementAPI } from "../../../../../api";
import moment from "moment";
import Stats from "./Stats";
import "./style.scss";

const TotalCard = ({ isLoading, label, data }) => {
  return (
    <div className="stats">
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <>
          <h2>{label}</h2>
          <table>
            <thead>
              <th>Type</th>
              <th>Amount</th>
            </thead>
            <tbody>
              {data &&
                Object.keys(data).map((item) => (
                  <tr>
                    <td>{item}</td>
                    <td>
                      {["Gross Sale", "Net Sale"].includes(item) && "₹"}{" "}
                      {data[item]?.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default function Reports() {
  const [outlets, setOutlet] = useState({
    items: [],
    selectedOutlet: { Outletname: "" },
  });
  const reduxoutlets = useSelector((state) => state.outlets);
  const [searchAtt, setsearchAtt] = useState({
    dateRange: [
      moment().format("YYYY-MM-DD 01:00"),
      moment().format("YYYY-MM-DD 23:59"),
    ],

    outlet_id: [],
  });

  const [sales, setSales] = useState();
  const [skeleton, setSkeleton] = useState("");
  const { currency } = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setOutlet((ps) => ({
      items: reduxoutlets ? reduxoutlets.filter((o) => o.is_pos_open) : [],
      selectedOutlet: reduxoutlets.length
        ? reduxoutlets.filter((o) => o.is_pos_open)[0]
        : {},
    }));
  }, [reduxoutlets]);

  useEffect(() => {
    searchData();
  }, [outlets]);

  const { token, brand } = JSON.parse(localStorage.getItem("user"));
  const searchData = () => {
    if (outlets.items.length) {
      setSkeleton("bp4-skeleton");
      OutletManagementAPI.getOrderReport({
        start_date: moment(searchAtt.dateRange[0]).format("YYYY-MM-DD HH:mm"),
        end_date: moment(searchAtt.dateRange[1]).format("YYYY-MM-DD HH:mm"),
        outlet_id: [outlets.selectedOutlet.id] || [outlets.items[0].id],
        brand: brand,
      })
        .then((res) => {
          setSkeleton("");
          setSales(res);
        })
        .catch((err) => setSkeleton(""));
    }
  };

  return (
    <div className="attendance">
      <div className="report">
        <div className="left">
          <div className="attendance-header">
            <div className="btns-group">
              {/* <Button text='Search' */}
              <Select
                activeItem={outlets.selectedOutlet}
                popoverProps={{ minimal: true }}
                items={outlets.items}
                itemPredicate={(q, item) => {
                  return item.Outletname.toLowerCase().includes(
                    q.toLowerCase()
                  );
                }}
                filterable
                noResults={
                  <MenuItem intent="primary" disabled text="No results." />
                }
                itemRenderer={(props, { handleClick, modifiers }) => (
                  <MenuItem
                    key={props.id}
                    icon="shop"
                    onClick={handleClick}
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    style={{ textTransform: "capitalize" }}
                    text={props.Outletname ? props.Outletname : ""}
                  />
                )}
                onItemSelect={(ou) => {
                  setOutlet((o) => ({ ...o, selectedOutlet: ou }));
                }}
              >
                <Button
                  className="outlet-btn"
                  large
                  text={
                    outlets?.selectedOutlet?.Outletname || "Select outlet..."
                  }
                  intent="primary"
                  rightIcon="chevron-down"
                />
              </Select>

              <div className="date-group">
                <DateRangeInput
                  timePickerProps
                  singleMonthOnly
                  formatDate={(date) => moment(date).format("YYYY-MM-DD HH:mm")}
                  parseDate={(str) => new Date(str)}
                  allowSingleDayRange
                  value={[
                    moment(searchAtt.dateRange[0]).toDate(),
                    moment(searchAtt.dateRange[1]).toDate(),
                  ]}
                  onChange={(e) =>
                    setsearchAtt((prev) => ({ ...prev, dateRange: e }))
                  }
                />
              </div>

              <Button
                large
                text="Search"
                intent="none"
                onClick={searchData}
                disabled={skeleton}
                rightIcon={skeleton && <Spinner size="20" />}
              />
              <a
                href={`https://zapio-admin.com/api/pos/order/csv/?start_date=${moment(
                  searchAtt.dateRange[0]
                ).format("YYYY-MM-DD HH:mm")}&end_date=${moment(
                  searchAtt.dateRange[1]
                ).format("YYYY-MM-DD HH:mm")}&outlet_id=${
                  outlets.selectedOutlet?.id
                }&token=${token}`}
              >
                <Button
                  style={{ marginLeft: 8 }}
                  large
                  icon="download"
                  disabled={!searchAtt.dateRange[0] && !searchAtt.dateRange[1]}
                />
              </a>
            </div>
          </div>
          <div className="orders-data">
            <table>
              <th>order id</th>
              <th>Date</th>
              <th>order source</th>
              <th>outlet name</th>
              <th>Status</th>
              <th>payment mode</th>
              <th>sub total</th>
              <th>total</th>
              {sales &&
                sales.orderdata?.map((ob) => (
                  <tr
                    key={ob.id}
                    // onClick={() =>
                    //   setOrderDetails((prev) => ({
                    //     ...prev,
                    //     display: true,
                    //   }))
                    // }
                  >
                    <td>{ob.order_id}</td>
                    <td>
                      {moment(ob.order_time.slice(0, 19)).format(
                        "YYYY-MM-DD H:m"
                      )}
                    </td>
                    <td>{ob.order_source}</td>
                    <td>{ob.outlet_name}</td>
                    <td>{ob.order_status_name}</td>
                    <td>{ob.payment_mode}</td>
                    <td>
                      {currency} {ob.sub_total}
                    </td>
                    <td>
                      {currency} {ob.total_bill_value}
                    </td>
                  </tr>
                ))}
            </table>
            {/* {skeleton && (
              <div>
                <Spinner />
              </div>
            )} */}
          </div>
        </div>
        <div className="stats-group">
          <TotalCard
            isLoading={skeleton}
            label="Stats"
            data={{
              "Settled Orders": sales?.totalorder,
              "Gross Sale": sales?.grosssale,
              "Net Sale": sales?.netsale,
              Pending: sales?.pending_orders,
              Cancelled: sales?.cancelled,
            }}
          />
          <Stats
            selector="payment_mode"
            isLoading={skeleton}
            label="Payment wise"
            orderData={sales?.orderdata || []}
          />
          <Stats
            selector="order_source"
            isLoading={skeleton}
            label="Source wise"
            orderData={sales?.orderdata || []}
          />
        </div>
      </div>
    </div>
  );
}
