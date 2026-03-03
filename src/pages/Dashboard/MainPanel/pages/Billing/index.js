import React, { useEffect, useState } from "react";
import { Div } from "../../../../../components/Elements";
import {
  OutletManagementAPI,
  OrderManagementAPI,
  TemperatureAPI,
} from "../../../../../api";
import { Grid } from "../../../../../components/Layout";
import {
  Icon,
  Text,
  Button,
  Tag,
  InputGroup,
  ButtonGroup,
  Position,
  Tooltip,
  FormGroup,
  MenuItem,
  Classes,
  NumericInput,
} from "@blueprintjs/core";

import SelectOutletImage from "../../../../../utils/images/select2.png";
import FoodTag from "../../../../../components/FoodTag";
import ProductDialog from "./ProductDialog";
import Notif from "../../../../../components/Notification";
import {
  AddCustomerOverlay,
  DiscountOverlay,
} from "../../../../../components/Popups";
import SettleDialog from "./SettleDialog";
import printJS from "print-js";
import moment from "moment";
import { printKOT, printBill } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "@blueprintjs/select";
import OrderManagement from "../../../../../api/OrderManagement";
import { useIntl } from "react-intl";
import MultiSelectR from "./../../../../../components/MultiSelect";
import PriceAdjustmentDialog from "./PriceAdjustmentDialog";
import ProductCard from "./ProductCard";

