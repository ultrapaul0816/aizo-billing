import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillExclamationCircle, AiFillWarning } from "react-icons/ai";
import { useSelector } from "react-redux";
import { addPercentTime } from "utils/helpers";

const icons = {
  warning: <AiFillWarning className="fa-times" style={{ fontSize: "18px" }} />,
  danger: (
    <AiFillExclamationCircle
      className="fa-times"
      style={{ fontSize: "18px" }}
    />
  ),
};

const standardTime = {
  Received: 1,
  Accepted: 15,
  "Food Ready": 4,
};

const percent = (percent, min) => {
  return ((percent / 100) * (min * 60)).toFixed(0);
};

const Badge = ({ type, delayTime }) => {
  const currentTime = moment();

  return (
    <div className={`alert-${type} alert d-flex`}>
      {icons[type]}
      <p
        style={{
          marginTop: "10px",
          marginLeft: "2px",
        }}
      >
        {type === "danger" ? "Delayed by" : "Will be delayed after"}{" "}
        <span>
          {moment
            .duration(
              type === "danger" // delayed
                ? currentTime.diff(delayTime)
                : delayTime.diff(currentTime)
            )
            .humanize()}
        </span>
      </p>
    </div>
  );
};

const OrderDelayBadge = ({ outletId, orderTime, orderStatus }) => {
  const currentTime = moment();
  const acceptTime = 1;
  const processTime = 15;
  const dispatchTime = 4;

  const [refresh, setRefresh] = useState(1);
  const outlets = useSelector((state) => state.outlets);
  const outletInfo = outlets.find((item) => item.id === outletId);

  const delayType = {
    Accepted: moment(orderTime).add(addPercentTime(0, processTime), "seconds"),
    "Food Ready": moment(orderTime).add(
      addPercentTime(0, dispatchTime + processTime + acceptTime),
      "seconds"
    ),
  };

  useEffect(() => {
    let timerInterval = setInterval(() => {
      setRefresh(refresh + 1);
    }, 60000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  if (moment(currentTime).isAfter(delayType[orderStatus]))
    return (
      <Badge key={refresh} type="danger" delayTime={delayType[orderStatus]} />
    );

  if (
    moment(currentTime).isAfter(
      moment(delayType[orderStatus]).subtract(
        percent(50, standardTime[orderStatus]),
        "seconds"
      )
    )
  )
    return (
      <Badge key={refresh} type="warning" delayTime={delayType[orderStatus]} />
    );

  return null;
};

export default OrderDelayBadge;
