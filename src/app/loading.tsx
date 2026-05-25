export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      {/* Header skeleton */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container border-b border-outline-variant">
        <div className="flex items-center gap-6">
          <div className="w-36 h-6 bg-surface-container-high rounded animate-pulse" />
          <div className="hidden md:flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-7 bg-surface-container-high rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-high rounded-full animate-pulse" />
          <div className="w-16 h-7 bg-surface-container-high rounded-full animate-pulse hidden sm:block" />
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero skeleton */}
        <section className="pt-16 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="w-40 h-7 bg-surface-container-high rounded-full mb-6 animate-pulse" />
          <div className="w-3/4 h-12 bg-surface-container-high rounded mb-3 animate-pulse" />
          <div className="w-1/2 h-12 bg-surface-container-high rounded mb-6 animate-pulse" />
          <div className="w-2/3 h-5 bg-surface-container-high rounded mb-8 animate-pulse" />
          <div className="flex gap-3">
            <div className="w-36 h-10 bg-surface-container-high rounded-full animate-pulse" />
            <div className="w-36 h-10 bg-surface-container-high rounded-full animate-pulse" />
          </div>
        </section>

        {/* Calculator skeleton */}
        <section className="pb-16 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-surface-container rounded-2xl border border-outline-variant p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="w-28 h-4 bg-surface-container-high rounded animate-pulse" />
                  <div className="w-full h-10 bg-surface-container-high rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 bg-surface-container rounded-2xl border border-outline-variant p-6 min-h-[320px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-surface-container-high rounded mx-auto animate-pulse" />
                <div className="w-32 h-4 bg-surface-container-high rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
