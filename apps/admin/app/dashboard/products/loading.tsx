export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-md" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-4">
        <div className="h-10 w-48 bg-gray-200 rounded-md" />
        <div className="h-10 w-32 bg-gray-200 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="h-10 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-24 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
