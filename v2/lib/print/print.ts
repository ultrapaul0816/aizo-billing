import { toast } from "sonner";
import { generateKOTHTML } from "@/lib/print/kot-template";
import { generateInvoiceHTML } from "@/lib/print/invoice-template";
import type { Order } from "@/lib/api/types";

function printHTML(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-10000px";
  iframe.style.left = "-10000px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    toast.error("Failed to open print window");
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      toast.error("Print failed");
    } finally {
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };
}

export function printKOT(order: Order): void {
  toast.success("Printing KOT...");
  const html = generateKOTHTML(order);
  printHTML(html);
}

export function printInvoice(order: Order): void {
  toast.success("Printing Invoice...");
  const html = generateInvoiceHTML(order);
  printHTML(html);
}
