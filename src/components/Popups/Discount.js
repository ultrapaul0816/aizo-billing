import React, { useEffect, useState } from "react";
import {
  Dialog,
  Text,
  Icon,
  Classes,
  Button,
  Spinner,
  Tag,
} from "@blueprintjs/core";
import { OrderManagementAPI } from "../../api";

export default function Discount({ data, onClose, isOpen, callback }) {
  const [discounts, setDiscounts] = useState(null);
  const [selected, setSelected] = useState({});
  const { currency } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (data.id)
      OrderManagementAPI.getDiscountData({ outlet: data.id }).then((res) => {
        console.log("DISCOUNT: ", res);
        setDiscounts(null);
        if (res.success && res.data) {
          setDiscounts({
            percentage: res.data.filter(
              (di) => di.discount_type[0].label === "Percentage"
            ),
            flat: res.data.filter((di) => di.discount_type[0].label === "Flat"),
          });
        }
      });
  }, [data]);

  useEffect(() => {}, [discounts]);
  return (
    <>
      <Dialog
        canEscapeKeyClose
        style={{ background: "#fff", minWidth: "50vw" }}
        isOpen={isOpen}
      >
        <div className={`${Classes.DIALOG_BODY} customer-main`}>
          <Button
            icon="cross"
            className="close-btn"
            minimal
            onClick={onClose}
          />
          <Text className="title">
            <Icon icon="tag" />
            Discounts
          </Text>
          {discounts ? (
            <div className="discount-body">
              {Object.keys(discounts).map(
                (dt) =>
                  !!discounts[dt].length && (
                    <>
                      <div className="discount-type">{dt}</div>
                      <div className="discount-cont">
                        {discounts[dt].map((d) => (
                          <div
                            className="discount-item"
                            style={{
                              color: selected.id == d.id ? "#fff" : "#000",
                              background:
                                selected.id == d.id ? "#2979ff" : "#fff",
                            }}
                            onClick={() => {
                              setSelected((pstate) =>
                                pstate && pstate.id === d.id
                                  ? {}
                                  : { ...d, open_reason: d.is_reason_required }
                              );
                            }}
                          >
                            <span className="d-name">{d.discount_name}</span>
                            <Tag
                              minimal
                              style={
                                selected.id === d.id ? { color: "#fff" } : {}
                              }
                              round
                              intent="primary"
                            >
                              {d.flat_percentage !== "0"
                                ? d.flat_percentage + "% off"
                                : currency + " " + d.flat_discount + " off"}
                            </Tag>
                            {selected.id === d.id && (
                              <Icon
                                iconSize={15}
                                icon="tick-circle"
                                intent="none"
                                className="check"
                              />
                            )}
                            {d.is_reason_required && (
                              <Tag
                                className="reason-tag"
                                round
                                // intent='primary'
                                // minimal
                                style={
                                  selected.id == d.id
                                    ? { color: "#ffffffa5" }
                                    : {}
                                }
                              >
                                {(selected.id == d.id &&
                                  selected.reason_given) ||
                                  "Reason required"}
                              </Tag>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )
              )}
            </div>
          ) : (
            <div>
              <span style={{ textAlign: "center", display: "block" }}>
                No Discount Available
              </span>
            </div>
            // <Spinner size={20} />
          )}
        </div>
        {discounts && (
          <div className={Classes.DIALOG_FOOTER}>
            <Button
              large
              intent="primary"
              icon="tick"
              text="Apply"
              // disabled={Object.keys(selected).length == 0}
              onClick={() => {
                callback(selected);
                onClose();
              }}
            />
          </div>
        )}
      </Dialog>
      <Dialog style={{ background: "#fff" }} isOpen={!!selected.open_reason}>
        <div className={`${Classes.DIALOG_BODY} reason-dialog`}>
          <Text className="title">
            Please select a reason for this discount:
          </Text>
          {selected.reason &&
            selected.reason.map((r) => (
              <div
                className="reason-item"
                onClick={() => {
                  setSelected((pstate) => ({
                    ...pstate,
                    open_reason: false,
                    reason_given: r.reason,
                  }));
                }}
              >
                {r.reason}
              </div>
            ))}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            large
            intent="danger"
            minimal
            // icon='tick'
            text="Cancel"
            onClick={() => {
              setSelected({});
            }}
          />
        </div>
      </Dialog>
    </>
  );
}
