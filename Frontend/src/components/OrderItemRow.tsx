import React from 'react'
import type { MenuItem } from './MenuCard'

export interface CartItem {
  item: MenuItem
  quantity: number
}

interface OrderItemRowProps {
  cartItem: CartItem
  onIncrement: (itemId: string) => void
  onDecrement: (itemId: string) => void
  onRemove: (itemId: string) => void
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({
  cartItem,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { item, quantity } = cartItem

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-white/10 group transition-all duration-200">
      {/* Item info (Image + Name) */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate leading-tight">{item.name}</p>
          <p className="text-xs text-amber-100/60 mt-0.5">₱{item.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Controls & Total Price */}
      <div className="flex items-center gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center bg-black/15 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => onDecrement(item.id)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white active:scale-90 transition-all cursor-pointer font-bold text-sm"
          >
            -
          </button>
          <span className="w-6 text-center text-xs font-bold text-white select-none">
            {quantity}
          </span>
          <button
            onClick={() => onIncrement(item.id)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white active:scale-90 transition-all cursor-pointer font-bold text-sm"
          >
            +
          </button>
        </div>

        {/* Calculated Item Sum & Remove Button */}
        <div className="text-right min-w-[70px] flex items-center justify-end gap-2">
          <span className="font-bold text-white text-sm">
            ₱{(item.price * quantity).toLocaleString()}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="text-white/40 hover:text-red-400 p-1 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            title="Remove item"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
