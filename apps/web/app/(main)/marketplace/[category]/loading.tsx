export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="w-full h-64 bg-gray-100 animate-pulse" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex lg:flex-row flex-col gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block lg:w-56 flex-shrink-0">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <div className="h-48 lg:h-56 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
