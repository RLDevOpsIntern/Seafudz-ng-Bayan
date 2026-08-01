import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  searchQuery?: string
  setSearchQuery?: (query: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 bg-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl shadow-xs border border-neutral-100 transition-all">
      {/* Brand Logo & Name with Dropdown Trigger */}
      <div className="flex items-center justify-between gap-3 w-full md:w-auto">
        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0 transition-transform group-hover:scale-105">
              <img 
                src="/src/assets/hero.png" 
                alt="Seafood ng Bayan Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23e0f2fe'/><text y='70' x='15' font-size='60'>🍤</text></svg>";
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-neutral-800 text-base sm:text-lg leading-tight flex items-center gap-1.5 group-hover:text-orange-600 transition-colors">
                Seafood ng Bayan
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-medium">Restaurant Navigator</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link 
                to="/pos" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Cashier POS
              </Link>
              <Link 
                to="/kitchen" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Kitchen Mode
              </Link>
              <Link 
                to="/assistant" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Assistant Mode
              </Link>
              <Link 
                to="/tables" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Table Visualizer
              </Link>
              <Link 
                to="/rider" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Rider Mode
              </Link>
              <Link 
                to="/sales-report" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Sales Report
              </Link>
              <Link 
                to="/customer" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Online Customer
              </Link>
              <Link 
                to="/account" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                My Account
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                About Us
              </Link>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:bg-neutral-50 cursor-not-allowed transition-all"
              >
                Inventory
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:bg-neutral-50 cursor-not-allowed transition-all"
              >
                Settings
              </a>
              <hr className="my-2 border-neutral-100" />
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                Logout
              </a>
            </div>
          )}
        </div>

        {/* Profile & Notification controls for Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-amber-900/10 flex items-center justify-center text-amber-900 hover:bg-amber-900/20 active:scale-95 transition-all">
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 relative hover:bg-amber-500/20 active:scale-95 transition-all">
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Right Section: Search Bar + Profile & Notification Icons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-end w-full md:w-auto">
        {searchQuery !== undefined && setSearchQuery !== undefined ? (
          <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-full px-3.5 sm:px-4 py-1.5 w-full md:w-[320px] lg:w-[400px] focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all duration-200">
            <svg
              className="w-4.5 h-4.5 text-neutral-400 mr-2 flex-shrink-0"
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
              className="bg-transparent border-none outline-none text-neutral-700 placeholder-neutral-400 text-xs sm:text-sm w-full py-1"
            />
            <button className="flex items-center gap-1 bg-white border border-neutral-200 text-neutral-600 rounded-full px-3 py-1 text-xs font-semibold hover:bg-neutral-50 active:scale-95 transition-all ml-1.5 shadow-xs flex-shrink-0 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="hidden xs:inline">Filter</span>
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center">
            <span className="text-orange-700 font-bold text-sm bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Kitchen Mode Active
            </span>
          </div>
        )}

        {/* Desktop Profile & Notification */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center text-amber-900 hover:bg-amber-900/20 active:scale-95 transition-all duration-150 cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 relative hover:bg-amber-500/20 active:scale-95 transition-all duration-150 cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