// const TAX = 5 * 0.01
let taxTypes = {};
export default function Billing(props) {
  const { currency } = JSON.parse(localStorage.getItem("user"));
  const [outlet, setOutlet] = useState({});
  const [total, setTotal] = useState({
    subTotal: 0,
    dis: 0,
    cd: 0,
    pc: 0,
    dc: 0,
    tax: 0,
    grandTotal: 0,
    tv: 0,
  });

  const [categories, setCategories] = useState([]);
  const [existingOrderInfo, setExistingOrderInfo] = useState();
  const [activeItem, setActiveItem] = useState({
    activeCatState: null,
    product: 0,
  });
  const [products, setProducts] = useState({ actual: {}, filtered: {} });
  const [cart, setcart] = useState([]);
  const [receivedConfig, setReceivedConfig] = useState([]);
  const [receiptConfig, setReceiptConfig] = useState([]);
  const [Coupon, setCoupon] = useState(null);

  const [openDialog, setOpenDialog] = useState({
    customization: false,
    customer: false,
    details: false,
    discount: false,
    settle: false,
    priceAdjustment: false, // for adjusting zomato swiggy total value
  });
  const [load, setLoad] = useState([]);
  const [loader, setLoader] = useState({ sync: false, place: false });
  const [orderDetails, setOrderDetails] = useState({
    order_type: "Delivery",
    order_source: "",
    order_source_label: "",
  });

  const tokenNumber = useSelector((state) => state.orders.length + 1);
  let company_id = useSelector((state) => state.Company.company_id);
  const [taxDetail, setTaxDetail] = useState([]);
  const [cd, setcd] = useState(0);
  const [invalidTotal, setinvalidTotal] = useState(false);
  const [prodFilter, setProdFilter] = useState({
    food_type: [],
    allergen_information: [],
    spicy: [],
    tags: [],
  });
  const { order_punch, product_toggle } = useSelector(
    (state) => state.permissions
  );
  const { orderSource } = useSelector((state) => state.Config);
  const [filterValues, setFilterValues] = useState({});
  const [charges, setCharges] = useState();

  // console.log({ order_punch, product_toggle })
  let billingRef = null;
  // useEffect(() => () => alert('This will reset the cart!'), [])

  useEffect(() => {
    const {
      outlet: newOutlet,
      customer,
      existingOrder,
      order_source,
      order_source_label,
    } = props.history.location.state || {};
    // if (order_source)
    //   setOrderDetails((prev) => ({ ...prev, order_source: order_source }));
    if (order_source) {
      setOrderDetails((prev) => ({
        ...prev,
        order_source: order_source,
        order_source_label: order_source_label,
        // order_type: order_type,
      }));
    }
    // if (!newOutlet.is_open) setOutlet(newOutlet)
    if (customer) setOrderDetails((prev) => ({ ...prev, customer: customer }));

    if (newOutlet && newOutlet.id != outlet.id && !!billingRef) {
      billingRef.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100 });
      setLoader((l) => ({ ...l, sync: false }));
      refreshOutlet();
    }
    if (existingOrder) {
      setExistingOrderInfo(existingOrder);
      setcart(existingOrder.order_description);
    } else {
      setExistingOrderInfo("");
    }
  }, [props]);

  const intl = useIntl();
  const calculateTotal = (price_adjustment_discount) => {
    if (cart.length) {
      const sTotal = cart.reduce((p, n) => p + n.price * n.quantity, 0);
      console.log(price_adjustment_discount);
      let totalDiscount =
        price_adjustment_discount ||
        cart.reduce(
          (p, n) =>
            n.discount_amount ? p + n.discount_amount * n.quantity : p,
          0
        );
      console.log(sTotal);
      console.log("TOTAL DISCOUNT", totalDiscount, cart);
      console.log("CD value", cd);
      console.log("tacx details", taxDetail);
      if (cd > 0) {
        totalDiscount = cd + totalDiscount;
      }
      const finalStatotal =
        (price_adjustment_discount && sTotal) || sTotal - totalDiscount;
      taxTypes = {};
      cart.forEach((c) => {
        // console.log("cart", c);
        c.tax_detail.forEach((t) => {
          const taxId = t.id,
            price = cd > 0 ? c.price - cd : c.price - (c.discount_amount ?? 0);
          taxTypes[taxId] =
            (taxTypes[taxId] ?? 0) + price * c.quantity * t.tax_percent * 0.01;
        });
      });
      const totalTax = Object.values(taxTypes).reduce((p, c) => p + c, 0);
      //Calculate delivery & Packing charge
      let deliveryCharge = 0;
      let PackagingCharge = 0;

      if (charges && charges.price_type === "Fixed Price") {
        if (charges.is_tax) {
          const cTax = charges.tax.reduce((prev, curr) => {
            return prev + curr.percentage;
          }, 0);
          deliveryCharge =
            charges.delivery_charge + (cTax / 100) * charges.delivery_charge;
          PackagingCharge =
            charges.packing_charge + (cTax / 100) * charges.packing_charge;
        } else {
          deliveryCharge = charges.delivery_charge;
          PackagingCharge = charges.packing_charge;
        }
      } else if (charges && charges.price_type === "Percentage Price") {
        if (charges.is_tax) {
          const cTax = charges.tax.reduce((prev, curr) => {
            return prev + curr.percentage;
          }, 0);
          deliveryCharge = finalStatotal * (charges.delivery_charge / 100);
          deliveryCharge = deliveryCharge + (deliveryCharge / 100) * cTax;
          PackagingCharge = finalStatotal * (charges.packing_charge / 100);
          PackagingCharge = PackagingCharge + (PackagingCharge / 100) * cTax;
        } else {
          deliveryCharge = (charges.delivery_charge / 100) * finalStatotal;
          PackagingCharge = (charges.packing_charge / 100) * finalStatotal;
        }
      }
      let deliveryChargeActual =
        orderDetails.order_source_label !== "Counter" ? deliveryCharge : 0;
      setTotal((tt) => ({
        ...tt,
        ...taxTypes,
        dis: totalDiscount.toFixed(2),
        cd: cd > 0 ? cd : 0,
        tv: (sTotal - totalDiscount).toFixed(2),
        subTotal: sTotal.toFixed(2),
        tax: totalTax.toFixed(2),
        dc: deliveryChargeActual,
        pc: PackagingCharge,
        grandTotal: (
          sTotal -
          totalDiscount +
          totalTax +
          deliveryChargeActual +
          PackagingCharge
        ).toFixed(2),
      }));
    } else {
      taxTypes = {};
      setTotal({
        subTotal: 0,
        dc: 0,
        cd: 0,
        pc: 0,
        dis: 0,
        tax: 0,
        grandTotal: 0,
        tv: 0,
      });
    }
  };
  useEffect(() => {
    calculateTotal();
  }, [cart, charges]);

  useEffect(() => {
    if (total.grandTotal) {
      if (Math.sign(total.grandTotal) === -1) {
        setinvalidTotal(true);
        Notif.error(
          "Please use diffrent Discount or coupon, Invalid Total value "
        );
      } else {
        setinvalidTotal(false);
      }
    }
  }, [total]);

  // useEffect(() => {
  //   console.log(total.dis)
  //   calculateTotal()
  // }, [total.dis])

  const handleText = (key, value) => {
    setOrderDetails((od) => ({
      ...od,
      [key]: value,
    }));
  };

  const saveToLocalStorage = (id, dd) => {
    // if (outlet.id) {
    const oldData = JSON.parse(localStorage.getItem("outlet_menu"));
    localStorage.setItem(
      "outlet_menu",
      JSON.stringify(oldData ? { ...oldData, [id]: dd } : { [id]: dd })
    );
    // }
  };

  const setProductQuantity = (n, p) => {
    if (n == -1 && p.quantity == 1) return;
    setcart(
      cart.map((c) => {
        if (c.cartId === p.cartId) {
          c.quantity = c.quantity + n;
        }
        return c;
      })
    );
  };

  useEffect(() => {
    OutletManagementAPI.getTax({ status: true }).then((res) => {
      if (res && res.success) {
        setTaxDetail(res.data);
      }
    });
    OutletManagementAPI.getCharges().then((res) => {
      if (res) {
        setCharges(res[0]);
      }
    });
    OutletManagementAPI.getFilterLabels().then((res) =>
      setFilterValues(res[0])
    );
  }, []);

  useEffect(() => {
    if (orderSource.length && !props.history.location.state?.order_source) {
      setOrderDetails({
        ...orderDetails,
        order_source: orderSource[0].id,
        order_source_label: orderSource[0].source_name,
      });
    }
  }, [orderSource]);

  const resetAll = () => {
    setActiveItem({ activeCatState: null, product: 0 });
    setCategories([]);
    setProducts({ actual: {}, filtered: {} });
    // setFilteredProducts([])
    setcart([]);
  };

  const refreshMenu = ({ id }) => {
    //fetch categories
    setLoader((l) => ({ ...l, sync: true }));
    OutletManagementAPI.listCategories({ outlet: id }).then((res) => {
      if (res && res.length) {
        const sortedCat = res.sort((a, b) => a.priority - b.priority);
        const updatedCat = [
          {
            id: "0",
            category_name: "All Categories",
            category_code: "all - 0",
            priority: 0,
            is_available: true,
          },
          ...sortedCat,
        ];
        console.log("sortedCat", updatedCat);
        OutletManagementAPI.listProducts({ outlet: id }).then((p) => {
          console.log("Product", res, p);
          if (p) {
            const l = {};
            setCategories(updatedCat);
            // if (!!!activeItem.activeCatState)
            setActiveItem((ai) => ({ ...ai, activeCatState: res[0] }));

            updatedCat.forEach((c) => {
              if (c.id === "0") {
                l[c.id] = [];
              } else {
                l[c.id] = p.filter((v) => {
                  if (v && v.category_id) {
                    let cat_id = v.category_id;
                    let cid = c.id.toString();
                    return cat_id.indexOf(cid) !== -1;
                  }
                });
              }
            });
            // setFilteredProducts(l)
            setProducts({ filtered: l, actual: l });
            saveToLocalStorage(id, { c: updatedCat, p: l });
            setLoader((l) => ({ ...l, sync: false }));
            Notif.success("Menu Synced successfully!", 2000);
          } else {
            setLoader((l) => ({ ...l, sync: false }));
            Notif.error("Cannot sync menu now!");
          }
        });
      } else {
        setLoader((l) => ({ ...l, sync: false }));
      }
    });
  };

  const placeOrder = (settlement_details, kot_print, bill_print) => {
    if (!!!orderDetails.customer) {
      Notif.error("Customer details are mandatory!");
      setOpenDialog((op) => ({ ...op, customer: true }));
      return;
    }
    setLoader((l) => ({ ...l, place: true }));
    const {
      name,
      email,
      mobile,
      locality,
      address,
      address_type,
      city,
      order_id,
    } = orderDetails?.customer;
    const newCart = [];
    for (let o of cart) {
      delete o.category;
      delete o.cartId;
      newCart.push(o);
    }
    const updatedTaxVal = [];
    Object.entries(taxTypes).forEach(([key, value]) => {
      updatedTaxVal.push({ id: key, tax_amount: value });
    });
    const p = {
      customer: { name, mobile, email, order_id },
      address1: [
        {
          locality: locality?.id ? locality.id : locality,
          city: city?.id ? city.id : city,
          address,
          address_type,
        },
      ],
      order_description: newCart,
      order_time: moment().toDate().toISOString(),
      // company_id: '1',
      taxes: total.tax,
      sub_total: total.subTotal,
      cart_discount: total.dis,
      Delivery_Charge: total.dc,
      Packing_Charge: total.pc,
      Order_Type: orderDetails.order_type,
      Payment_source: "",
      Order_Source: orderDetails.order_source ? orderDetails.order_source : "",
      delivery_instructions: orderDetails.delivery_instructions || "",
      special_instructions: orderDetails.special_instructions || "",
      outlet_id: outlet.id,
      settlement_details: settlement_details || [],
      discount_name: orderDetails?.discount_name ?? null,
      tax_detail: updatedTaxVal,
      discount_reason: orderDetails?.reason ?? null,
      total_bill_value: total.grandTotal,
      ...(existingOrderInfo && { order_id: existingOrderInfo.id }),
    };
    console.log("payload", p, total, updatedTaxVal);
    if (existingOrderInfo) {
      OrderManagementAPI.postEditedOrder(p).then((res) => {
        setLoader((l) => ({ ...l, place: false }));
        if (res.success) {
          // setOpenDialog((op) => ({ ...op, settle: false }));
          Notif.success("Order placed successfully!");
          props.history.push("/home/");
        } else {
          if (res && res.error && res.error.payment_detail)
            Notif.error(res.error.payment_detail);
          else Notif.error("An error occured while placing the order!");
        }
      });
    }
    if (p.Order_Source && !existingOrderInfo) {
      OrderManagementAPI.placeOrder(p).then((res) => {
        console.log("orderssssssssssss", res);
        setLoader((l) => ({ ...l, place: false }));
        if (res.success) {
          const orderInfo = res.data[0];
          if (bill_print) billPrint(orderInfo);
          if (kot_print) kotPrint(orderInfo);
          setOpenDialog((op) => ({ ...op, settle: false }));
          Notif.success("Order placed successfully!");
          props.history.push("/home/");
        } else {
          if (res && res.error && res.error.payment_detail)
            Notif.error(res.error.payment_detail);
          else Notif.error("An error occured while placing the order!");
        }
      });
    }
    // else {
    //   setLoader((l) => ({ ...l, place: false }));
    //   Notif.error("Please select order source!");
    // }
  };

  const refreshOutlet = () => {
    resetAll();
    const newOutlet = props.history.location.state.outlet || {};
    if (!getDataFromStorage(newOutlet.id)) refreshMenu(newOutlet);
    setOutlet(newOutlet);
  };

  const getDataFromStorage = (id) => {
    if (localStorage) {
      const d = JSON.parse(localStorage.getItem("outlet_menu"));
      if (d && d[id]) {
        setCategories(d[id].c.sort((a, b) => a.priority - b.priority));
        setActiveItem((ai) => ({ ...ai, activeCatState: d[id].c[0] }));
        // setFilteredProducts(d[id].p)
        setProducts({ actual: d[id].p, filtered: d[id].p });
      }
      return d ? !!d[id] : false;
    }
  };
  const conditionalIterate = (c, p, dd) => {
    // let discountAmount = 0
    let flag = false;

    const calculateDiscount = (item) => {
      flag = true;
      if (dd.flat_discount !== "0") {
        if (item.quantity > 1) {
          item.discount_amount = dd.flat_discount / cart.length / item.quantity;
        } else {
          item.discount_amount = dd.flat_discount / cart.length;
        }
      } else {
        item.discount_amount = item.price * dd.flat_percentage * 0.01;
      }
      return item;
    };

    // For single product wise discount
    const ProductWiseDiscount = (item) => {
      flag = true;
      if (dd.flat_discount !== "0") {
        item.discount_amount = dd.flat_discount;
      } else {
        item.discount_amount = item.price * dd.flat_percentage * 0.01;
      }

      return item;
    };

    const newCart = cart.map((item) => {
      let newItem = item;

      if (c)
        dd.category_detail.forEach((cd) => {
          // console.log("qqqqqqqqqqqqqq", cd.id, item.category.id);
          if (
            cd.id === parseInt(item.category.id) ||
            cd.id === item.category.id
          ) {
            if (p)
              dd.product_detail.forEach((pr) => {
                if (pr.id == item.id) {
                  newItem = calculateDiscount(item);
                }
              });
            else newItem = calculateDiscount(item);
          }
        });
      else if (p)
        dd.product_detail.forEach((pr) => {
          if (pr.id == item.id) {
            newItem = ProductWiseDiscount(item);
          }
        });
      else newItem = calculateDiscount(item);
      return newItem;
    });

    setcart(newCart);
    if (flag) {
      setOrderDetails((st) => ({
        ...st,
        discount_name: dd.discount_name,
        reason: dd.reason_given,
      }));
      Notif.success("Discount applied successfully");
    } else Notif.error("Discount cannot be applied! Items not present");
  };
  const applyDiscount = (discountData) => {
    console.log("TOTAL SUBTOTAL: ", total.subTotal);
    if (discountData && discountData.id) {
      if (discountData.min_shoping > 0 && discountData.max_shoping > 0) {
        // Check for the cart value if it is between these
        if (cart.length) {
          if (
            total.subTotal > discountData.min_shoping &&
            total.subTotal < discountData.max_shoping
          ) {
            conditionalIterate(
              !!discountData.category_detail.length,
              !!discountData.product_detail.length,
              discountData
            );
          } else {
            cart.length &&
              cart.map((item) => {
                item.discount_amount = 0;
              });
            setOrderDetails((st) => ({
              ...st,
              discount_name: "",
              reason: "",
            }));
            calculateTotal();
            Notif.error(
              `Cart value must be between ${discountData.min_shoping} & ${discountData.max_shoping} `
            );
          }
        } else {
          Notif.error("Cart is empty!");
        }
      } else if (
        discountData.min_shoping > 0 &&
        discountData.max_shoping === 0
      ) {
        if (cart.length) {
          if (total.subTotal > discountData.min_shoping) {
            conditionalIterate(
              !!discountData.category_detail.length,
              !!discountData.product_detail.length,
              discountData
            );
          } else {
            cart.length &&
              cart.map((item) => {
                item.discount_amount = 0;
              });
            setOrderDetails((st) => ({
              ...st,
              discount_name: "",
              reason: "",
            }));
            calculateTotal();
            Notif.error(
              `Cart value must be greater than ${discountData.min_shoping}`
            );
          }
        } else {
          Notif.error("Cart is empty!");
        }
      } else if (
        discountData.min_shoping === 0 &&
        discountData.max_shoping > 0
      ) {
        if (cart.length) {
          if (total.subTotal < discountData.max_shoping) {
            conditionalIterate(
              !!discountData.category_detail.length,
              !!discountData.product_detail.length,
              discountData
            );
          } else {
            cart.length &&
              cart.map((item) => {
                item.discount_amount = 0;
              });
            setOrderDetails((st) => ({
              ...st,
              discount_name: "",
              reason: "",
            }));
            calculateTotal();
            Notif.error(
              `Cart value must be less than ${discountData.max_shoping}`
            );
          }
        } else {
          Notif.error(`cart is empty`);
        }
      } else if (
        discountData.min_shoping === 0 &&
        discountData.max_shoping === 0
      ) {
        cart.length
          ? conditionalIterate(
              !!discountData.category_detail.length,
              !!discountData.product_detail.length,
              discountData
            )
          : Notif.error("Cart is empty!");
      }
    } else {
      cart.length &&
        cart.map((item) => {
          item.discount_amount = 0;
        });
      setOrderDetails((st) => ({
        ...st,
        discount_name: "",
        reason: "",
      }));
      calculateTotal();
      Notif.error("Discount is removed!");
    }
  };
  const toggleProductAvailability = (is_aggregator, p, e) => {
    setLoad([...load, p.id]);
    OutletManagementAPI.toogleProductAvailability({
      is_available: e.target.checked,
      id: p.id,
      outlet: outlet.id,
      is_aggregator,
    }).then(() => {
      const fl = {
          ...products.actual,
          [activeItem.activeCatState.id]: products.actual[
            activeItem.activeCatState.id
          ].map((v) => {
            if (v.id === p.id) {
              if (is_aggregator)
                v.urban_detail.is_available = !v.urban_detail.is_available;
              else v.is_available = !v.is_available;
            }
            return v;
          }),
        },
        loc = JSON.parse(localStorage.getItem("outlet_menu"));
      setLoad(load.filter((l) => l.id !== p.id));
      localStorage.setItem(
        "outlet_menu",
        JSON.stringify({
          ...loc,
          [outlet.id]: { ...loc[outlet.id], p: fl },
        })
      );
      // setFilteredProducts(fl)
      setProducts({ actual: fl, filtered: fl });
    });
  };

  useEffect(() => {
    const filter = {};
    Object.keys(prodFilter).map((key) => {
      if (prodFilter[key] && prodFilter[key].length) {
        filter[key] = prodFilter[key].map((obj) => obj.label);
      }
    });
    // console.log(filter);
    if (
      prodFilter.food_type.length ||
      prodFilter.allergen_information.length ||
      prodFilter.spicy.length ||
      prodFilter.tags.length
    ) {
      const prod = {};
      // const allProducts = { ...products.actual };
      Object.keys(products.actual).forEach((key) => {
        prod[key] = products.actual[key].filter((obj) =>
          Object.entries(filter).every(([prop, filterValues]) => {
            if (Array.isArray(obj[prop])) {
              for (let filterString of filterValues)
                if (obj[prop].includes(filterString)) return true;
              return false;
            }
            return filterValues.includes(obj[prop]);
          })
        );
      });

      // console.log(prod);
      setProducts((prev) => ({ ...prev, filtered: prod }));
    } else {
      setProducts((prev) => ({ ...prev, filtered: prev.actual }));
    }
  }, [prodFilter]);

  useEffect(() => {
    if (cd > 0) {
      calculateTotal();
    }
  }, [cd]);

  const ApplyCoupon = () => {
    if (cart.length) {
      const { id } = outlet;
      const { tax } = total;
      if (!company_id) {
        company_id = localStorage.getItem("company");
      }
      console.log(company_id);

      const products = cart.map((item) => {
        let newitem = { ...item, product_id: parseInt(item.id) };
        delete newitem.id;
        return newitem;
      });

      const data = {
        coupon_code: Coupon,
        outlet: id,
        tax: tax,
        company: company_id,
        cart: [...products],
      };
      // console.log(data);
      OrderManagementAPI.getCouponData({ ...data }).then((res) => {
        if (res.status) {
          setcd(parseInt(res.Discount_value));
          // setTotal({ ...total, tax: Number(res.Tax) });
        } else {
          Notif.error(res.message);
        }
      });
    } else {
      Notif.error("Cart is empty cannot apply coupon");
    }
  };

  useEffect(() => {
    if (outlet.id) {
      OrderManagement.getReceivedConfig({ id: outlet.id }).then((r) => {
        if (r.success) {
          setReceiptConfig(r.data[0]);
        }
      });
      TemperatureAPI.getInvoiceData({ id: outlet.id }).then((res) => {
        if (res.success) {
          setReceivedConfig(res.data[0]);
        }
      });
    }
  }, [outlet.id]);

  const searchProd = (e) => {
    const q = e.target.value.toLowerCase();
    let updatedProd = {};
    Object.keys(products.actual).forEach((key) => {
      updatedProd[key] = products.actual[key].filter(
        (pp) =>
          pp.product_name.toLowerCase().includes(q) ||
          pp.sku.toLowerCase().includes(q)
      );
    });
    setProducts((pr) => ({ ...pr, filtered: updatedProd }));
    // console.log("searched", updatedProd);
  };
  // useEffect(() => {
  //   console.log("outlet", outlet);
  // }, [outlet]);
  const billPrint = (data) => {
    console.log("ffffinnalll print", data);
    if (orderDetails.customer) {
      OrderManagementAPI.setLog({
        event_name: "bill",
        order_id: data.orderid,
      });
      printJS({
        printable: printBill({
          billNumber: "Bill",
          outlet: outlet.Outletname,
          outlet_id: data.outlet_id,
          invoice: data.channel_order_id
            ? `aggregator#${data.channel_order_id}`
            : `Invoice#${data.orderid ? data.orderid : data.order_id}`,
          cart: data.order_description,
          paymentMode: data.Payment_source ? data.Payment_source : "N/A",
          total: {
            subTotal: data.sub_total,
            pc: data.packing_charge,
            dc: data.delivery_charge,
            tax: data.taxes || 0,
            dis: data.cart_discount ? data.cart_discount : data.discount_value,
            grandTotal: data.total_bill_value,
          },
          taxDetail: [],
          bill: "order",
          delivery_instructions: data.delivery_instructions,
          customer: {
            name: data.name,
            email: "",
            mobile: data.mobile,
            address:
              (data.address1 && data.address1[0]?.address) ||
              data.address?.address ||
              (data.address && data.address[0]?.address) ||
              "N/A",
            locality:
              (data.address1 && data.address1[0]?.locality) ||
              data.address1?.locality ||
              (data.address && data.address[0]?.locality) ||
              "",
          },
          source: data.Order_Source ? data.Order_Source : data.order_source,
          configuration: receivedConfig,
          receiptData: data?.receiptConfig,
          orderTime: data.order_time,
        }),
        type: "raw-html",
        documentTitle: "Bill",
        showModal: false,
      });
    } else {
      Notif.error("Please enter customer details first");
      setOpenDialog((prev) => ({ ...prev, customer: true }));
    }
  };

  const kotPrint = (data) => {
    if (orderDetails.customer) {
      OrderManagementAPI.setLog({
        event_name: "kot",
        order_id: data.orderid,
      });
      printJS({
        printable: printKOT({
          outlet: outlet.Outletname,
          invoice: data.orderid,
          cart,
          special_instructions: orderDetails.special_instructions,
          orderTime: orderDetails.order_time,
          tokenNumber,
          configuration: receivedConfig,
        }),
        // properties: ['product_name', 'quantity'],
        type: "raw-html",
        documentTitle: "KOT",
        showModal: false,
      });
    } else {
      Notif.error("Please enter customer details first");
      setOpenDialog((prev) => ({ ...prev, customer: true }));
    }
  };
  const addToCart = (e, p) => {
    e.preventDefault();
    // if (!p.is_available) return
    const g = p.customize_detail.customize_data[0].groups;
    if (g.length === 1 && g[0].products.add_on_groups.length === 0) {
      setcart((c) => [
        ...c,
        {
          id: p.id,
          name: p.product_name,
          cartId: `cart-${p.id}-${new Date().getTime().toString()}`,
          quantity: 1,
          category: activeItem.activeCatState,
          add_ons: [],
          size: "N/A",
          food_type: p.food_type,
          tag: p?.tag,
          price: p.price,
          kot_desc: p?.kot_desc ?? "",
          tax_detail: p.tax_detail.map((t) => ({
            ...t,
            tax_value: (p.price * t.tax_percent * 0.01).toFixed(2),
          })),
        },
      ]);
      return;
    }

    setOpenDialog((d) => ({ ...d, customization: true }));
    setActiveItem((a) => ({ ...a, product: p }));
  };

  const renderAllowed = !!categories.length || loader.sync;
  console.log("uuuuuuuuukkkkkkkkkkk", taxDetail, total);
  return (
    <Div
      className="billing-cont"
      ref={(ref) => {
        if (billingRef) return;
        else billingRef = ref;
      }}
    >
      <Grid
        cols={["auto", "1fr", "25%"]}
        style={{ height: "90vh" }}
        className="b-body"
      >
        <div className="cat-main">
          {renderAllowed && (
            <>
              <div className="cat-cont">
                <div className="cat-head">
                  <Icon iconSize={20} icon="shop" />
                  <Text>{outlet.Outletname}</Text>
                </div>

                {/* PRODUCT CATEGORIES */}

                {categories.length && !loader.sync
                  ? categories
                      .filter((v) => v.length != 0)
                      .map((cat) => (
                        <div
                          className="cat-item"
                          style={
                            !!activeItem.activeCatState &&
                            activeItem.activeCatState.id === cat.id
                              ? {
                                  color: "#000",
                                  background: "rgba(0,0,0,0.03)",
                                  // fontSize:'1rem'
                                }
                              : {}
                          }
                          onClick={() => {
                            setActiveItem((ai) => ({
                              ...ai,
                              activeCatState: cat,
                            }));
                            // setProducts((pr) => ({
                            //   ...pr,
                            //   filtered: pr.filtered,
                            // }));
                          }}
                        >
                          {!!activeItem.activeCatState &&
                            activeItem.activeCatState.id === cat.id && (
                              <span className="icon" />
                            )}
                          {cat.category_name}
                        </div>
                      ))
                  : new Array(10).fill("").map((_, i) => (
                      <div
                        className={Classes.SKELETON}
                        style={{
                          height: "20px",
                          margin: "10px",
                          width: "200px",
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
        <div className="pr-main">
          {!renderAllowed && (
            <div className="pr-mask">
              <img src={SelectOutletImage} alt="selected outlet" />
              {outlet && outlet.id
                ? "Not an attach any categories or product !!"
                : "Please Select an outlet and start billing"}
            </div>
          )}

          {renderAllowed && (
            <>
              <div className="pr-head">
                {/* <FaBoxes style={{ marginRight: '10px' }} /> */}
                <InputGroup
                  style={{ width: "90%" }}
                  // disabled={products && !!!products.length || !outlet.is_open}
                  large
                  placeholder={intl.formatMessage({
                    id: "Search Products or Tags",
                  })}
                  leftIcon="search"
                  className="searchbar"
                  onChange={searchProd}
                />
                <div className="head-right">
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    {/* FOOD TYPE FILTER */}

                    <MultiSelectR
                      overrideStrings={{
                        selectSomeItems: "Type",
                      }}
                      options={[
                        { label: "Vegetarian", value: "vegetarian" },
                        { label: "Non Vegetarian", value: "non vegetarian" },
                        { label: "Seafood", value: "Seafood" },
                        { label: "Eggetarian", value: "Eggetarian" },
                      ]}
                      value={prodFilter.food_type}
                      onChange={(e) =>
                        setProdFilter({ ...prodFilter, food_type: e })
                      }
                    />
                    <MultiSelectR
                      overrideStrings={{
                        selectSomeItems: "Spice",
                      }}
                      options={filterValues.spice || []}
                      value={prodFilter.spicy}
                      onChange={(e) =>
                        setProdFilter({
                          ...prodFilter,
                          spicy: e,
                        })
                      }
                    />
                    <MultiSelectR
                      overrideStrings={{
                        selectSomeItems: "Allergen",
                      }}
                      options={filterValues.allergen || []}
                      value={prodFilter.allergen_information}
                      onChange={(e) =>
                        setProdFilter({
                          ...prodFilter,
                          allergen_information: e,
                        })
                      }
                    />
                    <MultiSelectR
                      overrideStrings={{
                        selectSomeItems: "Tags",
                      }}
                      options={
                        filterValues?.tag?.map((item) => {
                          return { label: item.tag_name, value: item.tag_name };
                        }) || []
                      }
                      value={prodFilter.tags}
                      onChange={(e) =>
                        setProdFilter({
                          ...prodFilter,
                          tags: e,
                        })
                      }
                    />
                  </div>

                  <div className="open">
                    <Tooltip content="Sync Menu">
                      <Button
                        intent="primary"
                        loading={loader.sync}
                        onClick={() => {
                          refreshMenu(outlet);
                        }}
                        minimal
                        large
                        className="pr-action"
                        // text='Sync Menu'
                        icon="refresh"
                      />
                    </Tooltip>
                  </div>
                  <div className="open">
                    <Tooltip content="Customer details">
                      <Button
                        intent="primary"
                        onClick={() => {
                          setOpenDialog((d) => ({ ...d, customer: true }));
                        }}
                        className="pr-action"
                        minimal
                        large
                        // text='Customer Details'
                        icon="person"
                      />
                    </Tooltip>
                  </div>

                  <div className="ot-dd">
                    <Select
                      activeItem={orderDetails.order_source_label}
                      filterable={false}
                      popoverProps={{
                        minimal: true,
                        position: Position.BOTTOM_LEFT,
                      }}
                      items={
                        orderSource &&
                        orderSource.map((ob) => {
                          return {
                            id: ob.id,
                            label: ob.source_name,
                            image: ob.image,
                          };
                        })
                      }
                      // items={[]}
                      onItemSelect={(item) => {
                        setOrderDetails((od) => ({
                          ...od,
                          order_source: item.id,
                          order_source_label: item.label,
                        }));
                        // calculateTotal()
                        // setTotal((to) => ({
                        //   ...to,
                        //   dc: item.id == 6 && 0,
                        // }));
                      }}
                      itemRenderer={(props, { handleClick, modifiers }) => (
                        <MenuItem
                          className="drop-with-img"
                          labelElement={<img src={props.image} alt="img" />}
                          key={props.label}
                          onClick={handleClick}
                          active={modifiers.active}
                          disabled={modifiers.disabled}
                          style={{ textTransform: "capitalize" }}
                          text={props.label || " "}
                        />
                      )}
                    >
                      <Button
                        large
                        // minimal
                        icon="desktop"
                        rightIcon="chevron-down"
                        text={
                          orderSource.filter(
                            (ob) => ob.id === orderDetails.order_source
                          )[0]?.source_name || "Source"
                        }
                      />
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeItem.activeCatState ? (
            <Tag
              className="pr-cat"
              large
              minimal
              intent="primary"
              // icon='arrow-right'
            >
              {activeItem.activeCatState.category_name}
            </Tag>
          ) : (
            ""
          )}
          <div className="pr-div">
            <ProductDialog
              isOpen={openDialog.customization}
              data={activeItem.product}
              productCallback={(product) => {
                setcart([
                  ...cart,
                  { ...product, category: activeItem.activeCatState },
                ]);
              }}
              onClose={() => {
                setOpenDialog((d) => ({ ...d, customization: false }));
              }}
            />
            <PriceAdjustmentDialog
              isOpen={openDialog.priceAdjustment}
              callback={calculateTotal}
              charges={charges}
              data={{ ...orderDetails, ...total }}
              onClose={() =>
                setOpenDialog((pr) => ({ ...pr, priceAdjustment: false }))
              }
            />
            <AddCustomerOverlay
              callback={(res) => {
                setOrderDetails((od) => ({ ...od, customer: res }));
              }}
              data={orderDetails.customer}
              orderSource={orderSource}
              orderDetails={orderDetails}
              isOpen={openDialog.customer}
              onClose={() => {
                setOpenDialog((d) => ({ ...d, customer: false }));
              }}
              changeSource={(e) => {
                setOrderDetails((od) => ({
                  ...od,
                  order_source: orderSource.filter(
                    (ob) => ob.source_name === e
                  )[0].id,
                  order_source_label: e,
                }));
              }}
            />
            <DiscountOverlay
              callback={applyDiscount}
              data={outlet}
              isOpen={openDialog.discount}
              onClose={() => {
                setOpenDialog((d) => ({ ...d, discount: false }));
              }}
            />

            {activeItem.activeCatState &&
            activeItem.activeCatState.id !== "0" &&
            products.filtered[activeItem.activeCatState.id] &&
            !loader.sync ? (
              <div className="pr-cont">
                {products.filtered[activeItem.activeCatState.id].map((p) => (
                  <ProductCard
                    p={p}
                    load={load}
                    addToCart={addToCart}
                    currency={currency}
                    product_toggle={product_toggle}
                    toggleProductAvailability={toggleProductAvailability}
                  />
                ))}
              </div>
            ) : activeItem.activeCatState &&
              activeItem.activeCatState.id === "0" &&
              products.filtered[activeItem.activeCatState.id] &&
              !loader.sync ? (
              categories.map((cat) => {
                if (cat.category_name !== "All Categories")
                  return (
                    <>
                      <div className="cat_name">
                        <h4>{cat.category_name}</h4>
                      </div>
                      <div className="pr-cont">
                        {products.filtered[cat.id].map((p) => (
                          <ProductCard
                            p={p}
                            load={load}
                            addToCart={addToCart}
                            currency={currency}
                            product_toggle={product_toggle}
                            toggleProductAvailability={
                              toggleProductAvailability
                            }
                          />
                        ))}
                      </div>
                    </>
                  );
              })
            ) : renderAllowed ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.5rem",
                  padding: "0.5rem",
                }}
              >
                {new Array(5).fill("").map((_, i) => (
                  <div
                    className={Classes.SKELETON}
                    style={{
                      height: "200px",
                      // width: "33%",
                      animationDelay: `${i * 200}ms`,
                      borderRadius: 5,
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {renderAllowed ? (
          <div className="cart-cont">
            <SettleDialog
              data={{
                ...{ outlet_id: outlet?.id },
                price: total.grandTotal,
                source: orderDetails.order_source_label,
              }}
              outlet={outlet}
              orderSource={orderSource}
              isOpen={openDialog.settle}
              load={loader.place}
              onClose={(data) => {
                if (data) {
                  placeOrder(data);
                } else setOpenDialog((d) => ({ ...d, settle: false }));
              }}
            />
            <div className="b-cart">
              <div className="cart-head">
                <Tag minimal large icon="shopping-cart" intent="primary">
                  {cart.length}
                </Tag>
                <FormGroup>
                  <div style={{ display: "flex" }}>
                    <InputGroup
                      large
                      leftIcon="tag"
                      placeholder={intl.formatMessage({ id: "Coupon Code" })}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                      }}
                      style={{ marginRight: "1rem" }}
                    />
                    <Button
                      intent="primary"
                      onClick={() => ApplyCoupon()}
                      disabled={Coupon === null}
                    >
                      <span style={{ color: "#fff" }}>Apply</span>
                    </Button>
                  </div>
                </FormGroup>
              </div>
              <div className="cart-body">
                {cart
                  .map((item) => (
                    <div
                      className="cart-item"
                      // style={
                      //   itemIndex === cart.length - 1
                      //     ? { animation: `popup ${Math.random()*10}s` }
                      //     : {}
                      // }
                    >
                      {!!item.discount_amount && (
                        <span className="cart-item-discount">
                          <Icon iconSize={13} icon="tag" /> Discount applied
                        </span>
                      )}
                      <div className="cart-item-head">
                        <FoodTag
                          back={false}
                          variant="fancy"
                          type={item.food_type === "Vegetarian"}
                          size={0}
                        />
                        {`${item.name} `}
                        {item.size !== "N/A" && (
                          <Tag intent="success" style={{ margin: "5px" }}>
                            {item.size}
                          </Tag>
                        )}
                        <Tag
                          className="cart-item-price"
                          large
                          minimal
                          intent="success"
                        >
                          {currency + " " + item.price}
                        </Tag>
                      </div>
                      <div className="cart-custom">
                        {item.add_ons &&
                          item.add_ons.length > 0 &&
                          item.add_ons.map((k) => <span>{k.addon_name}</span>)}
                      </div>
                      <div className="c-b">
                        <div className="cart-counter">
                          <Button
                            icon="minus"
                            small
                            disabled={item.quantity === 1}
                            intent="danger"
                            minimal
                            onClick={() => {
                              setProductQuantity(-1, item);
                            }}
                          />
                          <span>{item.quantity}</span>
                          <Button
                            minimal
                            icon="plus"
                            intent="primary"
                            onClick={() => setProductQuantity(1, item)}
                          />
                        </div>
                        <Button
                          icon="trash"
                          small
                          minimal
                          intent="danger"
                          className="trash"
                          onClick={() => {
                            console.log(item.price);
                            setTotal((t) => ({
                              ...t,
                              subTotal: t.subTotal - item.price,
                            }));
                            setcart(
                              cart.filter((c) => c.cartId !== item.cartId)
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))
                  .reverse()}
              </div>

              <div className="cart-bottom">
                <div className="cart-instruction">
                  <div>
                    {/* <label>Kitchen instructions</label> */}
                    <InputGroup
                      leftIcon="flag"
                      placeholder={intl.formatMessage({
                        id: "Kitchen instructions",
                      })}
                      onChange={(e) => {
                        handleText("special_instructions", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    {/* <label>Delivery instructions</label> */}
                    <InputGroup
                      leftIcon="known-vehicle"
                      placeholder={intl.formatMessage({
                        id: "Delivery instructions",
                      })}
                      onChange={(e) => {
                        handleText("delivery_instructions", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="cart-total">
                  <span>
                    <span>Subtotal</span>
                    <Tag
                      intent="primary"
                      style={{ fontWeight: "bold" }}
                      minimal
                    >
                      {currency + " " + total.subTotal}
                    </Tag>
                  </span>
                  <span>
                    <span>
                      <Button
                        small
                        icon="tag"
                        text="Discount"
                        intent="primary"
                        disabled={!renderAllowed || cart.length === 0}
                        onClick={() => {
                          // if (cart.length)
                          setOpenDialog((od) => ({ ...od, discount: true }));
                        }}
                      />
                    </span>
                    <span>
                      <Button
                        small
                        icon="tag"
                        text="Price fix"
                        intent="primary"
                        disabled={
                          !renderAllowed ||
                          ![
                            "Zomato",
                            "Swiggy",
                            "Website Order",
                            "Counter",
                            "Phone",
                          ].includes(orderDetails.order_source_label)
                        }
                        onClick={() => {
                          // if (cart.length)
                          setOpenDialog((od) => ({
                            ...od,
                            priceAdjustment: true,
                          }));
                        }}
                      />
                      <Button
                        small
                        style={{ marginLeft: ".5rem" }}
                        text="clear"
                        onClick={() => calculateTotal()}
                      />
                    </span>
                    <Tag
                      intent="primary"
                      style={{ fontWeight: "bold" }}
                      minimal
                    >
                      -{currency + " " + total.dis}
                    </Tag>
                  </span>
                  {/* -------------------Coupon Discount------------------------------- */}

                  <span>
                    <span>Coupon Discount</span>
                    <Tag
                      intent="primary"
                      style={{ fontWeight: "bold" }}
                      minimal
                    >
                      {total.cd}
                    </Tag>
                  </span>
                  {/* -------------------Coupon Discount------------------------------- */}
                  <span>
                    <span>Taxable value</span>
                    <Tag
                      intent="primary"
                      style={{ fontWeight: "bold" }}
                      minimal
                    >
                      {currency + " " + total.tax}
                    </Tag>
                  </span>
                  {taxDetail &&
                    taxDetail.map((data) => (
                      <span>
                        {total?.[data.id] && (
                          <>
                            <span>
                              {data.tax_name} {data.tax_percent}%
                            </span>
                            <Tag
                              intent="primary"
                              style={{ fontWeight: "bold" }}
                              minimal
                            >
                              {/* +₹{(total.tax / 2).toFixed(2)} */}
                              {currency +
                                " " +
                                (total?.[data.id] ?? 0).toFixed(2)}
                            </Tag>
                          </>
                        )}
                      </span>
                    ))}
                  {/* <span>
                      <span>Cess</span>
                      <Tag
                      intent='primary'
                      style={{ fontWeight: 'bold' }}
                      minimal>
                      +₹{(total?.Cess ?? 0).toFixed(2)}
                      </Tag>
                    </span> */}

                  <span style={{ marginBottom: "7px" }}>
                    {/* <Icon icon="person" onClick={() => setIsPackage(true)} /> */}
                    <span>Packaging charges</span>
                    <Tag
                      intent="primary"
                      style={{ fontWeight: "bold" }}
                      minimal
                    >
                      +{currency + " " + total.pc.toFixed(2)}
                    </Tag>

                    <InputGroup
                      small
                      type="number"
                      disabled={charges?.price_type !== "Fixed Price"}
                      style={{ maxWidth: "70px" }}
                      onChange={(e) =>
                        setCharges((pr) => ({
                          ...pr,
                          packing_charge: e.target.valueAsNumber,
                        }))
                      }
                      value={charges?.packing_charge}
                    />

                    {/* {isPackage ? (
                      <input
                      type="number"
                      onChange={(e) => setPackageCharge(e.target.value)}
                      />
                      ) : (
                        <Tag
                        intent="primary"
                        style={{ fontWeight: "bold" }}
                        minimal
                      >
                        +{currency + " " + total.pc.toFixed(2)}
                      </Tag>
                    )} */}
                  </span>
                  {orderDetails &&
                    orderDetails.order_source_label !== "Counter" && (
                      <span>
                        <span>Delivery charges</span>
                        <Tag
                          intent="primary"
                          style={{ fontWeight: "bold" }}
                          minimal
                        >
                          +{currency + " " + total.dc.toFixed(2)}
                        </Tag>
                        <InputGroup
                          small
                          type="number"
                          disabled={charges?.price_type !== "Fixed Price"}
                          style={{ maxWidth: "70px" }}
                          onChange={(e) =>
                            setCharges((pr) => ({
                              ...pr,
                              delivery_charge: e.target.valueAsNumber,
                            }))
                          }
                          value={charges?.delivery_charge}
                        />
                      </span>
                    )}

                  <span>
                    <span>Total</span>
                    <span>
                      {currency + " " + (+total.grandTotal).toFixed(2)}
                    </span>
                  </span>
                </div>
                <hr />
                <div className="bill-print">
                  <ButtonGroup>
                    {order_punch && (
                      <>
                        <Button
                          text="KOT"
                          icon="print"
                          intent="primary"
                          loading={loader.place}
                          disabled={cart.length < 1}
                          onClick={() => placeOrder({}, true, false)}
                        />
                        <Button
                          text="Bill"
                          disabled={cart.length < 1}
                          icon="print"
                          intent="primary"
                          loading={loader.place}
                          onClick={() => placeOrder({}, false, true)}
                        />
                      </>
                    )}
                    <Button
                      disabled={cart.length < 1}
                      text="Settle"
                      large
                      loading={loader.place}
                      // rightIcon='document'
                      intent="primary"
                      onClick={() =>
                        setOpenDialog((d) => ({ ...d, settle: true }))
                      }
                      // style={{ background: '#000', color: '#fff' }}
                    />
                  </ButtonGroup>

                  <Button
                    disabled={cart.length < 1 || invalidTotal}
                    text="Place"
                    rightIcon="arrow-right"
                    intent="success"
                    loading={loader.place}
                    large
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => placeOrder()}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Grid>
    </Div>
  );
}
