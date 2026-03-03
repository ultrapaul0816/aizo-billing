import { Button, Tag, Icon } from "@blueprintjs/core";
import moment from "moment";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { GoPackage } from "react-icons/go";

export default function RiderInfo({ orderState, riderCallback }) {
  const rider = orderState.rider_detail && orderState?.rider_detail[0];

  if (orderState?.order_type === "Pickup") {
    return (
      <div>
        <div>
          <GoPackage
            className="icon icon-enabled"
            style={{ fontSize: "2.5rem" }}
          />
          {/* <span className="title">Pickup</span> */}
          <span style={{ marginTop: "10px" }}>Pickup</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={
          orderState?.is_rider_assign ? { animation: "bounceReveal 0.3s" } : {}
        }
      >
        <GiFullMotorcycleHelmet
          className={`icon icon-${
            orderState.is_rider_assign ? "enabled" : "disabled"
          } `}
        />
        {orderState.is_rider_assign ? (
          <>
            <span className="title">{rider?.name ?? "N/A"}</span>
            <span>
              <Icon style={{ marginRight: 3 }} icon="phone" iconSize={10} />
              {rider?.mobile ?? "N/A"}
            </span>
          </>
        ) : (
          <Tag minimal intent="none">
            No rider
          </Tag>
        )}
        {orderState.delivery_type !== "Partner" ? (
          <Button
            intent="danger"
            className="negative"
            minimal
            text="Self Delivery"
            style={{
              padding: "1px",
              margin: "1px",
              minHeight: "2px",
            }}
          />
        ) : null}
      </div>

      {orderState.order_status === 1 &&
      !moment(orderState?.order_time.slice(0, 19)).isSame(moment(), "day") ? (
        <Button
          fill
          // onClick={() => {
          //   riderCallback({
          //     id: orderState?.outlet_id,
          //     order_id: orderState.id,
          //   });
          // }}
          // rightIcon={orderState.is_rider_assign ? "refresh" : "add"}
          minimal
          text={"Scheduled Order"}
          intent="primary"
        />
      ) : (
        orderState.order_status < 6 &&
        !orderState.urban_detail.is_aggregator && (
          <Button
            fill
            onClick={() => {
              riderCallback({
                id: orderState?.outlet_id,
                order_id: orderState.id,
              });
            }}
            rightIcon={orderState.is_rider_assign ? "refresh" : "add"}
            minimal
            text={`${orderState.is_rider_assign ? "Rea" : "A"}ssign`}
            intent="primary"
          />
        )
      )}
    </div>
  );
}
