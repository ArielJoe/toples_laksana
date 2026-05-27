import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  type = "button",
  ...props
}: React.ComponentProps<"button"> & {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      data-slot="pagination-link"
      type={type}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "border-border bg-white text-text-secondary hover:bg-secondary-50 hover:text-text-primary data-[active=true]:border-primary-500 data-[active=true]:bg-primary-500 data-[active=true]:text-white data-[active=true]:hover:bg-primary-600",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  children = "Sebelumnya",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ke halaman sebelumnya"
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children = "Berikutnya",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ke halaman berikutnya"
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span>{children}</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Halaman lainnya</span>
    </span>
  );
}

type PaginationControlItem = number | "ellipsis-start" | "ellipsis-end";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationControlItem[] {
  const page = Math.min(Math.max(currentPage, 1), totalPages);
  const visiblePages = siblingCount * 2 + 5;

  if (totalPages <= visiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, totalPages - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;
  const items: PaginationControlItem[] = [1];

  if (showLeftEllipsis) {
    items.push("ellipsis-start");
  } else {
    for (let item = 2; item < leftSibling; item += 1) {
      items.push(item);
    }
  }

  for (let item = leftSibling; item <= rightSibling; item += 1) {
    items.push(item);
  }

  if (showRightEllipsis) {
    items.push("ellipsis-end");
  } else {
    for (let item = rightSibling + 1; item < totalPages; item += 1) {
      items.push(item);
    }
  }

  items.push(totalPages);

  return items;
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
  contentClassName,
  linkClassName,
  previousNextClassName,
  ellipsisClassName,
  siblingCount = 1,
  previousLabel = "Sebelumnya",
  nextLabel = "Berikutnya",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  contentClassName?: string;
  linkClassName?: string;
  previousNextClassName?: string;
  ellipsisClassName?: string;
  siblingCount?: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const items = getPaginationItems(safePage, totalPages, siblingCount);

  return (
    <Pagination className={className}>
      <PaginationContent className={cn("flex-wrap justify-center gap-2", contentClassName)}>
        <PaginationItem>
          <PaginationPrevious
            disabled={safePage === 1}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            className={cn("disabled:pointer-events-none disabled:opacity-40", previousNextClassName)}
          >
            {previousLabel}
          </PaginationPrevious>
        </PaginationItem>
        {items.map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                isActive={item === safePage}
                onClick={() => onPageChange(item)}
                className={linkClassName}
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis className={ellipsisClassName} />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={safePage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            className={cn("disabled:pointer-events-none disabled:opacity-40", previousNextClassName)}
          >
            {nextLabel}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationControls,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
