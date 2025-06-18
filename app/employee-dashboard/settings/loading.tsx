import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs Skeleton */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          {/* Content Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-10 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>

              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
