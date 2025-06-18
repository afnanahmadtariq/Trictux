export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div>
                <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs Skeleton */}
          <div className="flex space-x-1 bg-slate-200 rounded-lg p-1">
            <div className="h-10 w-40 bg-slate-300 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-slate-200 rounded animate-pulse"></div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-24 w-full bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-12 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
