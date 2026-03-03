import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const statusOb = {
  schedule: 8,
  accepted: 2,
};

const normalizeString = (st) => (st ? st.toString().toLowerCase() : st);

const useFilteredOrders = (tab, query) => {
  const [filteredOrders, setFilteredOrders] = useState([]);

  const filterOrderByQuery = () => {
    setFilteredOrders([
      ...orders.filter((o) => {
        const s = query.type.value.split(".");
        return normalizeString(
          s.length > 1
            ? s[0] === "customer"
              ? o[s[0]][s[1]] + " " + o[s[0]][s[2]]
              : o[s[0]][s[1]] || ""
            : o[s[0]] || ""
        ).includes(normalizeString(query.q));
      }),
    ]);
  };

  const orders = useSelector((state) => state.orders.all);

  useEffect(() => {
    // filter orders search wise
    if (query.q) {
      filterOrderByQuery();
      return;
    }

    // filter orders tab wise
    if (tab) {
      if (tab === statusOb.schedule) {
        setFilteredOrders(
          orders.filter(
            (o) =>
              o.order_status < 4 &&
              o.schedule_date &&
              moment(o.schedule_date).isAfter()
          )
        );
        return;
      }
      setFilteredOrders(orders.filter((o) => o.order_status === tab));
      return;
    }
    // default status order received
    setFilteredOrders(
      orders.filter(
        (o) => o.order_status < 6 && !moment(o.schedule_date).isAfter()
      )
    );
  }, [orders, tab, query]);

  return { orders, filteredOrders };
};

export default useFilteredOrders;
