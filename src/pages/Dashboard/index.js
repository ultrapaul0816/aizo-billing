import { useState, useEffect } from "react";
import { FullScreenWrapper, Grid } from "../../components/Layout";
import Sidebar from "./Sidebar";
import MainPanel from "./MainPanel";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, clearAllOrders } from "../../redux/Orders/actions";
import { actions } from "../../redux/Config";
import { gloabalFetchOutlets } from "../../redux/Outlet/actions";
import notifSound from "../../utils/sound/notif.mp3";
import alertSound from "../../utils/sound/when.mp3";
import Notif from "../../components/Notification";
import { Howl } from "howler";
import OrderManagement from "../../api/OrderManagement";
import { OrderManagementAPI, UserAPI } from "../../api";
import moment from "moment";
import { getAuthUser } from "utils/helpers";

let handle = null;
let totalCount = 0;
export default function Dashboard(props) {
  const dispatchAction = useDispatch();
  const totalOrders = useSelector((state) => state.orders);
  const [enableSound, setSoundEnabled] = useState(true);
  const [isOrderRecieved, setOrderRetrieval] = useState(0);
  const newOrderSound = new Howl({ src: [notifSound] });
  const alertOrderSound = new Howl({ src: [alertSound], loop: true });
  const TIME_INTERVAL = 5 * 1000;

  const unAuthorize = (err) => {
    if (err.response && err.response.status === 401) {
      if (handle) clearInterval(handle);
      dispatchAction(clearAllOrders());
      UserAPI.logout().then((res) => {
        // console.log(res)
        props.history.push("/");
      });
    }
  };
  const callOut = (msg) => {
    if ("speechSynthesis" in window) {
      const sp = new SpeechSynthesisUtterance();
      sp.text = msg;
      speechSynthesis.speak(sp);
    }
  };

  const handler = () => {
    OrderManagement.newOrderListener(unAuthorize).then((res) => {
      try {
        // console.log(res?.seen_count)

        if (res && res.status && res.ordercount) {
          if (res.seen_count && enableSound) {
            // callOut(`Please accept ${res.seen_count} orders`)
            ring(true);
          } else if (alertOrderSound.playing()) alertOrderSound.stop();

          if (res.ordercount > totalCount && res.seen_count) {
            refreshOrders();
            callOut("New order received!");
            ring();
            Notif.notify(
              `You have received ${res.seen_count} new order!`,
              60000,
              () => props.history.push("/home/")
            );
            // setOrderRetrieval(Math.random() * 100 + 2)
            // setOrderRetrieval(Math.random() * 100 + 2)
          }
          // if (res) dispatchAction(addOrder([res.orderdetails[0]]))
        }
      } catch (e) {
        console.log(e);
      }
    });
  };
  const refreshOrders = () => {
    OrderManagement.fetchAllOrders(unAuthorize).then((res) => {
      // console.log('All orders', res)

      if (res && res.orderdata) {
        const sortedOrders = res.orderdata.sort(
          (a, b) =>
            moment(b.order_time).toDate().getTime() -
            moment(a.order_time).toDate().getTime()
        );
        dispatchAction(addOrder(sortedOrders));
      }
    });
  };
  useEffect(() => {
    refreshOrders();
    handler();
    handle = setInterval(handler, TIME_INTERVAL);
    dispatchAction(gloabalFetchOutlets());
    OrderManagementAPI.getOrderSource().then((res) => {
      if (res && res.data) {
        dispatchAction(actions.getSource(res.data));
        // console.log(res.data);
      }
    });
  }, [enableSound]);
  useEffect(() => {
    totalCount = totalOrders.length;
  }, [totalOrders]);
  // useEffect(() => {
  //   if (isOrderRecieved) {
  //     if (enableSound) newOrderSound.pause().play()
  //   }
  // }, [isOrderRecieved])
  const ring = (loop) => {
    if (enableSound) {
      if (loop) alertOrderSound.pause().play();
      else newOrderSound.pause().play();
    }
  };
  useEffect(() => {
    return () => {
      alertOrderSound.stop();
      newOrderSound.stop();
    };
  }, []);

  useEffect(() => {
    const sse = new EventSource(
      `https://zapio-admin.com/api/pos/ordernotification/stream/seen/?Authorization=${
        getAuthUser().token
      }`
    );
    function getRealtimeData(data) {
      console.log("🚀 ~ file: index.js:128 ~ getRealtimeData ~ data", data);
      // process the data here,
      // then pass it to state to be rendered
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      // error log here

      sse.close();
    };
    return () => {
      sse.close();
    };
  }, []);

  return (
    <FullScreenWrapper className="home">
      <Grid style={{ height: "100vh" }} cols={["auto", "1fr"]}>
        <Sidebar />
        <MainPanel setSound={(res) => setSoundEnabled(res)} />
      </Grid>
    </FullScreenWrapper>
  );
}
