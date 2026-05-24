import { Metadata } from "next";
import InvoicePageContent from "./InvoicePageContent";

export const metadata: Metadata = {
  title: "Invoice Generator - Admin",
};

export default function InvoicePage() {
  return <InvoicePageContent />;
}
