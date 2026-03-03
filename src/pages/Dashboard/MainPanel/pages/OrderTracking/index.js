import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "../../../../../components/Layout";
import OrdersContainer from "./OrderContainer";
import OrderDetails from "./OrderDetails";

export default function OrderTracking() {
  const orders = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tokenNumber, setTokenNumber] = useState(0);

  useEffect(() => {
    if (selectedOrder)
      setTokenNumber(orders.map((o) => o.id).indexOf(selectedOrder.id) + 1);
  }, [selectedOrder]);

  return (
    <Grid cols={["2fr", "3fr"]} className="order-main">
      {/* <Grid cols={['43%', '3fr']} className='order-main'> */}
      <OrdersContainer
        orders={orders}
        selectedOrder={selectedOrder}
        orderCallback={(res) => setSelectedOrder(res)}
      />
      <OrderDetails tokenNumber={tokenNumber} selectedOrder={selectedOrder} />
    </Grid>
  );
}
