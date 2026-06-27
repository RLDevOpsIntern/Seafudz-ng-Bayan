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
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Food Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-50 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23fee2e2'/><text y='55' x='35' font-size='40'>🥘</text></svg>";
          }}
        />
      </div>

      {/* Food Info */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-bold text-neutral-800 text-[15px] line-clamp-1 group-hover:text-orange-600 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5 line-clamp-2 min-h-[32px]">
            {item.description}
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-50">
          <span className="font-bold text-orange-500 text-[15px]">
            ₱{item.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100/70 active:scale-95 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
          >
            <span className="text-sm font-semibold">+</span> Add
          </button>
        </div>
      </div>
    </div>
  )
}
