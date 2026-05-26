"use client";

import { useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { toast } from "sonner";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CurrencyCode = "IDR" | "USD";

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceForm {
  documentTitle: string;
  invoiceNumber: string;
  companyName: string;
  companyDetails: string;
  billTo: string;
  shipTo: string;
  invoiceDate: string;
  paymentTerms: string;
  poNumber: string;
  notes: string;
  terms: string;
  taxRate: number;
  discountRate: number;
  shipping: number;
  currency: CurrencyCode;
  logoDataUrl: string | null;
  logoName: string;
  items: InvoiceLineItem[];
}

interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

const inputClass =
  "h-10 rounded-lg bg-white text-sm font-bold shadow-none";

const compactInputClass =
  "h-9 rounded-lg bg-white text-sm font-bold shadow-none";

const labelClass =
  "text-[0.68rem] font-black uppercase tracking-[0.16em] text-text-muted";

const PAPER_WIDTH = 794;
const PAPER_HEIGHT = 1123;
const PDF_WIDTH = 595.28;
const PDF_HEIGHT = 841.89;
const PDF_TABLE_Y = 430;

function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultInvoiceNumber() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `INV-${year}${month}${day}-001`;
}

function createLineItem(
  description = "",
  quantity = 0,
  rate = 0,
  stableId?: string,
): InvoiceLineItem {
  const id = stableId
    ? stableId
    : typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    description,
    quantity,
    rate,
  };
}

function getDefaultInvoiceForm(): InvoiceForm {
  return {
    documentTitle: "INVOICE",
    invoiceNumber: getDefaultInvoiceNumber(),
    companyName: "",
    companyDetails: "",
    billTo: "",
    shipTo: "",
    invoiceDate: getDateInputValue(new Date()),
    paymentTerms: "",
    poNumber: "",
    notes: "",
    terms: "",
    taxRate: 0,
    discountRate: 0,
    shipping: 0,
    currency: "IDR",
    logoDataUrl: null,
    logoName: "",
    items: [createLineItem("", 0, 0, "item-1")],
  };
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateTotals(form: InvoiceForm): InvoiceTotals {
  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const taxAmount = subtotal * (form.taxRate / 100);
  const discountAmount = subtotal * (form.discountRate / 100);
  const total = subtotal + taxAmount - discountAmount + form.shipping;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
}

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  })
    .format(value)
    .replace(/\u00a0/g, " ");
}

