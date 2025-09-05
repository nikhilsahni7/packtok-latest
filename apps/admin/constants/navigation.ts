import {
  BarChart3,
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Package,
  Settings,
  Tags,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current?: boolean;
  badge?: number;
}

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    current: false,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
    current: false,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    current: false,
  },
  { name: "Orders", href: "/dashboard/orders", icon: Package, current: false },
  {
    name: "Quote Requests",
    href: "/dashboard/quotes",
    icon: ClipboardList,
    current: false,
  },
  {
    name: "Submissions",
    href: "/dashboard/submissions",
    icon: UserCheck,
    current: false,
  },
  {
    name: "Vendors",
    href: "/dashboard/vendors",
    icon: Users,
    current: false,
  },
  {
    name: "Services",
    href: "/dashboard/services",
    icon: Truck,
    current: false,
  },
  {
    name: "Invoice",
    href: "/dashboard/invoice",
    icon: FileText,
    current: false,
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
    current: false,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    current: false,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    current: false,
    badge: 4,
  },
  {
    name: "Notification",
    href: "/dashboard/notification",
    icon: Bell,
    current: false,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    current: false,
  },
];

export const productTabs = [
  { name: "Products", value: "products", href: "/dashboard/products" },
  { name: "Customers", value: "customers", href: "/dashboard/customers" },
  {
    name: "Add Product",
    value: "add-product",
    href: "/dashboard/products/add",
  },
];
