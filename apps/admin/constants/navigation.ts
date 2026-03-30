import {
  Bell,
  BookOpenText,
  ClipboardList,
  Gavel,
  Landmark,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Package,
  Podcast,
  Rss,
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
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    current: false,
  },
  {
    name: "Auctions",
    href: "/dashboard/auctions",
    icon: Gavel,
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
    name: "Investments",
    href: "/dashboard/investments",
    icon: Landmark,
    current: false,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    current: false,
  },
  {
    name: "Articles",
    href: "/dashboard/articles",
    icon: BookOpenText,
    current: false,
  },
  {
    name: "Podcasts",
    href: "/dashboard/podcasts",
    icon: Podcast,
    current: false,
  },
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Rss,
    current: false,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
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
