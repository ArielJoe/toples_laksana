"use client";

import { useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaginationControls } from "@/components/ui/pagination";
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
  quantity: number | "";
  rate: number | "";
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
  "h-10 rounded-lg border-neutral-300 bg-white text-sm font-bold text-black shadow-none focus-visible:border-black";

const compactInputClass =
  "h-9 rounded-lg border-neutral-300 bg-white text-sm font-bold text-black shadow-none focus-visible:border-black";

const INVOICE_ITEMS_PAGE_SIZE = 8;

const labelClass =
  "text-[0.68rem] font-black uppercase tracking-[0.16em] text-neutral-600";

const textareaClass =
  "rounded-lg border-neutral-300 bg-white text-sm font-bold text-black shadow-none resize-none focus-visible:border-black";

const selectTriggerClass =
  "h-10 w-full rounded-lg border-neutral-300 bg-white text-black shadow-none focus-visible:border-black";

const selectContentClass = "border-neutral-300 bg-white text-black";

const selectItemClass =
  "focus:bg-neutral-100 focus:text-black focus:**:text-black";

const PDF_BLACK = "#000000";
const PDF_WHITE = "#ffffff";
const PDF_GRAY = "#555555";
const PDF_LIGHT_GRAY = "#f5f5f5";
const PDF_BORDER = "#d4d4d4";

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

