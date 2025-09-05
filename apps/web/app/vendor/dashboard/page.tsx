import dynamic from "next/dynamic";

const VendorDashboardClient = dynamic(
  () => import("./vendor-dashboard-client"),
  { ssr: false }
);

export default function Page() {
  return <VendorDashboardClient />;
}
