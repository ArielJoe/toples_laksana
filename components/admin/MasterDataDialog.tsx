"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type MasterDataValue = string | number | boolean | Date | null | undefined;
export type MasterDataForm = Record<string, MasterDataValue>;

export interface MasterDataField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "color" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface MasterDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MasterDataForm) => Promise<void>;
  title: string;
  fields: MasterDataField[];
  initialData?: object | null;
}

export default function MasterDataDialog({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData,
}: MasterDataDialogProps) {
  const [formData, setFormData] = useState<MasterDataForm>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData as MasterDataForm);
      } else {
        const defaultData: MasterDataForm = {};
        fields.forEach(f => {
          if (f.type === "number") defaultData[f.name] = 0;
          else if (f.type === "select") defaultData[f.name] = f.options?.[0]?.value || "";
          else defaultData[f.name] = "";
        });
        setFormData(defaultData);
      }
    }
  }, [initialData, isOpen, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: MasterDataValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const nextValue = Math.max(0, Number(event.currentTarget.value) || 0);
    event.currentTarget.value = String(nextValue);
    handleChange(name, nextValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl rounded-2xl overflow-hidden p-0">
        <div className="bg-white px-8 py-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-black tracking-tight text-text-primary">{title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-text-muted ml-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={String(formData[field.name] ?? "")}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-secondary-50/50 border-border font-bold text-sm min-h-[100px] focus:bg-white transition-all rounded-xl"
                  />
                ) : field.type === "select" ? (
                  (() => {
                    const selectedValue = String(formData[field.name] || field.options?.[0]?.value || "");
                    const selectedOption = field.options?.find((option) => option.value === selectedValue);

                    return (
                  <Select
                    value={selectedValue}
                    onValueChange={(value) => handleChange(field.name, value ?? "")}
                  >
                    <SelectTrigger className="h-12 w-full bg-secondary-50/50 border-border font-bold text-sm rounded-xl px-4">
                      <span className="flex flex-1 text-left">
                        {selectedOption?.label || field.placeholder}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(field.options || []).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    );
                  })()
                ) : (
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={field.type === "number" ? "number" : "text"}
                      min={field.type === "number" ? 0 : undefined}
                      value={field.type === "number" ? Number(formData[field.name] || 0) : String(formData[field.name] ?? "")}
                      onChange={(e) => {
                        if (field.type === "number") {
                          handleNumberChange(e, field.name);
                        } else {
                          handleChange(field.name, e.target.value);
                        }
                      }}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.name === "id" && !!initialData}
                      className="bg-secondary-50/50 border-border font-bold text-sm h-12 focus:bg-white transition-all rounded-xl pl-4"
                    />
                    {field.type === "color" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <input
                          type="color"
                          value={String(formData[field.name] || "#000000")}
                          onChange={(e) => handleChange(field.name, e.target.value.toUpperCase())}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div
                          className="w-7 h-7 rounded-lg border border-border shadow-inner"
                          style={{ backgroundColor: String(formData[field.name] || "#000000") }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 font-black uppercase tracking-widest text-xs h-12 rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
