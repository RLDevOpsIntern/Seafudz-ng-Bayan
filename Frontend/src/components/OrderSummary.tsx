import React from 'react'
import { OrderItemRow } from './OrderItemRow'
import type { CartItem } from './OrderItemRow'

interface OrderSummaryProps {
  cartItems: CartItem[]
  tableLocation: string
  setTableLocation: (table: string) => void
  orderType: string
  setOrderType: (type: string) => void
  onIncrement: (itemId: string) => void
  onDecrement: (itemId: string) => void
  onRemove: (itemId: string) => void
  onConfirmOrder: () => void
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  tableLocation,
  setTableLocation,
  orderType,
  setOrderType,
  onIncrement,
  onDecrement,
  onRemove,
  onConfirmOrder,
}) => {
  // Calculations
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0)
  const vatAmount = rawSubtotal * 0.12 // 12% VAT
  const total = rawSubtotal + vatAmount

  return (
    <aside className="bg-[#907366] rounded-3xl p-6 text-white flex flex-col h-full shadow-lg border border-[#7f6356]">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-xl font-bold tracking-wide">Order Summary</h2>
        <p className="text-xs text-amber-100/60 font-semibold mt-1">Order #A123</p>
      </div>

      {/* Selectors */}
      <div className="space-y-4 mb-6 flex-shrink-0">
        <div>
          <label className="block text-xs font-bold text-amber-100/80 uppercase tracking-wider mb-2">
            Table location
          </label>
          <div className="relative">
            <select
              value={tableLocation}
              onChange={(e) => setTableLocation(e.target.value)}
              className="w-full bg-white text-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold appearance-none border border-neutral-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                <option key={t} value={`Table ${t}`}>
                  Table {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-100/80 uppercase tracking-wider mb-2">
            Order Type
          </label>
          <div className="relative">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-white text-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold appearance-none border border-neutral-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              <option value="Take Out">Take Out</option>
              <option value="Dine In">Dine In</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items List */}
      <div className="flex-1 flex flex-col min-h-0 mb-6">
        <label className="block text-xs font-bold text-amber-100/80 uppercase tracking-wider mb-2 flex-shrink-0">
          Order Items
        </label>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center px-4 py-12">
              <p className="text-sm text-amber-100/40 font-semibold select-none">No items selected.</p>
            </div>
          ) : (
            cartItems.map((cartItem) => (
              <OrderItemRow
                key={cartItem.item.id}
                cartItem={cartItem}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>

      {/* Pricing Summary Card & Confirm Button */}
      <div className="space-y-4 flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 text-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-sm font-semibold text-neutral-500 mb-1">
            <span>Subtotal</span>
            <span>₱{rawSubtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold text-neutral-500 pb-3 border-b border-neutral-100 mb-3">
            <span>VAT (12%)</span>
            <span>₱{Math.round(vatAmount).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between font-bold text-emerald-600 text-lg">
            <span>Total</span>
            <span>₱{Math.round(total).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onConfirmOrder}
          disabled={cartItems.length === 0}
          className="w-full bg-[#ff7a00] hover:bg-[#e66e00] disabled:bg-neutral-500/30 disabled:text-white/40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer text-center text-[15px]"
        >
          Confirm Order
        </button>
      </div>
    </aside>
  )
}
