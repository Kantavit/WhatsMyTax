export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      {/* Header skeleton */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
        <div className="w-32 h-6 bg-surface-container-high rounded animate-pulse" />
        <div className="w-8 h-8 bg-surface-container-high rounded-full animate-pulse" />
      </header>

      {/* Main skeleton */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Title skeleton */}
        <section className="text-center mb-12">
          <div className="w-3/4 h-10 bg-surface-container-high rounded mx-auto mb-4 animate-pulse" />
          <div className="w-1/2 h-5 bg-surface-container-high rounded mx-auto animate-pulse" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calculator card skeleton */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-10 h-5 bg-surface-container-high rounded-full animate-pulse" />
                  <div className="flex-1 h-9 bg-surface-container-high rounded animate-pulse" />
                  <div className="w-32 h-9 bg-surface-container-high rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Results sidebar skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-surface-container rounded mx-auto animate-pulse" />
                <div className="w-40 h-4 bg-surface-container rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
