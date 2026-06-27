import React from 'react'
import type { CartItem } from './OrderItemRow'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderDetails: {
    table: string
    type: string
    total: number
    cartItems: CartItem[]
  } | null
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 flex flex-col items-center animate-scale-up">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Header */}
        <h2 className="text-xl font-bold text-neutral-800 text-center">Order Confirmed!</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">Order #A123 • {orderDetails.type}</p>

        {/* Location & Details */}
        <div className="bg-neutral-50 rounded-2xl p-4 w-full my-5 border border-neutral-100 space-y-2">
          <div className="flex justify-between text-sm font-semibold text-neutral-500">
            <span>Location</span>
            <span className="text-neutral-800">{orderDetails.table}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-neutral-500">
            <span>Items Ordered</span>
            <span className="text-neutral-800">
              {orderDetails.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-200/50 flex justify-between font-bold text-emerald-600">
            <span>Amount Paid</span>
            <span>₱{Math.round(orderDetails.total).toLocaleString()}</span>
          </div>
        </div>

        {/* Receipts Breakdowns */}
        <div className="w-full max-h-[140px] overflow-y-auto mb-6 pr-1 space-y-1.5 custom-scrollbar border-b border-neutral-100 pb-4">
          {orderDetails.cartItems.map((cartItem) => (
            <div key={cartItem.item.id} className="flex justify-between text-xs text-neutral-600">
              <span className="truncate max-w-[200px]">
                {cartItem.item.name} <span className="font-semibold text-neutral-400">x{cartItem.quantity}</span>
              </span>
              <span className="font-semibold">₱{(cartItem.item.price * cartItem.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* New Order Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#ff7a00] hover:bg-[#e66e00] text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-150 active:scale-99 cursor-pointer text-center text-sm shadow-md"
        >
          New Order
        </button>
      </div>
    </div>
  )
}
