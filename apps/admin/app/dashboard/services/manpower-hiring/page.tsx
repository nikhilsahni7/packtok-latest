"use client";

import { ServicesStats } from "../_components/services-stats";
import { ServicesTable } from "../_components/services-table";

export default function ManpowerHiringServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manpower Hiring Services
          </h1>
          <p className="text-muted-foreground">
            Manage manpower hiring requests
          </p>
        </div>
      </div>

      <ServicesStats />
      <ServicesTable />
    </div>
  );
}
