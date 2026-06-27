import React from 'react'

interface CategoryTabsProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const CATEGORIES = ['All Menu', 'Seafood', 'Shrimp', 'Crab', 'Drinks']

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category
        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-102'
                : 'bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 active:scale-98'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
