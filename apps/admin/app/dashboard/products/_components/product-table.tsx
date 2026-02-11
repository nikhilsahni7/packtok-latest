"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@packtok/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packtok/ui/components/table";
import {
  Activity,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Edit,
  Gavel,
  MoreHorizontal,
  Package,
  Trash2,
} from "lucide-react";
import {
  MarketplaceProduct,
  MarketplaceProductStatus,
} from "../../../../types/product";
import { cxBadge, cxTypeBadge } from "../../../../utils/badges";

type SortField = "title" | "price" | "quantity" | "productType" | "status";
type SortDirection = "asc" | "desc";

interface ProductTableProps {
  products: MarketplaceProduct[];
  onEdit: (product: MarketplaceProduct) => void;
  onDelete: (productId: string) => void;
  onStatusChange: (productId: string, status: MarketplaceProductStatus) => void;
  onCreateAuction: (product: MarketplaceProduct) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateAuction,
  sortField,
  sortDirection,
  onSort,
}: ProductTableProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 px-6">Image</TableHead>
            <TableHead className="py-4 px-6">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                onClick={() => onSort("title")}
              >
                Product Name
                <SortIcon field="title" />
              </Button>
            </TableHead>
            <TableHead className="py-4 px-6">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                onClick={() => onSort("productType")}
              >
                Type
                <SortIcon field="productType" />
              </Button>
            </TableHead>
            <TableHead className="py-4 px-6">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                onClick={() => onSort("price")}
              >
                Price
                <SortIcon field="price" />
              </Button>
            </TableHead>
            <TableHead className="py-4 px-6">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                onClick={() => onSort("quantity")}
              >
                Stock
                <SortIcon field="quantity" />
              </Button>
            </TableHead>
            <TableHead className="py-4 px-6">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent"
                onClick={() => onSort("status")}
              >
                Status
                <SortIcon field="status" />
              </Button>
            </TableHead>
            <TableHead className="py-4 px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="py-4 px-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {product.title}
                  </div>
                  <div className="text-gray-500 text-xs line-clamp-1">
                    {product.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <Badge
                  className={`${cxTypeBadge(product.productType)} text-xs`}
                >
                  {product.productType.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-6 font-medium">
                {product.currency || "INR"} {Number(product.price).toLocaleString()}
              </TableCell>
              <TableCell className="py-4 px-6">
                {product.quantity} pcs
              </TableCell>
              <TableCell className="py-4 px-6">
                <Badge className={`${cxBadge(product.status)} text-xs`}>
                  {product.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => onCreateAuction(product)}>
                    <Gavel className="h-4 w-4 mr-1" />
                    Auction
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50">
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(product.id, "AVAILABLE")}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Mark Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(product.id, "SOLD")}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Mark Sold
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onStatusChange(product.id, "OUT_OF_STOCK")
                        }
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Mark Out of Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onCreateAuction(product)}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Add to Auction
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
