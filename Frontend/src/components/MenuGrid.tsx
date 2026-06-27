import React from 'react'
import { MenuCard } from './MenuCard'
import type { MenuItem } from './MenuCard'

interface MenuGridProps {
  items: MenuItem[]
  onAddToCart: (item: MenuItem) => void
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-neutral-100 shadow-xs">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-base font-bold text-neutral-700">No dishes found</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-[240px] text-center font-medium">
          We couldn't find anything matching your search query or selected category.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id}>
          <MenuCard item={item} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  )
}