function formatDateDisplay(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function createFileName(invoiceNumber: string) {
  const safeNumber = invoiceNumber
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${safeNumber || "invoice"}.pdf`;
}

export default function InvoicePageContent() {
  const [form, setForm] = useState<InvoiceForm>(() => getDefaultInvoiceForm());
  const [isDownloading, setIsDownloading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => calculateTotals(form), [form]);

  const updateForm = <K extends keyof InvoiceForm>(
    key: K,
    value: InvoiceForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateItem = <K extends keyof InvoiceLineItem>(
    id: string,
    key: K,
    value: InvoiceLineItem[K],
  ) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, createLineItem()],
    }));
  };

  const removeItem = (id: string) => {
    setForm((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((item) => item.id !== id),
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateForm("logoDataUrl", String(reader.result));
      updateForm("logoName", file.name);
    };
    reader.onerror = () => toast.error("Gagal membaca file logo");
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setForm(getDefaultInvoiceForm());
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const canvas = await renderInvoiceCanvas(form, totals);
      const pdfBlob = await createPdfFromCanvas(canvas);
      const url = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = createFileName(form.invoiceNumber);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      toast.success(`${form.documentTitle} berhasil diunduh`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat file invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">
            Invoice
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 rounded-xl px-5 text-xs font-black uppercase tracking-[0.14em] shadow-none"
          >
            <AppIcon name="reset" className="text-sm" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-11 rounded-xl px-6 text-sm font-black shadow-none"
          >
            <AppIcon name="download" className="text-lg" />
            {isDownloading ? "Menyiapkan..." : "Download PDF"}
          </Button>
        </div>
      </header>

      <div className="p-6 lg:p-10 flex-1 w-full max-w-full">
        <div className="mb-6 flex gap-3 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="h-10 shrink-0 rounded-xl text-xs font-black uppercase tracking-[0.14em] shadow-none text-text-secondary hover:text-text-primary"
          >
            <AppIcon name="reset" className="text-sm" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-10 flex-1 rounded-xl text-xs font-black shadow-none"
          >
            <AppIcon name="download" className="text-sm" />
            {isDownloading ? "Menyiapkan..." : "Download PDF"}
          </Button>
        </div>

        <div className="w-full">
          <section className="min-w-0 overflow-x-auto">
            <Card className="w-full min-w-240 rounded-xl border border-border bg-white p-9 lg:p-12 shadow-sm">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />

              <div className="mb-10 grid grid-cols-2 gap-4 border-b border-border/60 pb-6 max-w-xl">
                <div className="space-y-2">
                  <Label className={labelClass}>Dokumen</Label>
                  <Select
                    value={form.documentTitle}
                    onValueChange={(value) =>
                      updateForm("documentTitle", String(value))
                    }
                  >
                    <SelectTrigger aria-label="Dokumen" className="h-10 w-full rounded-lg bg-white shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INVOICE">Invoice</SelectItem>
                      <SelectItem value="QUOTE">Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Mata Uang</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(value) =>
                      updateForm("currency", String(value) as CurrencyCode)
                    }
                  >
                    <SelectTrigger aria-label="Mata Uang" className="h-10 w-full rounded-lg bg-white shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-16">
                <div className="space-y-7">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="h-28 w-44 rounded-lg bg-secondary-50/70 p-0 text-text-muted shadow-none hover:border-primary-200 hover:bg-primary-50/40"
                  >
                    {form.logoDataUrl ? (
                      <NextImage
                        src={form.logoDataUrl}
                        alt="Logo invoice"
                        width={176}
                        height={112}
                        unoptimized
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <span className="flex items-center gap-2 text-sm font-black">
                        <AppIcon name="add" className="text-base" />
                        Add Logo
                      </span>
                    )}
                  </Button>

                  <div className="space-y-2">
                    <Input
                      value={form.companyName}
                      onChange={(event) =>
                        updateForm("companyName", event.target.value)
                      }
                      className={inputClass}
                      aria-label="Nama perusahaan"
                    />
                    <Textarea
                      value={form.companyDetails}
                      onChange={(event) =>
                        updateForm("companyDetails", event.target.value)
                      }
                      className="min-h-20 rounded-lg bg-white text-sm font-bold shadow-none resize-none"
                      aria-label="Detail perusahaan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <Label className={labelClass}>Bill To</Label>
                      <Textarea
                        value={form.billTo}
                        onChange={(event) => updateForm("billTo", event.target.value)}
                        className="min-h-18 rounded-lg bg-white text-sm font-bold shadow-none resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelClass}>Ship To</Label>
                      <Textarea
                        value={form.shipTo}
                        onChange={(event) => updateForm("shipTo", event.target.value)}
                        className="min-h-18 rounded-lg bg-white text-sm font-bold shadow-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="w-full text-right text-5xl font-black tracking-tight text-text-primary">
                    {form.documentTitle}
                  </div>

                  <div className="ml-auto grid w-44 grid-cols-[36px_1fr] overflow-hidden rounded-lg border border-border">
                    <div className="flex items-center justify-center border-r border-border bg-secondary-50 text-sm font-black text-text-muted">
                      #
                    </div>
                    <Input
                      value={form.invoiceNumber}
                      onChange={(event) =>
                        updateForm("invoiceNumber", event.target.value)
                      }
                      className="h-10 w-full rounded-none border-none bg-white px-3 text-right text-sm font-black text-text-primary shadow-none focus-visible:border-transparent"
                      aria-label="Nomor invoice"
                    />
                  </div>

                  <div className="space-y-3">
                    <FieldRow label="Date">
                      <Input
                        type="date"
                        aria-label="Tanggal"
                        value={form.invoiceDate}
                        onChange={(event) =>
                          updateForm("invoiceDate", event.target.value)
                        }
                        className={compactInputClass}
                      />
                    </FieldRow>
                    <FieldRow label="Payment Terms">
                      <Input
                        value={form.paymentTerms}
                        onChange={(event) =>
                          updateForm("paymentTerms", event.target.value)
                        }
                        className={compactInputClass}
                      />
                    </FieldRow>
                    <FieldRow label="PO Number">
                      <Input
                        value={form.poNumber}
                        onChange={(event) =>
                          updateForm("poNumber", event.target.value)
                        }
                        className={compactInputClass}
                      />
                    </FieldRow>
                  </div>
                </div>
              </div>


              <div className="mt-14 overflow-hidden">
                <div className="grid grid-cols-[minmax(320px,1fr)_110px_150px_190px_40px] items-center rounded-t-xl bg-text-primary px-6 py-3.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white">
                  <div>Item</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Amount</div>
                  <div />
                </div>

                <div className="divide-y divide-border">
                  {form.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[minmax(320px,1fr)_110px_150px_190px_40px] items-center gap-3 py-2"
                    >
                      <Input
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, "description", event.target.value)
                        }
                        className={compactInputClass}
                        aria-label="Nama item"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "quantity",
                            toNumber(event.target.value),
                          )
                        }
                        className={cn(compactInputClass, "text-center")}
                        aria-label="Kuantitas"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(event) =>
                          updateItem(item.id, "rate", toNumber(event.target.value))
                        }
                        className={cn(compactInputClass, "text-right")}
                        aria-label="Harga satuan"
                      />
                      <div className="h-9 rounded-lg bg-secondary-50/70 px-4 flex items-center justify-end text-sm font-black text-text-primary">
                        {formatMoney(item.quantity * item.rate, form.currency)}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={form.items.length === 1}
                        className="h-9 w-9 rounded-lg text-text-muted shadow-none hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
                        aria-label="Hapus item"
                      >
                        <AppIcon name="close" className="text-base" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="mt-3 h-9 rounded-lg border-primary-200 px-4 text-xs font-black text-primary-600 shadow-none hover:bg-primary-50"
                >
                  <AppIcon name="add" className="text-sm" />
                  Line Item
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-[1fr_330px] gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className={labelClass}>Notes</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(event) =>
                        updateForm("notes", event.target.value)
                      }
                      className="min-h-18 rounded-lg bg-white text-sm font-bold shadow-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelClass}>Terms</Label>
                    <Textarea
                      value={form.terms}
                      onChange={(event) =>
                        updateForm("terms", event.target.value)
                      }
                      className="min-h-18 rounded-lg bg-white text-sm font-bold shadow-none resize-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary-50/30 p-5 space-y-3 text-sm self-start">
                  <TotalRow label="Subtotal" value={formatMoney(totals.subtotal, form.currency)} />
                  <TotalInputRow
                    label="Tax"
                    value={form.taxRate}
                    suffix="%"
                    onChange={(value) => updateForm("taxRate", value)}
                  />
                  <TotalInputRow
                    label="Discount"
                    value={form.discountRate}
                    suffix="%"
                    onChange={(value) => updateForm("discountRate", value)}
                  />
                  <TotalInputRow
                    label="Shipping"
                    value={form.shipping}
                    prefix={form.currency === "IDR" ? "Rp" : "$"}
                    onChange={(value) => updateForm("shipping", value)}
                  />
                  <div className="border-t border-border pt-4 mt-4">
                    <TotalRow
                      label="Total"
                      value={formatMoney(totals.total, form.currency)}
                      strong
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-3">
      <Label className="text-[0.8rem] font-bold text-text-secondary">{label}</Label>
      {children}
    </div>
  );
}

function TotalRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[130px_1fr] items-center gap-3",
        strong && "text-base",
      )}
    >
      <span className={cn("font-bold text-text-secondary", strong && "text-text-primary font-black")}>
        {label}
      </span>
      <span className={cn("text-right font-black text-text-primary", strong && "text-primary-600")}>{value}</span>
    </div>
  );
}

function TotalInputRow({
  label,
  value,
  suffix,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-3">
      <span className="font-bold text-text-secondary">{label}</span>
      <div className="flex h-9 overflow-hidden rounded-lg border border-border bg-white">
        {prefix && (
          <span className="flex w-11 items-center justify-center border-r border-border text-sm font-black text-text-muted">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(toNumber(event.target.value))}
          className="h-full min-w-0 flex-1 rounded-none border-none bg-white px-3 text-right text-sm font-black text-text-primary shadow-none focus-visible:border-transparent"
        />
        {suffix && (
          <span className="flex w-10 items-center justify-center text-sm font-black text-text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

async function renderInvoiceCanvas(form: InvoiceForm, totals: InvoiceTotals) {
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = PAPER_WIDTH * scale;
  canvas.height = PAPER_HEIGHT * scale;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas tidak tersedia");
  }

  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, PAPER_WIDTH, PAPER_HEIGHT);

  await drawInvoiceToCanvas(context, form, totals);

  return canvas;
}

async function drawInvoiceToCanvas(
  context: CanvasRenderingContext2D,
  form: InvoiceForm,
  totals: InvoiceTotals,
) {
  const marginX = 48;

  if (form.logoDataUrl) {
    context.fillStyle = "#f8fafc";
    roundRect(context, marginX, 38, 146, 104, 6);
    context.fill();
    context.strokeStyle = "#e2e8f0";
    context.lineWidth = 1;
    context.stroke();

    try {
      const image = await loadImage(form.logoDataUrl);
      drawImageContain(context, image, marginX + 12, 50, 122, 80);
    } catch {
      drawText(context, "Logo", marginX + 73, 86, 13, "#64748b", "bold", "center");
    }
  }

  drawRoundedField(context, marginX, 160, 284, 52);
  drawWrappedText(context, form.companyName, marginX + 12, 176, 260, 16, 13, 2, "#0f172a", "bold");
  drawWrappedText(context, form.companyDetails, marginX + 12, 230, 280, 15, 11, 3, "#64748b", "normal");

  drawText(context, safeText(form.documentTitle || "INVOICE"), 746, 50, 34, "#0f172a", "bold", "right");
  drawRoundedField(context, 615, 88, 130, 34);
  drawText(context, "#", 628, 99, 11, "#64748b", "bold");
  drawText(context, form.invoiceNumber, 734, 99, 11, "#0f172a", "bold", "right");

  drawPdfFieldRow(context, "Date", formatDateDisplay(form.invoiceDate), 470, 168);
  drawPdfFieldRow(context, "Payment Terms", form.paymentTerms, 470, 206);
  drawPdfFieldRow(context, "PO Number", form.poNumber, 470, 244);

  drawText(context, "Bill To", marginX, 292, 12, "#64748b", "bold");
  drawRoundedField(context, marginX, 310, 214, 64);
  drawWrappedText(context, form.billTo, marginX + 12, 327, 190, 16, 12, 3, "#0f172a", "bold");

  drawText(context, "Ship To", 286, 292, 12, "#64748b", "bold");
  drawRoundedField(context, 286, 310, 214, 64);
  drawWrappedText(context, form.shipTo, 298, 327, 190, 16, 12, 3, "#0f172a", "bold");

  drawLineItems(context, form);
  drawNotesAndTotals(context, form, totals);
}

function drawPdfFieldRow(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
) {
  drawText(context, label, x, y + 10, 12, "#64748b", "bold");
  drawRoundedField(context, x + 138, y, 138, 32);
  drawText(context, value, x + 264, y + 10, 11, "#0f172a", "bold", "right", 116);
}

function drawLineItems(context: CanvasRenderingContext2D, form: InvoiceForm) {
  const tableX = 48;
  const tableY = PDF_TABLE_Y;
  const tableWidth = 698;
  const headerHeight = 34;
  const rowHeight = 34;
  const tableRight = tableX + tableWidth;
  const itemX = tableX + 12;
  const qtyCenterX = tableX + 474;
  const rateRightX = tableX + 586;
  const amountRightX = tableRight - 14;
  const pdfItems = form.items.slice(0, 12);

  context.fillStyle = "#0f172a";
  roundRect(context, tableX, tableY, tableWidth, headerHeight, 5);
  context.fill();

  drawText(context, "Item", tableX + 16, tableY + 11, 11, "#ffffff", "bold");
  drawText(context, "Quantity", qtyCenterX, tableY + 11, 11, "#ffffff", "bold", "center");
  drawText(context, "Rate", rateRightX, tableY + 11, 11, "#ffffff", "bold", "right");
  drawText(context, "Amount", amountRightX, tableY + 11, 11, "#ffffff", "bold", "right");

  pdfItems.forEach((item, index) => {
    const y = tableY + headerHeight + index * rowHeight;
    context.strokeStyle = "#e5e7eb";
    context.lineWidth = 1;
    context.strokeRect(tableX, y, tableWidth, rowHeight);

    drawText(context, item.description, itemX, y + 11, 11, "#0f172a", "bold", "left", 390);
    drawText(context, String(item.quantity), qtyCenterX, y + 11, 11, "#0f172a", "bold", "center");
    drawText(context, formatMoney(item.rate, form.currency), rateRightX, y + 11, 11, "#0f172a", "bold", "right", 92);
    drawText(
      context,
      formatMoney(item.quantity * item.rate, form.currency),
      amountRightX,
      y + 11,
      11,
      "#0f172a",
      "bold",
      "right",
      108,
    );
  });

  if (form.items.length > pdfItems.length) {
    const y = tableY + headerHeight + pdfItems.length * rowHeight + 8;
    drawText(context, `+ ${form.items.length - pdfItems.length} item lainnya`, tableX + 12, y, 11, "#64748b", "bold");
  }
}

function drawNotesAndTotals(
  context: CanvasRenderingContext2D,
  form: InvoiceForm,
  totals: InvoiceTotals,
) {
  const itemCount = Math.min(form.items.length, 12);
  const tableEndY = PDF_TABLE_Y + 34 + itemCount * 34;
  const contentY = tableEndY + 64;
  const leftX = 48;
  const rightX = 462;

  drawText(context, "Notes", leftX, contentY, 12, "#64748b", "bold");
  drawRoundedField(context, leftX, contentY + 26, 336, 64);
  drawWrappedText(context, form.notes, leftX + 12, contentY + 42, 312, 16, 11, 3, "#0f172a", "bold");

  drawText(context, "Terms", leftX, contentY + 116, 12, "#64748b", "bold");
  drawRoundedField(context, leftX, contentY + 142, 336, 64);
  drawWrappedText(context, form.terms, leftX + 12, contentY + 158, 312, 16, 11, 3, "#0f172a", "bold");

  let y = contentY;
  drawSummaryRow(context, "Subtotal", formatMoney(totals.subtotal, form.currency), rightX, y);

  if (form.taxRate > 0) {
    y += 36;
    drawSummaryRow(context, `Tax ${form.taxRate}%`, formatMoney(totals.taxAmount, form.currency), rightX, y);
  }

  if (form.discountRate > 0) {
    y += 36;
    drawSummaryRow(context, `Discount ${form.discountRate}%`, `-${formatMoney(totals.discountAmount, form.currency)}`, rightX, y);
  }

  y += 36;
  drawSummaryRow(context, "Shipping", formatMoney(form.shipping, form.currency), rightX, y);

  y += 48;
  context.strokeStyle = "#cbd5e1";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(rightX - 8, y - 18);
  context.lineTo(746, y - 18);
  context.stroke();

  drawText(context, "Total", rightX, y, 15, "#0f172a", "bold");
  drawText(context, formatMoney(totals.total, form.currency), 746, y, 15, "#0f172a", "bold", "right");
}

function drawSummaryRow(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
) {
  drawText(context, label, x, y, 12, "#64748b", "bold");
  drawText(context, value, 746, y, 12, "#0f172a", "bold", "right");
}

function drawRoundedField(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.fillStyle = "#ffffff";
  roundRect(context, x, y, width, height, 6);
  context.fill();
  context.strokeStyle = "#e2e8f0";
  context.lineWidth = 1;
  context.stroke();
}

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight: "normal" | "bold" = "normal",
  align: CanvasTextAlign = "left",
  maxWidth?: number,
) {
  context.fillStyle = color;
  context.font = `${weight === "bold" ? "700" : "500"} ${size}px Arial, sans-serif`;
  context.textAlign = align;
  context.textBaseline = "top";
  context.fillText(safeText(text), x, y, maxWidth);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  size: number,
  maxLines: number,
  color: string,
  weight: "normal" | "bold" = "normal",
) {
  context.fillStyle = color;
  context.font = `${weight === "bold" ? "700" : "500"} ${size}px Arial, sans-serif`;
  context.textAlign = "left";
  context.textBaseline = "top";

  const paragraphs = safeText(text)
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    let line = "";

    for (const word of words) {
      const nextLine = line ? `${line} ${word}` : word;
      if (context.measureText(nextLine).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = nextLine;
      }

      if (lines.length === maxLines) break;
    }

    if (line && lines.length < maxLines) {
      lines.push(line);
    }

    if (lines.length === maxLines) break;
  }

  lines.slice(0, maxLines).forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight, maxWidth);
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function safeText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[^\x20-\x7e\n]/g, "");
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function drawImageContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const ratio = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * ratio;
  const drawHeight = image.naturalHeight * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

async function createPdfFromCanvas(canvas: HTMLCanvasElement) {
  const jpegBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Gagal mengekspor canvas"));
        }
      },
      "image/jpeg",
      0.95,
    );
  });

  const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
  return buildImagePdf(jpegBytes, canvas.width, canvas.height);
}

function buildImagePdf(
  jpegBytes: Uint8Array,
  imageWidth: number,
  imageHeight: number,
) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let position = 0;

  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    position += bytes.length;
  };

  const startObject = (id: number) => {
    offsets[id] = position;
    push(`${id} 0 obj\n`);
  };

  const content = `q\n${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm\n/Im0 Do\nQ\n`;
  const contentLength = encoder.encode(content).length;

  push("%PDF-1.4\n");

  startObject(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  startObject(2);
  push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  startObject(3);
  push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`,
  );

  startObject(4);
  push(`<< /Length ${contentLength} >>\nstream\n${content}endstream\nendobj\n`);

  startObject(5);
  push(
    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
  );
  push(jpegBytes);
  push("\nendstream\nendobj\n");

  const xrefOffset = position;
  push("xref\n0 6\n0000000000 65535 f \n");
  for (let id = 1; id <= 5; id += 1) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}
