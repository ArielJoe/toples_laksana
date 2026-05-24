import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeQuestionMarkIcon,
  ChartNoAxesColumnIncreasingIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DownloadIcon,
  EditIcon,
  Grid2X2Icon,
  HandIcon,
  LayoutListIcon,
  LogOutIcon,
  MenuIcon,
  MessageCircleIcon,
  PackageIcon,
  PaletteIcon,
  PlusIcon,
  QuoteIcon,
  RotateCcwIcon,
  RulerIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StoreIcon,
  Trash2Icon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

const icons = {
  add: PlusIcon,
  arrow_back: ArrowLeftIcon,
  arrow_forward: ArrowRightIcon,
  category: PackageIcon,
  chat: MessageCircleIcon,
  check: CheckIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  close: XIcon,
  compare: SparklesIcon,
  compare_arrows: SparklesIcon,
  dashboard: ChartNoAxesColumnIncreasingIcon,
  delete: Trash2Icon,
  download: DownloadIcon,
  edit: EditIcon,
  edit_note: EditIcon,
  grade: SparklesIcon,
  grid_view: Grid2X2Icon,
  inventory_2: PackageIcon,
  local_shipping: TruckIcon,
  logout: LogOutIcon,
  menu: MenuIcon,
  palette: PaletteIcon,
  request_quote: QuoteIcon,
  reset: RotateCcwIcon,
  sell: QuoteIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  shopping_bag: ShoppingBagIcon,
  straighten: RulerIcon,
  storefront: StoreIcon,
  texture: CircleIcon,
  touch_app: HandIcon,
  trending_up: ChartNoAxesColumnIncreasingIcon,
  tune: SlidersHorizontalIcon,
  verified: SparklesIcon,
  view_list: LayoutListIcon,
} satisfies Record<string, ComponentType<{ className?: string }>>;

interface AppIconProps {
  name: string;
  className?: string;
}

export function AppIcon({ name, className }: AppIconProps) {
  const Icon = icons[name as keyof typeof icons] ?? BadgeQuestionMarkIcon;

  return <Icon aria-hidden="true" className={cn("size-[1em] shrink-0", className)} />;
}
