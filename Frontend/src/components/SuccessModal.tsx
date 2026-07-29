import React, { useState, useEffect } from 'react'
import type { CartItem } from './OrderItemRow'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (cashReceived: string, change: number | null, paymentMethod: string) => void
  orderDetails: {
    table: string
    type: string
    total: number
    cartItems: CartItem[]
  } | null
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'GCash' | 'Card'>('Cash')
  const [cashReceived, setCashReceived] = useState<string>('')
  const [change, setChange] = useState<number | null>(null)

  const totalAmount = orderDetails ? Math.round(orderDetails.total) : 0

  // Reset inputs when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCashReceived('')
      setChange(null)
      setPaymentMethod('Cash')
    }
  }, [isOpen])

  // Calculate change when cashReceived or totalAmount changes
  useEffect(() => {
    const cash = parseFloat(cashReceived)
    if (!isNaN(cash) && cash >= totalAmount) {
      setChange(cash - totalAmount)
    } else {
      setChange(null)
    }
  }, [cashReceived, totalAmount])

  if (!isOpen || !orderDetails) return null

  const handlePresetClick = (amount: number) => {
    setCashReceived(amount.toString())
  }

  const handleExactChange = () => {
    setCashReceived(totalAmount.toString())
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 flex flex-col relative animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Animated Check Icon */}
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 mx-auto mt-2">
          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Header */}
        <h2 className="text-xl font-bold text-neutral-800 text-center">Order Confirmed!</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-0.5 text-center">Order #A123 • {orderDetails.type}</p>

        {/* Payment Method Tabs */}
        <div className="flex gap-2 bg-neutral-50 p-1 rounded-xl my-4 border border-neutral-100">
          {(['Cash', 'GCash', 'Card'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                paymentMethod === method
                  ? 'bg-[#ff7a00] text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Cash Calculator Container */}
        {paymentMethod === 'Cash' && (
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 mb-4 space-y-3">
            <h3 className="text-xs uppercase font-extrabold text-orange-800 tracking-wider">
              💵 POS Cash Calculator
            </h3>
            
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                  Cash Received
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">₱</span>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-7 pr-3 py-2 border border-neutral-200 rounded-xl text-sm font-bold focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00] outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                  Change Due
                </label>
                <div className={`py-2 px-3 rounded-xl border text-sm font-black ${
                  change !== null 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                }`}>
                  {change !== null ? `₱${Math.round(change).toLocaleString()}` : '₱0'}
                </div>
              </div>
            </div>

            {/* Quick Cash Presets */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase">
                Quick Amount Keys
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={handleExactChange}
                  className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-[#ff7a00] rounded-lg text-xs font-bold text-neutral-600 transition-all hover:bg-orange-50/20 active:scale-95 cursor-pointer"
                >
                  Exact Change
                </button>
                {[100, 200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetClick(amt)}
                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-[#ff7a00] rounded-lg text-xs font-bold text-neutral-600 transition-all hover:bg-orange-50/20 active:scale-95 cursor-pointer"
                  >
                    ₱{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert for Insufficient cash */}
            {cashReceived && change === null && parseFloat(cashReceived) < totalAmount && (
              <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                ⚠️ Cash received is less than total amount (₱{totalAmount.toLocaleString()})
              </p>
            )}
          </div>
        )}

        {/* Location & Details */}
        <div className="bg-neutral-50 rounded-2xl p-4 w-full mb-4 border border-neutral-100 space-y-2">
          <div className="flex justify-between text-sm font-semibold text-neutral-500">
            <span>Location</span>
            <span className="text-neutral-800 font-bold">{orderDetails.table}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-neutral-500">
            <span>Items Ordered</span>
            <span className="text-neutral-800 font-bold">
              {orderDetails.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-200/50 flex justify-between font-bold text-emerald-600">
            <span>Amount Paid</span>
            <span className="text-base font-black">₱{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Receipts Breakdowns */}
        <div className="w-full max-h-[120px] overflow-y-auto mb-5 pr-1 space-y-1.5 custom-scrollbar border-b border-neutral-100 pb-3">
          {orderDetails.cartItems.map((cartItem) => (
            <div key={cartItem.item.id} className="flex justify-between text-xs text-neutral-600">
              <span className="truncate max-w-[200px]">
                {cartItem.item.name} <span className="font-semibold text-neutral-400">x{cartItem.quantity}</span>
              </span>
              <span className="font-semibold text-neutral-700">₱{(cartItem.item.price * cartItem.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold py-3.5 px-4 rounded-2xl transition-all duration-150 active:scale-99 cursor-pointer text-center text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(cashReceived, change, paymentMethod)}
            disabled={paymentMethod === 'Cash' && cashReceived !== '' && parseFloat(cashReceived) < totalAmount}
            className={`flex-2 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-150 active:scale-99 cursor-pointer text-center text-sm shadow-md ${
              paymentMethod === 'Cash' && cashReceived !== '' && parseFloat(cashReceived) < totalAmount
                ? 'bg-neutral-300 cursor-not-allowed shadow-none'
                : 'bg-[#ff7a00] hover:bg-[#e66e00]'
            }`}
          >
            Confirm & Print
          </button>
        </div>
      </div>
    </div>
  )
}
