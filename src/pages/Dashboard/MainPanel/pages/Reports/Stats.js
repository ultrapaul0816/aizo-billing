import { Spinner } from "@blueprintjs/core";
import { useMemo } from "react";
import { toAbsoluteUrl } from "utils/helpers";

const assets = {
  order_source: {
    Zomato: "/media/zomato.png",
    Swiggy: "/media/swiggy.png",
    Counter: "/media/counter.png",
    "Website Order": "/media/website.png",
    Phone: "/media/phone.png",
  },
  payment_mode: {
    "Zomato Online": "/media/zomato.png",
    "Swiggy Online": "/media/swiggy.png",
    Cash: "/media/counter.png",
    Paytm: "/media/paytm.png",
    Razorpay: "/media/razorpay.png",
    PayU: "/media/payu.png",
    UPI: "/media/upi.webp",
  },
};

export default function Stats({
  orderData,
  isLoading = false,
  label,
  selector,
}) {
  const data = useMemo(() => {
    const payment = {};
    orderData.forEach((item) => {
      if (item.order_status_name === "Settled") {
        if (!payment[item[selector]])
          payment[item[selector]] = { count: 0, total: 0 };

        payment[item[selector]] = {
          count: payment[item[selector]]["count"] + 1,
          total:
            item.total_bill_value + (payment[item[selector]]["total"] || 0),
        };
      }
    });
    return payment;
  }, [orderData]);

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
              <th>{selector.replace("_", " ")}</th>
              <th>Count</th>
              <th>Amount</th>
            </thead>
            <tbody>
              {data &&
                Object.keys(data).map((item) => (
                  <tr>
                    <td>
                      <span className="title">
                        <img
                          className="icon"
                          src={toAbsoluteUrl(assets[selector][item])}
                          alt={item}
                        />
                        {item}
                      </span>
                    </td>
                    <td>{data[item].count}</td>
                    <td>₹ {data[item].total.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
