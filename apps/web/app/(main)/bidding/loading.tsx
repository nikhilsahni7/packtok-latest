export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="w-full h-72 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />

      {/* Countdown skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Auctions grid skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="aspect-video w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="mt-4 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="h-8 w-20 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
