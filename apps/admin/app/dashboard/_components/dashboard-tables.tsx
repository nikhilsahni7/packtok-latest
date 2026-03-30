"use client";

export interface DashboardRecentOrder {
  id: string;
  product: string;
  price: string;
  status: string;
  total: string;
}

export interface DashboardTopProduct {
  name: string;
  rating: number;
  soldCount: number;
  revenue: string;
}

interface DashboardTablesProps {
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
}

const statusTone: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  REFUND: "bg-cyan-100 text-cyan-700",
  CANCEL: "bg-slate-200 text-slate-700",
};

export function DashboardTables({
  recentOrders,
  topProducts,
}: DashboardTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Orders
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Latest customer orders with status and amount
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="pb-3">Tracking no</th>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Total Order</th>
                <th className="pb-3">Total Amount</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {recentOrders.length ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="py-3 text-sm font-medium text-slate-700">
                      {order.id}
                    </td>
                    <td className="py-3 text-sm text-slate-700">
                      {order.product}
                    </td>
                    <td className="py-3 text-sm text-slate-700">
                      {order.price}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${statusTone[order.status] || "bg-slate-100 text-slate-700"}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-semibold text-slate-900">
                      {order.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-sm text-slate-500" colSpan={5}>
                    No recent orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Top Selling Products
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Ranked by revenue with rating and sold quantity
          </p>
        </div>
        <div className="space-y-4">
          {topProducts.length ? (
            topProducts.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="flex items-center space-x-4 p-4 border border-slate-100 rounded-xl"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${i < Math.round(product.rating) ? "text-amber-400" : "text-slate-300"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-slate-500 ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {product.soldCount.toLocaleString()} sold
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  {product.revenue}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No sales data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
