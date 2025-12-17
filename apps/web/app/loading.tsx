export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full" />
          {/* Spinning ring */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium text-lg">Loading</p>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
