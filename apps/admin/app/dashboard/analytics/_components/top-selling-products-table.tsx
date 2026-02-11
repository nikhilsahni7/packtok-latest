"use client";

import { useState, useMemo } from "react";
import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packtok/ui/components/table";
import { TopSellingProduct } from "types/analytics";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

interface TopSellingProductsTableProps {
  products: TopSellingProduct[];
}

type SortField = keyof TopSellingProduct;
type SortDirection = "asc" | "desc";

export function TopSellingProductsTable({
  products,
}: TopSellingProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalSales");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField] ?? "";
      let bValue = b[sortField] ?? "";

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-gray-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Selling Products
          </h3>
          <Button variant="ghost" size="sm" className="text-blue-600">
            See More
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3">SN</TableHead>
              <TableHead className="py-3">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead className="py-3">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                  onClick={() => handleSort("price")}
                >
                  Price
                  <SortIcon field="price" />
                </Button>
              </TableHead>
              <TableHead className="py-3">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                  onClick={() => handleSort("totalOrders")}
                >
                  Total Order
                  <SortIcon field="totalOrders" />
                </Button>
              </TableHead>
              <TableHead className="py-3">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                  onClick={() => handleSort("totalSales")}
                >
                  Total Sales
                  <SortIcon field="totalSales" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProducts.map((product, index) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell className="py-3">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="py-3">
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-gray-900">INR {Number(product.price).toLocaleString()}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-gray-900">
                    {product.totalOrders.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-green-600 font-medium">
                    ${product.totalSales.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
