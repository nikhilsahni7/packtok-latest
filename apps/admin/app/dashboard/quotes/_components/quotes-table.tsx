"use client";

import { Badge } from "@packtok/ui/badge";
import { Button } from "@packtok/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@packtok/ui/card";
import { Input } from "@packtok/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@packtok/ui/table";
import { Eye, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuotes, useUpdateQuoteStatus } from "../../../../hooks";
import { QuoteRequest, QuoteStatus } from "../../../../types/product";
import { QuoteDetailsDialog } from "./quote-details-dialog";

interface QuotesTableProps {
  initialQuotes?: QuoteRequest[];
}

export function QuotesTable({ initialQuotes = [] }: QuotesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const { data: quotes = initialQuotes, isLoading, error } = useQuotes();
  const updateStatusMutation = useUpdateQuoteStatus();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch quote requests");
    }
  }, [error]);

  const handleStatusUpdate = async (
    quoteId: string,
    newStatus: QuoteStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ quoteId, status: newStatus });
      toast.success("Quote status updated successfully");
    } catch (error) {
      toast.error("Failed to update quote status");
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.product?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "REVIEWED":
        return <Badge variant="default">Reviewed</Badge>;
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="h-10 flex-1 rounded-md bg-gray-200" />
            <div className="h-10 w-32 rounded-md bg-gray-200" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-8 w-10 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Quote Requests</CardTitle>
        <CardDescription>
          Review and manage customer quote requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Company</TableHead>
              <TableHead className="w-[25%]">Product</TableHead>
              <TableHead className="w-[12%] text-center">Status</TableHead>
              <TableHead className="w-[13%]">Date</TableHead>
              <TableHead className="w-[18%]">Contact</TableHead>
              <TableHead className="w-[12%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium truncate">
                  {quote.companyName}
                </TableCell>
                <TableCell className="truncate">
                  {quote.product?.title || "Unknown Product"}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(quote.status)}</TableCell>
                <TableCell>
                  {new Date(quote.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="truncate">{quote.user?.name || "Unknown"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuote(quote)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No quotes found matching your search."
                : "No quote requests yet."}
            </p>
          </div>
        )}
      </CardContent>

      <QuoteDetailsDialog
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onStatusUpdate={handleStatusUpdate}
        getStatusBadge={getStatusBadge}
      />
    </Card>
  );
}
