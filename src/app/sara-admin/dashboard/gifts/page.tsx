'use client'

export default function GiftsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gifts</h2>
      <p className="text-gray-700 dark:text-gray-300">Manage gift ideas, curated gift sets, and promotions.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 p-5 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Gift Collection {i}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configured gift bundle with 5 items.</p>
          </div>
        ))}
      </div>
    </div>
  )
}


