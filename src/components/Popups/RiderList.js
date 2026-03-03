import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Button,
  Text,
  Icon,
  Spinner,
  InputGroup,
  Tag,
} from "@blueprintjs/core";
import Notif from "../Notification";
import { OutletManagementAPI, OrderManagementAPI } from "../../api";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import RiderDetails from "./RiderDetails";

export default function RiderList({ onClose, order, data, isOpen }) {
  const [selectedRider, setSelectedRider] = useState(null);
  const [ridersList, setRidersList] = useState([]);
  const [riderDetail, setRiderDetail] = useState([]);
  const [load, setLoad] = useState(false);
  const [modal, setModal] = useState({
    open: false,
  });

  // useEffect(() => {
  //   if (data) refreshData()
  // }, [data])
  useEffect(() => {
    if (isOpen) refreshData();
  }, [isOpen]);
  const refreshData = () => {
    setLoad(true);

    //Get total rider outlet wise
    OutletManagementAPI.getRiders({ outlet: data })
      .then((res) => {
        setLoad(false);
        setRidersList(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };
  const toggleItem = (stat, item) => {
    setSelectedRider(stat ? item : null);

    // postRiderDetails API call for getting particular rider assigned orders
    OrderManagementAPI.postRiderDetails({ rider_id: item?.id })
      .then((res) => {
        setRiderDetail(res.data);
        setModal({ open: !modal.open });
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  return (
    <Dialog isOpen={isOpen} style={{ minWidth: "60vw", background: "#fff" }}>
      <div className={Classes.DIALOG_BODY}>
        <Button
          icon="cross"
          className="close-btn"
          minimal
          onClick={() => {
            setSelectedRider(null);
            onClose();
          }}
        />
        <Text className="title">
          <Icon icon="dashboard" />
          Riders
        </Text>
        <div className="rider-body">
          {load && (
            <div className="rider-mask">
              <Spinner size={Spinner.SIZE_STANDARD} intent="primary" />
            </div>
          )}
          <div className="rider-body--head">
            <InputGroup large leftIcon="search" placeholder="Search Riders" />
            <div>
              <Tag intent="success" round minimal large>
                {ridersList.filter((v) => !v.is_assign).length} Rider(s)
              </Tag>
              <Button
                onClick={refreshData}
                large
                minimal
                icon="refresh"
                text="Refresh"
                intent="primary"
              />
            </div>
          </div>
          <div className="rider-cont">
            {ridersList.map((v) => {
              const isChecked = selectedRider?.id === v?.id;
              return (
                <div
                  className={`rider-card ${
                    v.is_assign && order?.rider_id === v?.id
                      ? "rider-card--unavailable"
                      : `rider-card--${isChecked ? "" : "un"}checked`
                  } ${v.order_data.length && "rider-card--assigned"} `}
                  onClick={() => {
                    if (order?.rider_id !== v?.id) toggleItem(!isChecked, v);
                  }}
                >
                  <div className="rider-details">
                    <span>
                      <GiFullMotorcycleHelmet />
                    </span>
                    <div>
                      <span>{v.name} </span>
                      <span>
                        <Icon iconSize={10} icon="phone" /> {v.mobile}
                      </span>
                    </div>
                    {v.order_data.length > 0 ? (
                      <div
                        style={{ animation: "blinkIndicator 4s" }}
                        className="flex border border-blue-500 font-bold text-[#2979ff] items-center justify-center absolute right-[-11px] top-[-11px] rounded-full bg-blue-100 h-6 w-6"
                      >
                        {v.order_data.length}
                      </div>
                    ) : null}
                  </div>
                  <Icon
                    className={`icon--${isChecked ? "" : "un"}checked`}
                    icon={"tick-circle"}
                  />
                </div>
              );
            })}
          </div>
          <RiderDetails
            isOpen={modal.open}
            riderDetail={riderDetail}
            onClosed={() => {
              setModal({ open: false });
            }}
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          disabled={selectedRider == null}
          intent="primary"
          icon="tick"
          text="Assign"
          onClick={() => {
            setSelectedRider(null);
            onClose(selectedRider);
          }}
        />
      </div>
    </Dialog>
  );
}
