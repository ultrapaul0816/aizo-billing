import type { Order } from "@/lib/api/types";

export function generateKOTHTML(order: Order): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHTML = order.items
    .map((item) => {
      let line = `<tr>
        <td style="padding:2px 0;">${item.product_name}${item.variant ? ` (${item.variant})` : ""}</td>
        <td style="padding:2px 0;text-align:right;font-weight:bold;">${item.quantity}</td>
      </tr>`;

      if (item.add_ons?.length) {
        const addOnStr = item.add_ons.map((a) => a.name).join(", ");
        line += `<tr><td colspan="2" style="padding:0 0 4px 12px;font-size:11px;color:#555;">+ ${addOnStr}</td></tr>`;
      }

      return line;
    })
    .join("");

  const specialInstructions = order.special_instructions
    ? `<div style="margin-top:8px;border-top:1px dashed #000;padding-top:6px;">
        <strong>Note:</strong> ${order.special_instructions}
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>KOT - ${order.order_id}</title></head>
<body style="margin:0;padding:8px;font-family:'Courier New',monospace;font-size:13px;width:280px;">
  <div style="text-align:center;font-weight:bold;font-size:15px;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
    KITCHEN ORDER TICKET
  </div>
  <div style="text-align:center;font-size:16px;font-weight:bold;margin-bottom:4px;">
    #${order.order_id}
  </div>
  <div style="text-align:center;font-size:12px;margin-bottom:4px;">
    ${order.outlet_name || ""}
  </div>
  <div style="text-align:center;font-size:11px;color:#555;margin-bottom:8px;">
    ${dateStr} ${timeStr}
  </div>
  <div style="border-top:1px dashed #000;margin-bottom:6px;"></div>
  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="border-bottom:1px solid #000;">
        <th style="text-align:left;padding:2px 0;font-size:12px;">ITEM</th>
        <th style="text-align:right;padding:2px 0;font-size:12px;">QTY</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>
  ${specialInstructions}
  <div style="border-top:1px dashed #000;margin-top:8px;padding-top:6px;text-align:center;font-size:11px;">
    --- END OF KOT ---
  </div>
</body>
</html>`;
}
