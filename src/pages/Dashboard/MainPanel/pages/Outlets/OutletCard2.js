import React, { useState } from "react";
import {
  Switch,
  Button,
  Tooltip,
  Spinner,
  Tag,
  Position,
} from "@blueprintjs/core";
import { BackDropDiv } from "../../../../../components/Elements";
import { CenterContent } from "../../../../../components/Layout";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { addPercentage } from "utils/helpers";

const statusTime = {
  Accepted: 1,
  Prepared: 15,
  Dispatched: 4,
};

const AverageStatusTimeCard = ({ status, time, type }) => {
  const calcStat = () => {
    if (parseFloat(time) < addPercentage(30, statusTime[status])) return "good";
    if (parseFloat(time) > addPercentage(30, statusTime[status])) return "slow";

    return "";
  };

  return (
    <div className={`average-card ${calcStat()}`}>
      <div className="label">{calcStat()}</div>
      <span className="time">{time}</span>
    </div>
  );
};

export default function OutletCard2({
  data,
  delay,
  checklistCallback,
  isLoading = false,
  isClosingTime = false,
}) {
  const { currency } = JSON.parse(localStorage.getItem("user"));
  const [load, setload] = useState({ menu: false, stat: false });
  const history = useHistory();
  const iconBack = {
    style: {
      // background: data.is_pos_open ? '#2979ff13' : '#d5000013',
      color: data.is_pos_open ? "#2979ff" : "#d50000",
    },
    iconSize: 18,
  };
  return (
    <tr
      className="outlet-tr"
      style={{
        animationDelay: `${delay}s`,
        borderColor: data.is_pos_open ? "#106ba377" : "red",
        backgroundColor: isClosingTime && "rgba(205, 66, 70, 0.1",
      }}
    >
      {isLoading ? (
        <BackDropDiv bcolor="#ffffff94">
          <CenterContent>
            <Spinner intent="primary" size={30} />
          </CenterContent>
        </BackDropDiv>
      ) : (
        ""
      )}
      <td>
        <span className="title">{data.Outletname}</span>
      </td>
      <td style={{ textAlign: "center" }}>
        <AverageStatusTimeCard
          status="Accepted"
          time={
            data.average_accept_time !== "N/A"
              ? data.average_accept_time + "m"
              : data.average_accept_time
          }
          type="good"
        />
      </td>
      {/* <td style={{ textAlign: "center" }}>
        <AverageStatusTimeCard status="Processing" time="4m" type="slow" />
      </td> */}
      <td style={{ textAlign: "center" }}>
        <AverageStatusTimeCard
          status="Prepared"
          time={
            data.average_prepared_time !== "N/A"
              ? data.average_prepared_time + "m"
              : data.average_prepared_time
          }
          type="excellent"
        />
      </td>
      <td style={{ textAlign: "center" }}>
        {" "}
        <AverageStatusTimeCard
          status="Dispatched"
          time={
            data.average_dispatch_time !== "N/A"
              ? data.average_dispatch_time + "m"
              : data.average_dispatch_time
          }
          type="slow"
        />
      </td>
      <td style={{ textAlign: "center" }}>{data.staff_logged_in} </td>
      <td style={{ textAlign: "center" }}>{data.total_pending_order} </td>

      <td style={{ textAlign: "center" }}> {data.total_order} </td>
      <td>
        {data.opening_time
          ? moment(data.opening_time, ["hh:mm:ss"]).format("hh:mm a")
          : "-"}{" "}
      </td>
      <td>
        {data.opening_time
          ? moment(data.opening_time, ["hh:mm:ss"]).format("hh:mm a")
          : "-"}{" "}
      </td>
      <td>
        {data.closed_at
          ? moment(data.closed_at, ["hh:mm:ss"]).format("hh:mm a")
          : "-"}{" "}
      </td>
      <td>
        <Switch
          className="stat-toggler"
          checked={data.is_pos_open}
          large
          onChange={(e) => {
            e.target.checked = !data.is_pos_open;
            checklistCallback({ id: data.id, status: !data.is_pos_open });
            // setload((l) => ({ ...l, stat: true }))
          }}
        />{" "}
      </td>
      <td>
        <div className="goto-billing">
          {data.is_pos_open ? (
            <Tooltip
              content="Start Billing"
              position={Position.TOP_LEFT}
              intent="primary"
            >
              <Button
                // text='Start Billing'
                large
                rightIcon="chevron-right"
                minimal
                intent="primary"
                onClick={() => history.push("/home/billing", { outlet: data })}
              />
            </Tooltip>
          ) : (
            <Tag
              minimal
              large
              // round
              intent="danger"
              style={{ animation: "popup 0.3s" }}
            >
              Outlet Closed
            </Tag>
          )}
        </div>
      </td>
    </tr>
  );
}
