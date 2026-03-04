import type { Order } from "@/lib/api/types";

function fmt(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceHTML(order: Order): string {
  const date = new Date(order.created_at);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHTML = order.items
    .map((item) => {
      const rate = item.price;
      const amount = rate * item.quantity;
      const addOnTotal = item.add_ons?.reduce((s, a) => s + a.price, 0) || 0;
      const lineTotal = amount + addOnTotal * item.quantity;

      const row = `<tr>
        <td style="padding:4px 0;border-bottom:1px solid #eee;">
          ${item.product_name}${item.variant ? `<br><span style="font-size:11px;color:#666;">${item.variant}</span>` : ""}
          ${item.add_ons?.length ? `<br><span style="font-size:10px;color:#888;">+ ${item.add_ons.map((a) => a.name).join(", ")}</span>` : ""}
        </td>
        <td style="padding:4px 0;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
        <td style="padding:4px 0;text-align:right;border-bottom:1px solid #eee;">${fmt(rate)}</td>
        <td style="padding:4px 0;text-align:right;border-bottom:1px solid #eee;">${fmt(lineTotal)}</td>
      </tr>`;
      return row;
    })
    .join("");

  // Tax split: assume 50/50 CGST/SGST
  const halfTax = order.total_tax / 2;

  const customerSection =
    order.customer_name || order.customer_phone
      ? `<div style="margin-bottom:10px;font-size:12px;">
          ${order.customer_name ? `<div><strong>Customer:</strong> ${order.customer_name}</div>` : ""}
          ${order.customer_phone ? `<div><strong>Phone:</strong> ${order.customer_phone}</div>` : ""}
          ${order.customer_address ? `<div><strong>Address:</strong> ${order.customer_address}</div>` : ""}
        </div>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice - ${order.order_id}</title></head>
<body style="margin:0;padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;width:300px;">
  <div style="text-align:center;margin-bottom:8px;">
    <div style="font-size:16px;font-weight:bold;">${order.outlet_name || "Restaurant"}</div>
  </div>

  <div style="text-align:center;font-weight:bold;font-size:14px;border-top:1px solid #000;border-bottom:1px solid #000;padding:4px 0;margin-bottom:8px;">
    TAX INVOICE
  </div>

  <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
    <span><strong>Order:</strong> #${order.order_id}</span>
    <span>${dateStr} ${timeStr}</span>
  </div>

  ${customerSection}

  <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px;">
    <thead>
      <tr style="border-bottom:2px solid #000;">
        <th style="text-align:left;padding:4px 0;">Item</th>
        <th style="text-align:center;padding:4px 0;">Qty</th>
        <th style="text-align:right;padding:4px 0;">Rate</th>
        <th style="text-align:right;padding:4px 0;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div style="border-top:1px solid #000;padding-top:6px;font-size:12px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
      <span>Subtotal</span><span>${fmt(order.sub_total)}</span>
    </div>
    ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:2px;color:green;"><span>Discount</span><span>-${fmt(order.discount)}</span></div>` : ""}
    ${order.total_tax > 0 ? `
    <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
      <span>CGST</span><span>${fmt(halfTax)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
      <span>SGST</span><span>${fmt(halfTax)}</span>
    </div>` : ""}
    ${order.delivery_charge > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Delivery Charge</span><span>${fmt(order.delivery_charge)}</span></div>` : ""}
    ${order.packing_charge > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Packing Charge</span><span>${fmt(order.packing_charge)}</span></div>` : ""}
  </div>

  <div style="border-top:2px solid #000;padding-top:6px;margin-top:4px;display:flex;justify-content:space-between;font-size:15px;font-weight:bold;">
    <span>Grand Total</span><span>${fmt(order.order_amount)}</span>
  </div>

  <div style="margin-top:6px;font-size:11px;color:#555;">
    <strong>Payment:</strong> ${order.payment_mode || "N/A"}
  </div>

  <div style="text-align:center;margin-top:12px;border-top:1px dashed #000;padding-top:8px;font-size:12px;">
    Thank you for your order!
  </div>
</body>
</html>`;
}
