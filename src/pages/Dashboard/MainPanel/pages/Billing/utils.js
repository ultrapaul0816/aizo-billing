import moment from "moment";

const modifyCart = (cart) => {
  console.log("printable cart info", cart);
  const newCart = [];
  for (let c of cart) {
    const ags = [...new Set(c?.add_ons?.map((v) => v.add_on_group_name))];
    newCart.push({
      ...c,
      add_ons: ags.map((ag) => ({
        add_on_group_name: ag,
        add_ons: c.add_ons.filter((a) => a.add_on_group_name === ag),
      })),
    });
  }
  return newCart;
};
export const printBill = (data) => {
  const { currency } = JSON.parse(localStorage.getItem("user"));
  const newCart = modifyCart(data.cart);
  let source = "";
  if (data.bill == "billing") {
    let resource = data.resourceDetail;
    source = resource.filter(function (resource) {
      return resource.id === data.source;
    });
  }
  return `
<!DOCTYPE html>
<head>
  <style>
    p {
      padding: 0px;
      margin: 0px;
    }
  </style>
</head>

<body>
  <div
    style="display: flex; flex-direction: column;align-items: center;justify-content: center;width: 100%;font-family:sans-serif">
    <div
      style="display: flex;flex-direction: column;align-items:center;justify-content:center;margin-top: 10px;margin-bottom:10px">
     ${
       data.configuration.company_logo
         ? `<img style="width:50%" src="${data.configuration.company_logo}" />`
         : `<h4>No Logo</h4>`
     }
      <!-- <span style="margin: 10px;"></span> -->
      <ul style="padding: 0;margin: 0;text-align: center;">
      <li style="list-style: none;margin: 0;padding: 15;font-size:1rem">
     <b> ${data?.receiptData?.header || ""}</b>
    </li>
        <li style="list-style: none;margin: 0;padding: 0;font-size:1rem">
          ${data.outlet || ""}
        </li>
        <li style="list-style: none;margin: 0;padding: 0;">
        ${
          data?.receiptData?.gst?.length
            ? `<b>GSTIN: </b>${data?.receiptData?.gst}`
            : ""
        }
        </li>
        <li style="list-style: none;margin: 0;padding: 0;">
          
        </li>
      </ul>
    </div>
    <div style="width:100%;border-top:2px dotted #000;margin-top:10px;">
      <div style="text-align:center;padding:10px 0;">
          <b>${data.configuration.address}</b> 
      </div>
      <div style="border-top:2px dotted #000;padding:10px 0;">
          <b>Staff Temperature: </b><br>
         ${
           data.configuration.temp_detail?.length
             ? ` <ul style="list-style-type:none;padding:0;margin:0">
             <li style="display:flex;flex-direction:row;font-weight:bold"> 
                <div style="flex:1" >Staff</div>
                <div style="flex:1">Temperature</div> 
             </li>
          ${data.configuration.temp_detail
            .map(
              (t) =>
                `<li style="display:flex;flex-direction:row;">
                    <div style="flex:1">${t.name}</div>
                    <div style="flex:1">${t?.temp}°F</div>
                 </li>`
            )
            .join("")}
          </ul>`
             : "<i>No temperature recoded today</i>"
         }
      </div>
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span><b>${data.invoice ?? ""}</b></span>
      <span><b>Date: </b>${
        data.orderTime ? moment(data.orderTime).format("DD/MM/YYYY h:m A") : ""
      }</span>


      <span><b>Source: </b>${
        data.bill == "billing" && source ? source[0].label : data.source
      }</span>
      <span><b>Payment Mode: </b>${data.paymentMode || ""}</span>
      <span><b>Delivery Instructions: </b>${
        data.delivery_instructions || ""
      }</span>

    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span>Customer Name:</span>
      <span><b>${data.customer ? data.customer.name : "<i>N/A</i>"}</b></span>
      <span>Contact Number:</span>
      <span><b>${data.customer ? data.customer.mobile : "<i>N/A</i>"}</b></span>
      <span>Address:</span>
      <span><b>${
        data.customer
          ? data.customer.address + data.customer.locality
          : "<i>Not Specified</i>"
      }</b></span>
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 3fr 1fr; grid-template-rows: 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span><b>QTY</b></span>
      <span><b>ITEM</b></span>
      <span><b>AMOUNT</b></span>
    </div>
    <div
      style="display: grid;grid-row-gap: 5px; grid-template-columns: 1fr 5fr 1fr;grid-template-rows: 1fr 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      ${newCart
        .map(
          (v) =>
            `<span style="margin-right:5px"><b>${v.quantity}</b></span>
      <div style=" padding-bottom: 4px;">
        <div>
          <b>${v.name}</b>
        </div>
        
       ${
         v.varients !== "N/A"
           ? ` <div>
          <p>
            Variant:
            <b>${v.varients || v.size || v.Variant_name || ""}</b>
          </p>
        </div>`
           : ""
       }
        <div style="padding-bottom:10px">
        ${
          v.add_ons
            ? v.add_ons
                .map(
                  (ag) =>
                    `<p style="margin-top: 5px;">
                        <b style="font-size:0.5rem" >${
                          ag.add_on_group_name ?? ag.title ?? ""
                        }:</b>
                    <span>${
                      ag.add_ons
                        ? ag.add_ons.map((a) => `${a.addon_name ?? a.title}`)
                        : ""
                    }</span>
                    </p>`
                )
                .join("")
            : ""
        }
        </div>
      </div>
      <span>${currency + " " + v.price?.toFixed(2)}</span>`
        )
        .join("")}
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span><b>Sub Total</b></span>
      <span style="text-align: right;"><b>${
        currency + " " + data.total.subTotal?.toFixed(2)
      }</b></span>
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span><b>Discount</b></span>
      <span style="text-align: right;"><b>-${
        currency + " " + data.total.dis?.toFixed(2)
      }</b></span>
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;border-top:2px dotted #000;padding:10px 0; width: 100%;">
      <span><b>Taxes</b></span>
      <span style="text-align: right;"><b>${
        currency + " " + data.total.tax
      }</b></span>
      ${data.taxDetail
        .map(
          (t) =>
            `<span>${t.tax_name} @ ${t.tax_percent}%</span>
      <span style="text-align: right;">${currency} ${
              data.bill == "billing"
                ? (data.total?.[t.tax_name] ?? 0)?.toFixed(2)
                : t.tax_value?.toFixed(2)
            }</span>`
        )
        .join("")}
      
      <span>Delivery Charges</span>
      <span style="text-align: right;">${
        currency + " " + data.total.dc?.toFixed(2)
      }</span>
      <span>Packaging Charges</span>
      <span style="text-align: right;">${
        currency + " " + data.total.pc?.toFixed(2)
      }</span>
      <!-- <span>Total Charges/Taxes</span>
      <span style="text-align: right;">${
        currency + " " + data.total.tax?.toFixed(2)
      }</span>--->
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr;border-top:2px dotted #000;border-bottom:2px dotted #000; padding:10px 0; width: 100%;">
      <span><b>GRAND TOTAL</b></span>
      <span style="text-align: right;"><b>${
        currency + " " + data.total.grandTotal?.toFixed(2)
      }</b></span>
    </div>

    <div
      style="display: grid;grid-template-columns: 1fr; grid-template-rows: 1fr;border-top:0px dotted #000;padding:10px 0; width: 100%;text-align: center; margin-top: 20px;">
      <span>${data?.receiptData?.footer || ""}</span>

    </div>
  </div>

</body>`;
};
export const printKOT = (data) => {
  const newCart = modifyCart(data.cart);

  return `
    <div style = "display: flex; flex-direction: column;align-items: center;justify-content: center;width: 100%;font-family:sans-serif">
    <div style="display: flex;flex-direction: column;align-items:center;justify-content:center;margin-top: 10px;margin-bottom:5px">
      <span style="font-weight: bold;font-size:1rem" >${
        data.configuration.company_name
      }</span>
      <span style="margin: 5px;">${data.outlet}</span>
    </div>
    <div
      style="display: grid;grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;border-top:2px dotted #000;padding:10px 0;"
    >
      <span><b>Invoice#${data.invoice ?? ""}</b></span>
      <span><b>Date:</b>${` ${moment().format("D/MM/YYYY h:mm:ss a")}`}</span>
      <span><b>Table:</b></span>
      <span><b>Server:</b></span>
    </div>
    <div style="border:2px dotted transparent; border-color: transparent transparent #000 transparent; width: 100%;">
      <div style="width: 100%">
        ${newCart
          .map(
            (
              v
            ) => `<div style="font-size:0.6rem;border-top:1px dotted #000;padding-top:10px;padding-bottom:5px;display:grid;grid-template-columns:1fr auto">
          <div style="display:flex;flex-direction:column;font-size:1rem;width:100%;">
          <span style="font-weight:bold">${
            v.name
          }${` | <span style="font-weight:normal">${
              v.varients || v.size
            }</span>`}  
            </span>
            ${
              v.kot_desc
                ? `<span style="font-size:12px" ><b>KOT Description:</b> 
            ${v.kot_desc}
            </span>`
                : ""
            }
          <span style="font-size:0.8rem">
          ${
            v.add_ons
              ? v.add_ons
                  .map(
                    (ag) =>
                      `<p style="padding-top: 2px;">
                      <b>${ag.add_on_group_name ?? ag.title ?? ""}:</b>
                      <span>${
                        ag.add_ons
                          ? ag.add_ons.map((a) => `${a.addon_name ?? a.title}`)
                          : ""
                      }</span>
                      </p>`
                  )
                  .join("")
              : ""
          }
          </span>
          </div>
          <span style="font-weight:bold;margin-left:10px;font-size:1rem"> x ${
            v.quantity
          }</span>
        </div>`
          )
          .join("")}
      </div>
    </div>
    <div style="margin:10px;font-weight:bold;font-size:1rem;text-align:right">Total Items: ${data.cart.reduce(
      (p, v) => p + v.quantity,
      0
    )}
    </div>
    <span style="border-top:2px dotted #000;padding:10px 0;width:100%">${
      data.special_instructions || ""
    }</span>

    <span style="font-size:3rem;font-weight:bold;border-bottom:1px solid #000;display:flex;flex-direction:column;margin:10px;text-align:center" >
      <span style="font-size:11px;font-weight:normal" >Token number</span> ${
        data.tokenNumber || ""
      }
    </span>
      </div >
  `;
};
