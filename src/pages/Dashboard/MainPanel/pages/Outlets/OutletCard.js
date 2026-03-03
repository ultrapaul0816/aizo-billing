import React, { useState } from "react";
import { FaStore, FaRProject } from "react-icons/fa";
import {
  Switch,
  Button,
  Tooltip,
  Spinner,
  Tag,
  Icon,
  Position,
} from "@blueprintjs/core";
import { BackDropDiv } from "../../../../../components/Elements";
import { CenterContent } from "../../../../../components/Layout";
import { useHistory } from "react-router-dom";
import { GiSnail } from "react-icons/gi";
import { SiFastapi } from "react-icons/si";
import { FiThumbsUp } from "react-icons/fi";
import moment from "moment";

const statusIconType = {
  good: <FiThumbsUp />,
  excellent: <SiFastapi />,
  slow: <GiSnail />,
};

const AverageStatusTimeCard = ({ status, time, type }) => {
  return (
    <div className={`card ${type}`}>
      <div className="label">{status}</div>
      <div className="data-group">
        <span className="time">{time}</span>
        <div className={`icon-group ${type}`}>{statusIconType[type]}</div>
      </div>
    </div>
  );
};

export default function OutletCard({
  data,
  delay,
  checklistCallback,
  isLoading = false,
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
    <div
      className="outlet-card"
      style={{
        animationDelay: `${delay}s`,
        borderColor: data.is_pos_open ? "#106ba377" : "red",
      }}
    >
      {/* <div
        className="card-head"
        style={!data.is_pos_open ? { background: "#fff", color: "red" } : {}}
      >
        <span className="title">
          <Icon
            icon="shop"
            style={
              !data.is_pos_open ? { background: "red", color: "#fff" } : {}
            }
          />
          {data.Outletname}
        </span>
      </div> */}
      {isLoading ? (
        <BackDropDiv bcolor="#ffffff94">
          <CenterContent>
            <Spinner intent="primary" size={30} />
          </CenterContent>
        </BackDropDiv>
      ) : (
        ""
      )}
      <div className="card-body">
        <div>
          <span className="title">
            <Icon
              icon="shop"
              style={
                !data.is_pos_open ? { background: "red", color: "#fff" } : {}
              }
            />
            {data.Outletname}
          </span>
        </div>
        <div className="average-status">
          <AverageStatusTimeCard status="Accepted" time="1m" type="good" />
          <AverageStatusTimeCard status="Processing" time="4m" type="slow" />
          <AverageStatusTimeCard
            status="Prepared"
            time="10m"
            type="excellent"
          />
          <AverageStatusTimeCard status="Dispatched" time="2m" type="slow" />
        </div>
        <div className="ou-stat">
          <div>
            <Icon {...iconBack} icon="chart" />
            <span
              style={{ color: iconBack.style.color }}
              className="extra-info"
            >
              Total Sale
            </span>
            <span className="stat-figure">
              {" "}
              {currency + " " + data.total_sale.toFixed(2)}
            </span>
          </div>
          <div>
            <Icon {...iconBack} icon="box" />
            <span
              style={{ color: iconBack.style.color }}
              className="extra-info"
            >
              Total Orders
            </span>
            <span className="stat-figure">{data.total_order}</span>
          </div>
          <div>
            <Icon {...iconBack} icon="upload" />
            <span
              style={{ color: iconBack.style.color }}
              className="extra-info"
            >
              Opening Time
            </span>
            <span className="stat-figure">
              {data.opening_time
                ? moment(data.opening_time, ["hh:mm:ss"]).format("hh:mm a")
                : "-"}
            </span>
          </div>
          <div>
            <Icon {...iconBack} icon="download" />
            <span
              style={{ color: iconBack.style.color }}
              className="extra-info"
            >
              Closing time
            </span>
            <span className="stat-figure">
              {data.closing_time
                ? moment(data.closing_time, ["hh:mm:ss"]).format("hh:mm a")
                : "-"}
            </span>
          </div>
        </div>
        <Switch
          className="stat-toggler"
          checked={data.is_pos_open}
          large
          onChange={(e) => {
            e.target.checked = !data.is_pos_open;
            checklistCallback({ id: data.id, status: !data.is_pos_open });
            // setload((l) => ({ ...l, stat: true }))
          }}
        />
        <div className="card-bottom">
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
      </div>
    </div>
  );
}
