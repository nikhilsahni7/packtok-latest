"use client";

import { ServicesStats } from "../_components/services-stats";
import { ServicesTable } from "../_components/services-table";

export default function JobSeekerServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Job Seeker Submissions
          </h1>
          <p className="text-muted-foreground">
            Manage job seeker submissions
          </p>
        </div>
      </div>

      <ServicesStats />
      <ServicesTable />
    </div>
  );
}
