export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-96 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 animate-pulse">
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 animate-pulse">
            <div className\
