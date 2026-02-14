"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/card";
import { Calendar, DollarSign } from "lucide-react";
import { useQuotes } from "../../../../hooks";

export function QuotesStats() {
  const { data: quotes = [] } = useQuotes();

  const pendingQuotes = quotes.filter((q) => q.status === "PENDING").length;
  const completedQuotes = quotes.filter((q) => q.status === "COMPLETED").length;
  const thisMonthQuotes = quotes.filter((q) => {
    const quoteDate = new Date(q.createdAt);
    const now = new Date();
    return (
      quoteDate.getMonth() === now.getMonth() &&
      quoteDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 overflow-hidden">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quotes.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingQuotes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedQuotes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthQuotes}</div>
        </CardContent>
      </Card>
    </div>
  );
}
