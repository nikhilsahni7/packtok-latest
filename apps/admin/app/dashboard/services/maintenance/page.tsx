"use client";

import { ServicesStats } from "../_components/services-stats";
import { ServicesTable } from "../_components/services-table";

export default function MaintenanceServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Maintenance Services
          </h1>
          <p className="text-muted-foreground">
            Manage machine maintenance requests
          </p>
        </div>
      </div>

      <ServicesStats />
      <ServicesTable />
    </div>
  );
}
