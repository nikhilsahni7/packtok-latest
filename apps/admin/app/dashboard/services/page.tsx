"use client";

import { ServicesStats } from "./_components/services-stats";
import { ServicesTable } from "./_components/services-table";

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Requests
          </h1>
          <p className="text-muted-foreground">
            Manage and track all service requests
          </p>
        </div>
      </div>

      <ServicesStats />
      <ServicesTable />
    </div>
  );
}