function parseDateInputValue(value: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    !Number.isFinite(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function formatDateButtonValue(value: string) {
  const date = parseDateInputValue(value);
  if (!date) return "Pilih tanggal";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
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
  quantity: number | "" = "",
  rate: number | "" = "",
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
    items: [createLineItem("", "", "", "item-1")],
  };
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toOptionalNumber(value: string) {
  if (value.trim() === "") return "";

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

function valueToNumber(value: number | "") {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function calculateLineItemAmount(item: InvoiceLineItem) {
  return valueToNumber(item.quantity) * valueToNumber(item.rate);
}

function calculateTotals(form: InvoiceForm): InvoiceTotals {
  const subtotal = form.items.reduce(
    (sum, item) => sum + calculateLineItemAmount(item),
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

function isBlank(value: string) {
  return value.trim() === "";
}

function formatMissingFields(fields: string[]) {
  const visibleFields = fields.slice(0, 6).join(", ");
  const remainingCount = fields.length - 6;

  return remainingCount > 0
    ? `${visibleFields}, dan ${remainingCount} field lainnya.`
    : visibleFields;
}

function validateInvoiceForm(form: InvoiceForm) {
  const missingFields: string[] = [];

  if (isBlank(form.documentTitle)) missingFields.push("Dokumen");
  if (isBlank(form.invoiceNumber)) missingFields.push("Nomor invoice");
  if (isBlank(form.companyName)) missingFields.push("Nama perusahaan");
  if (isBlank(form.companyDetails)) missingFields.push("Detail perusahaan");
  if (isBlank(form.billTo)) missingFields.push("Ditagihkan kepada");
  if (isBlank(form.shipTo)) missingFields.push("Dikirim kepada");
  if (isBlank(form.invoiceDate)) missingFields.push("Tanggal");
  if (isBlank(form.paymentTerms)) missingFields.push("Termin pembayaran");
  if (isBlank(form.poNumber)) missingFields.push("Nomor PO");
  if (isBlank(form.notes)) missingFields.push("Catatan");
  if (isBlank(form.terms)) missingFields.push("Syarat & Ketentuan");

  form.items.forEach((item, index) => {
    const itemNumber = index + 1;

    if (isBlank(item.description)) {
      missingFields.push(`Nama item ${itemNumber}`);
    }

    if (item.quantity === "") {
      missingFields.push(`Jumlah item ${itemNumber}`);
    }

    if (item.rate === "") {
      missingFields.push(`Harga item ${itemNumber}`);
    }
  });

  return missingFields;
}

function areInvoiceFormsEqual(first: InvoiceForm, second: InvoiceForm) {
  return JSON.stringify(first) === JSON.stringify(second);
}

export default function InvoicePageContent() {
  const [form, setForm] = useState<InvoiceForm>(() => getDefaultInvoiceForm());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [lineItemPage, setLineItemPage] = useState(1);
  const resetBaselineRef = useRef<InvoiceForm | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (resetBaselineRef.current === null) {
    resetBaselineRef.current = form;
  }

  const totals = useMemo(() => calculateTotals(form), [form]);
  const lineItemTotalPages = Math.max(
    1,
    Math.ceil(form.items.length / INVOICE_ITEMS_PAGE_SIZE),
  );
  const safeLineItemPage = Math.min(lineItemPage, lineItemTotalPages);
  const lineItemStartIndex = form.items.length === 0
    ? 0
    : (safeLineItemPage - 1) * INVOICE_ITEMS_PAGE_SIZE + 1;
  const lineItemEndIndex = Math.min(
    safeLineItemPage * INVOICE_ITEMS_PAGE_SIZE,
    form.items.length,
  );
  const paginatedLineItems = form.items.slice(lineItemStartIndex - 1, lineItemEndIndex);
  const hasFormChanged = useMemo(
    () =>
      resetBaselineRef.current
        ? !areInvoiceFormsEqual(form, resetBaselineRef.current)
        : false,
    [form],
  );

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
    setLineItemPage(Math.ceil((form.items.length + 1) / INVOICE_ITEMS_PAGE_SIZE));
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
    if (!hasFormChanged) {
      toast.error("Tidak ada data yang perlu direset");
      return;
    }

    const nextForm = getDefaultInvoiceForm();
    resetBaselineRef.current = nextForm;
    setForm(nextForm);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    toast.success("Form invoice berhasil direset");
  };

  const handleDownload = async () => {
    const missingFields = validateInvoiceForm(form);

    if (missingFields.length > 0) {
      toast.error("Lengkapi field yang masih kosong", {
        description: formatMissingFields(missingFields),
      });
      return;
    }

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
          <h2 className="text-[1.6rem] font-black text-black tracking-tight">
            Invoice
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 rounded-xl border-black bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-black shadow-none hover:bg-neutral-100 hover:text-black focus-visible:border-black"
          >
            <AppIcon name="reset" className="text-sm" />
            Atur Ulang
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-11 rounded-xl bg-black px-6 text-sm font-black text-white shadow-none hover:bg-neutral-800 focus-visible:border-black"
          >
            <AppIcon name="download" className="text-lg" />
            {isDownloading ? "Menyiapkan..." : "Unduh PDF"}
          </Button>
        </div>
      </header>

      <div className="p-6 lg:p-10 flex-1 w-full max-w-full">
        <div className="mb-6 flex gap-3 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="h-10 shrink-0 rounded-xl text-xs font-black uppercase tracking-[0.14em] text-neutral-700 shadow-none hover:bg-neutral-100 hover:text-black"
          >
            <AppIcon name="reset" className="text-sm" />
            Atur Ulang
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-10 flex-1 rounded-xl bg-black text-xs font-black text-white shadow-none hover:bg-neutral-800 focus-visible:border-black"
          >
            <AppIcon name="download" className="text-sm" />
            {isDownloading ? "Menyiapkan..." : "Unduh PDF"}
          </Button>
        </div>

        <div className="w-full">
          <section className="min-w-0 overflow-x-auto">
            <Card className="w-full min-w-240 rounded-xl border border-neutral-300 bg-white p-9 lg:p-12 shadow-sm">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />

              <div className="mb-10 grid grid-cols-2 gap-4 border-b border-neutral-300 pb-6 max-w-xl">
                <div className="space-y-2">
                  <Label className={labelClass}>Dokumen</Label>
                  <Select
                    value={form.documentTitle}
                    onValueChange={(value) =>
                      updateForm("documentTitle", String(value))
                    }
                  >
                    <SelectTrigger aria-label="Dokumen" className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="INVOICE" className={selectItemClass}>Invoice</SelectItem>
                      <SelectItem value="QUOTATION" className={selectItemClass}>Quotation</SelectItem>
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
                    <SelectTrigger aria-label="Mata Uang" className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="IDR" className={selectItemClass}>IDR</SelectItem>
                      <SelectItem value="USD" className={selectItemClass}>USD</SelectItem>
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
                    className="h-28 w-44 rounded-lg border-neutral-300 bg-white p-0 text-neutral-700 shadow-none hover:border-black hover:bg-neutral-100 hover:text-black focus-visible:border-black"
                  >
                    {form.logoDataUrl ? (
                      <NextImage
                        src={form.logoDataUrl}
                        alt="Logo invoice"
                        width={176}
                        height={112}
                        unoptimized
                        className="h-full w-full object-contain p-3 grayscale"
                      />
                    ) : (
                      <span className="flex items-center gap-2 text-sm font-black">
                        <AppIcon name="add" className="text-base" />
                        Tambah Logo
                      </span>
                    )}
                  </Button>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className={labelClass}>Nama Perusahaan</Label>
                      <Input
                        value={form.companyName}
                        onChange={(event) =>
                          updateForm("companyName", event.target.value)
                        }
                        className={inputClass}
                        aria-label="Nama perusahaan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelClass}>Detail Perusahaan</Label>
                      <Textarea
                        value={form.companyDetails}
                        onChange={(event) =>
                          updateForm("companyDetails", event.target.value)
                        }
                        className={cn(textareaClass, "min-h-20")}
                        aria-label="Detail perusahaan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <Label className={labelClass}>Ditagihkan Kepada</Label>
                      <Textarea
                        value={form.billTo}
                        onChange={(event) => updateForm("billTo", event.target.value)}
                        className={cn(textareaClass, "min-h-18")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelClass}>Dikirim Kepada</Label>
                      <Textarea
                        value={form.shipTo}
                        onChange={(event) => updateForm("shipTo", event.target.value)}
                        className={cn(textareaClass, "min-h-18")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="w-full text-right text-5xl font-black tracking-tight text-black">
                    {form.documentTitle}
                  </div>

                  <div className="ml-auto grid w-44 grid-cols-[36px_1fr] overflow-hidden rounded-lg border border-neutral-300">
                    <div className="flex items-center justify-center border-r border-neutral-300 bg-neutral-100 text-sm font-black text-neutral-700">
                      #
                    </div>
                    <Input
                      value={form.invoiceNumber}
                      onChange={(event) =>
                        updateForm("invoiceNumber", event.target.value)
                      }
                      className="h-10 w-full rounded-none border-none bg-white px-3 text-right text-sm font-black text-black shadow-none focus-visible:border-transparent"
                      aria-label="Nomor invoice"
                    />
                  </div>

                  <div className="space-y-3">
                    <FieldRow label="Tanggal">
                      <Popover
                        open={isDatePickerOpen}
                        onOpenChange={setIsDatePickerOpen}
                      >
                        <PopoverTrigger
                          aria-label="Pilih tanggal invoice"
                          className={cn(
                            compactInputClass,
                            "flex w-full items-center justify-between border border-neutral-300 px-4 text-left text-black transition-all hover:bg-neutral-100 focus-visible:border-black focus-visible:outline-none",
                          )}
                        >
                          <span>{formatDateButtonValue(form.invoiceDate)}</span>
                          <CalendarIcon
                            aria-hidden="true"
                            className="size-4 text-black"
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={8}
                          className="w-auto border border-neutral-300 bg-white p-0 text-black"
                        >
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            className="**:data-[selected-single=true]:bg-black **:data-[selected-single=true]:text-white **:data-[range-end=true]:bg-black **:data-[range-end=true]:text-white **:data-[range-start=true]:bg-black **:data-[range-start=true]:text-white"
                            selected={parseDateInputValue(form.invoiceDate)}
                            onSelect={(date) => {
                              if (!date) return;

                              updateForm("invoiceDate", getDateInputValue(date));
                              setIsDatePickerOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FieldRow>
                    <FieldRow label="Termin Pembayaran">
                      <Input
                        value={form.paymentTerms}
                        onChange={(event) =>
                          updateForm("paymentTerms", event.target.value)
                        }
                        className={compactInputClass}
                      />
                    </FieldRow>
                    <FieldRow label="Nomor PO">
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
                <div className="grid grid-cols-[minmax(320px,1fr)_110px_150px_190px_40px] items-center rounded-t-xl bg-black px-6 py-3.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white">
                  <div>Item</div>
                  <div className="text-center">Jumlah</div>
                  <div className="text-right">Harga</div>
                  <div className="text-right">Total</div>
                  <div />
                </div>

                <div className="divide-y divide-neutral-300">
                  {paginatedLineItems.map((item) => (
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
                            toOptionalNumber(event.target.value),
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
                          updateItem(item.id, "rate", toOptionalNumber(event.target.value))
                        }
                        className={cn(compactInputClass, "text-right")}
                        aria-label="Harga satuan"
                      />
                      <div className="h-9 rounded-lg bg-neutral-100 px-4 flex items-center justify-end text-sm font-black text-black">
                        {formatMoney(calculateLineItemAmount(item), form.currency)}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={form.items.length === 1}
                        className="h-9 w-9 rounded-lg text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-600"
                        aria-label="Hapus item"
                      >
                        <AppIcon name="close" className="text-base" />
                      </Button>
                    </div>
                  ))}
                </div>

                {form.items.length > INVOICE_ITEMS_PAGE_SIZE && (
                  <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-neutral-300 pt-4 sm:flex-row">
                    <span className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-neutral-600">
                      Menampilkan <span className="text-black">{lineItemStartIndex}-{lineItemEndIndex}</span> dari <span className="text-black">{form.items.length}</span> item
                    </span>
                    <PaginationControls
                      page={safeLineItemPage}
                      totalPages={lineItemTotalPages}
                      onPageChange={setLineItemPage}
                      className="mx-0 w-auto"
                      contentClassName="gap-1"
                      linkClassName="size-9 border-neutral-300 text-[0.65rem] font-black text-black hover:bg-neutral-100 hover:text-black data-[active=true]:border-black data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-neutral-900"
                      previousNextClassName="h-9 border-neutral-300 text-black hover:bg-neutral-100 hover:text-black"
                    />
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="mt-3 h-9 rounded-lg border-black bg-white px-4 text-xs font-black text-black shadow-none hover:bg-neutral-100 hover:text-black focus-visible:border-black"
                >
                  <AppIcon name="add" className="text-sm" />
                  Tambah Item
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-[1fr_330px] gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className={labelClass}>Catatan</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(event) =>
                        updateForm("notes", event.target.value)
                      }
                      className={cn(textareaClass, "min-h-18")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelClass}>Syarat & Ketentuan</Label>
                    <Textarea
                      value={form.terms}
                      onChange={(event) =>
                        updateForm("terms", event.target.value)
                      }
                      className={cn(textareaClass, "min-h-18")}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-300 bg-white p-5 space-y-3 text-sm self-start">
                  <TotalRow label="Subtotal" value={formatMoney(totals.subtotal, form.currency)} />
                  <TotalInputRow
                    label="Pajak"
                    value={form.taxRate}
                    suffix="%"
                    onChange={(value) => updateForm("taxRate", value)}
                  />
                  <TotalInputRow
                    label="Diskon"
                    value={form.discountRate}
                    suffix="%"
                    onChange={(value) => updateForm("discountRate", value)}
                  />
                  <TotalInputRow
                    label="Biaya Kirim"
                    value={form.shipping}
                    prefix={form.currency === "IDR" ? "Rp" : "$"}
                    onChange={(value) => updateForm("shipping", value)}
                  />
                  <div className="border-t border-neutral-300 pt-4 mt-4">
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
      <Label className="text-[0.8rem] font-bold text-neutral-700">{label}</Label>
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
      <span className={cn("font-bold text-neutral-700", strong && "text-black font-black")}>
        {label}
      </span>
      <span className={cn("text-right font-black text-black")}>{value}</span>
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
      <span className="font-bold text-neutral-700">{label}</span>
      <div className="flex h-9 overflow-hidden rounded-lg border border-neutral-300 bg-white">
        {prefix && (
          <span className="flex w-11 items-center justify-center border-r border-neutral-300 text-sm font-black text-neutral-700">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(toNumber(event.target.value))}
          className="h-full min-w-0 flex-1 rounded-none border-none bg-white px-3 text-right text-sm font-black text-black shadow-none focus-visible:border-transparent"
        />
        {suffix && (
          <span className="flex w-10 items-center justify-center text-sm font-black text-neutral-700">
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
  context.fillStyle = PDF_WHITE;
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
    context.fillStyle = PDF_LIGHT_GRAY;
    roundRect(context, marginX, 38, 146, 104, 6);
    context.fill();
    context.strokeStyle = PDF_BORDER;
    context.lineWidth = 1;
    context.stroke();

    try {
      const image = await loadImage(form.logoDataUrl);
      drawImageContain(context, image, marginX + 12, 50, 122, 80);
    } catch {
      drawText(context, "Logo", marginX + 73, 86, 13, PDF_GRAY, "bold", "center");
    }
  }

  drawRoundedField(context, marginX, 160, 284, 52);
  drawWrappedText(context, form.companyName, marginX + 12, 176, 260, 16, 13, 2, PDF_BLACK, "bold");
  drawWrappedText(context, form.companyDetails, marginX + 12, 230, 280, 15, 11, 3, PDF_GRAY, "normal");

  drawText(context, safeText(form.documentTitle || "INVOICE"), 746, 50, 34, PDF_BLACK, "bold", "right");
  drawRoundedField(context, 615, 88, 130, 34);
  drawText(context, "#", 628, 99, 11, PDF_GRAY, "bold");
  drawText(context, form.invoiceNumber, 734, 99, 11, PDF_BLACK, "bold", "right");

  drawPdfFieldRow(context, "Tanggal", formatDateDisplay(form.invoiceDate), 470, 168);
  drawPdfFieldRow(context, "Termin Bayar", form.paymentTerms, 470, 206);
  drawPdfFieldRow(context, "Nomor PO", form.poNumber, 470, 244);

  drawText(context, "Ditagihkan Kepada", marginX, 292, 12, PDF_GRAY, "bold");
  drawRoundedField(context, marginX, 310, 214, 64);
  drawWrappedText(context, form.billTo, marginX + 12, 327, 190, 16, 12, 3, PDF_BLACK, "bold");

  drawText(context, "Dikirim Kepada", 286, 292, 12, PDF_GRAY, "bold");
  drawRoundedField(context, 286, 310, 214, 64);
  drawWrappedText(context, form.shipTo, 298, 327, 190, 16, 12, 3, PDF_BLACK, "bold");

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
  drawText(context, label, x, y + 10, 12, PDF_GRAY, "bold");
  drawRoundedField(context, x + 138, y, 138, 32);
  drawText(context, value, x + 264, y + 10, 11, PDF_BLACK, "bold", "right", 116);
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

  context.fillStyle = PDF_BLACK;
  roundRect(context, tableX, tableY, tableWidth, headerHeight, 5);
  context.fill();

  drawText(context, "Item", tableX + 16, tableY + 11, 11, PDF_WHITE, "bold");
  drawText(context, "Jumlah", qtyCenterX, tableY + 11, 11, PDF_WHITE, "bold", "center");
  drawText(context, "Harga", rateRightX, tableY + 11, 11, PDF_WHITE, "bold", "right");
  drawText(context, "Total", amountRightX, tableY + 11, 11, PDF_WHITE, "bold", "right");

  pdfItems.forEach((item, index) => {
    const y = tableY + headerHeight + index * rowHeight;
    context.strokeStyle = PDF_BORDER;
    context.lineWidth = 1;
    context.strokeRect(tableX, y, tableWidth, rowHeight);

    drawText(context, item.description, itemX, y + 11, 11, PDF_BLACK, "bold", "left", 390);
    drawText(context, item.quantity === "" ? "" : String(item.quantity), qtyCenterX, y + 11, 11, PDF_BLACK, "bold", "center");
    drawText(context, item.rate === "" ? "" : formatMoney(item.rate, form.currency), rateRightX, y + 11, 11, PDF_BLACK, "bold", "right", 92);
    drawText(
      context,
      formatMoney(calculateLineItemAmount(item), form.currency),
      amountRightX,
      y + 11,
      11,
      PDF_BLACK,
      "bold",
      "right",
      108,
    );
  });

  if (form.items.length > pdfItems.length) {
    const y = tableY + headerHeight + pdfItems.length * rowHeight + 8;
    drawText(context, `+ ${form.items.length - pdfItems.length} item lainnya`, tableX + 12, y, 11, PDF_GRAY, "bold");
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

  drawText(context, "Catatan", leftX, contentY, 12, PDF_GRAY, "bold");
  drawRoundedField(context, leftX, contentY + 26, 336, 64);
  drawWrappedText(context, form.notes, leftX + 12, contentY + 42, 312, 16, 11, 3, PDF_BLACK, "bold");

  drawText(context, "Syarat & Ketentuan", leftX, contentY + 116, 12, PDF_GRAY, "bold");
  drawRoundedField(context, leftX, contentY + 142, 336, 64);
  drawWrappedText(context, form.terms, leftX + 12, contentY + 158, 312, 16, 11, 3, PDF_BLACK, "bold");

  let y = contentY;
  drawSummaryRow(context, "Subtotal", formatMoney(totals.subtotal, form.currency), rightX, y);

  if (form.taxRate > 0) {
    y += 36;
    drawSummaryRow(context, `Pajak ${form.taxRate}%`, formatMoney(totals.taxAmount, form.currency), rightX, y);
  }

  if (form.discountRate > 0) {
    y += 36;
    drawSummaryRow(context, `Diskon ${form.discountRate}%`, `-${formatMoney(totals.discountAmount, form.currency)}`, rightX, y);
  }

  y += 36;
  drawSummaryRow(context, "Biaya Kirim", formatMoney(form.shipping, form.currency), rightX, y);

  y += 48;
  context.strokeStyle = PDF_BORDER;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(rightX - 8, y - 18);
  context.lineTo(746, y - 18);
  context.stroke();

  drawText(context, "Total", rightX, y, 15, PDF_BLACK, "bold");
  drawText(context, formatMoney(totals.total, form.currency), 746, y, 15, PDF_BLACK, "bold", "right");
}

function drawSummaryRow(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
) {
  drawText(context, label, x, y, 12, PDF_GRAY, "bold");
  drawText(context, value, 746, y, 12, PDF_BLACK, "bold", "right");
}

function drawRoundedField(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.fillStyle = PDF_WHITE;
  roundRect(context, x, y, width, height, 6);
  context.fill();
  context.strokeStyle = PDF_BORDER;
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

  context.save();
  context.filter = "grayscale(1)";
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  context.restore();
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
