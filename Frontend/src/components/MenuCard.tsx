import React from 'react'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden group">
      {/* Food Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f5f5f5'/><text y='55' x='35' font-size='40'>🥘</text></svg>";
          }}
        />
        {/* Category Pill Tag */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-neutral-700 font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-neutral-200/60 shadow-2xs">
          {item.category}
        </span>
      </div>

      {/* Food Info */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base line-clamp-1 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-neutral-500 font-normal mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-neutral-100">
          <span className="font-bold text-neutral-900 text-base">
            ₱{item.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 active:scale-95 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
