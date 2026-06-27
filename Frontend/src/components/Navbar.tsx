import React from 'react'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-neutral-100">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
          {/* Using hero.png or placeholder fallback */}
          <img 
            src="/src/assets/hero.png" 
            alt="Seafood ng Bayan Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a styled seafood emoji if logo fails to load
              (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23e0f2fe'/><text y='70' x='15' font-size='60'>🍤</text></svg>";
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-neutral-800 text-lg leading-tight">Seafood ng Bayan</h1>
          <p className="text-xs text-neutral-400 font-medium">Restaurant</p>
        </div>
      </div>

      {/* Search and Filter Area */}
      <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-full px-4 py-1.5 w-full md:w-[480px] max-w-full focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all duration-200">
        <svg
          className="w-5 h-5 text-neutral-400 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu..."
          className="bg-transparent border-none outline-none text-neutral-700 placeholder-neutral-400 text-sm w-full py-1"
        />
        <button className="flex items-center gap-1.5 bg-white border border-neutral-200 text-neutral-600 rounded-full px-3.5 py-1 text-xs font-semibold hover:bg-neutral-50 active:scale-95 transition-all duration-150 ml-2 shadow-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter
        </button>
      </div>

      {/* Profile & Notification */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* Profile Avatar */}
        <button className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center text-amber-900 hover:bg-amber-900/20 active:scale-95 transition-all duration-150">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 relative hover:bg-amber-500/20 active:scale-95 transition-all duration-150">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          {/* Active indicator */}
          <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  )
}
