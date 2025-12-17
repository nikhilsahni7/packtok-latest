"use client";

import { QuotesStats } from "./_components/quotes-stats";
import { QuotesTable } from "./_components/quotes-table";

export default function QuotesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quote Requests</h1>
          <p className="text-muted-foreground">
            Manage customer quote requests
          </p>
        </div>
      </div>

      <QuotesStats />
      <QuotesTable />
    </div>
  );
}
