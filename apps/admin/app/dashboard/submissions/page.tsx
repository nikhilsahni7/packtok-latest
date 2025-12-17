"use client";

import { SubmissionsTable } from "./_components/submissions-table";

export default function SubmissionsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Submissions
          </h1>
          <p className="text-gray-600">
            Review and moderate user-submitted products
          </p>
        </div>
      </div>

      <SubmissionsTable />
    </div>
  );
}
