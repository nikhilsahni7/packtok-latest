"use client";

import { ServicesStats } from "../_components/services-stats";
import { ServicesTable } from "../_components/services-table";

export default function TurnkeyProjectServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Turnkey Project Services
          </h1>
          <p className="text-muted-foreground">
            Manage turnkey project requests
          </p>
        </div>
      </div>

      <ServicesStats />
      <ServicesTable />
    </div>
  );
}
