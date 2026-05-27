"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value: string) {
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
  if (!date) return "dd/mm/yyyy";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

interface AdminDatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function AdminDatePickerField({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: AdminDatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseDateInputValue(value);

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-text-muted">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          type="button"
          className="flex h-12 w-full items-center justify-between rounded-lg border border-border bg-secondary-50/30 px-4 text-left text-xs font-black text-text-primary shadow-none transition-all hover:bg-secondary-50 focus-visible:border-primary-500 focus-visible:outline-none"
        >
          <span>{formatDateButtonValue(value)}</span>
          <CalendarIcon aria-hidden="true" className="size-4 text-text-primary" />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selectedDate}
            disabled={(date) =>
              Boolean((minDate && date < minDate) || (maxDate && date > maxDate))
            }
            onSelect={(date) => {
              if (!date) return;

              onChange(getDateInputValue(date));
              setIsOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
