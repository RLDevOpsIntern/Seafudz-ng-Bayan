import React from 'react'

interface CartItem {
  item: {
    id: string
    name: string
    price: number
  }
  quantity: number
}

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  orderDetails: {
    table: string
    type: string
    total: number
    cartItems: CartItem[]
    cashReceived?: string
    change?: number | null
    paymentMethod?: string
  } | null
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null

  const { table, type, total, cartItems, cashReceived, change, paymentMethod = 'Cash' } = orderDetails

  const rawSubtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
  const vatAmount = rawSubtotal * 0.12
  const formattedTotal = Math.round(total)
  const dateStr = new Date().toLocaleString()

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const receiptHtml = document.getElementById('thermal-receipt-content')?.innerHTML || ''
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                padding: 10px;
                background: white;
                color: #000;
                width: 280px;
                margin: 0 auto;
              }
              .center { text-align: center; }
              .right { text-align: right; }
              .bold { font-weight: bold; }
              .divider { border-top: 1px dashed #000; margin: 8px 0; }
              .row { display: flex; justify-content: space-between; font-size: 13px; margin: 3px 0; }
              .flex-grow { flex-grow: 1; }
            </style>
          </head>
          <body>
            ${receiptHtml}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
    // Automatically close receipt modal & reset POS order summary
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#e4dfda] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-300 flex flex-col relative animate-scale-up max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-900 hover:bg-white/40 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer z-10"
          aria-label="Close receipt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <h3 className="text-center font-black text-neutral-800 tracking-wider mb-4 flex items-center justify-center text-base">
          PRINT PREVIEW
        </h3>

        {/* Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto mb-6 bg-white p-6 rounded-2xl shadow-inner border border-neutral-300/60 flex flex-col items-center">
          {/* Thermal Receipt Body */}
          <div 
            id="thermal-receipt-content" 
            className="w-full max-w-[280px] bg-white text-[#2c1810] font-mono text-xs select-none p-2"
          >
            {/* Header */}
            <div className="text-center space-y-1 mb-3">
              <div className="text-sm font-black tracking-widest uppercase">Seafood ng Bayan</div>
              <div className="text-[10px] text-neutral-500 font-semibold">RESTAURANT & GRILL</div>
              <div className="text-[9px] text-neutral-400 font-medium">Cavite City, Philippines</div>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-2"></div>

            {/* Order Meta */}
            <div className="space-y-1 text-[11px] text-neutral-600 font-bold">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-neutral-800">{table}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-neutral-800">{type}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="text-neutral-800 text-[10px]">{dateStr}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-2"></div>

            {/* Item Headers */}
            <div className="flex justify-between text-[10px] font-extrabold text-neutral-400 mb-1">
              <span className="w-[55%]">ITEM</span>
              <span className="w-[15%] text-center">QTY</span>
              <span className="w-[30%] text-right">PRICE</span>
            </div>

            {/* Items List */}
            <div className="space-y-1.5 py-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] font-semibold text-neutral-700 leading-tight">
                  <span className="w-[55%] truncate">{item.item.name}</span>
                  <span className="w-[15%] text-center text-neutral-400">x{item.quantity}</span>
                  <span className="w-[30%] text-right text-neutral-800">
                    ₱{(item.item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-neutral-300 my-2"></div>

            {/* Calculations */}
            <div className="space-y-1 text-[11px] font-bold text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-neutral-800">₱{Math.round(rawSubtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (12%)</span>
                <span className="text-neutral-800">₱{Math.round(vatAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#ff7a00] pt-1">
                <span>TOTAL DUE</span>
                <span>₱{formattedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-2"></div>

            {/* Payment Details */}
            <div className="space-y-1 text-[11px] font-bold text-neutral-600">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="text-neutral-800">{paymentMethod}</span>
              </div>
              {paymentMethod === 'Cash' && cashReceived && (
                <>
                  <div className="flex justify-between">
                    <span>Cash Received:</span>
                    <span className="text-neutral-800">₱{parseFloat(cashReceived).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-black text-emerald-600">
                    <span>Change Due:</span>
                    <span>₱{change ? Math.round(change).toLocaleString() : '0'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-dashed border-neutral-300 my-2"></div>

            {/* Footer message */}
            <div className="text-center text-[10px] text-neutral-400 font-bold space-y-0.5 mt-2">
              <div>Thank you for dining with us!</div>
              <div>Please come again!</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 font-bold py-3.5 px-4 rounded-xl transition-all duration-150 active:scale-99 cursor-pointer text-center text-sm shadow-sm"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 bg-[#ff7a00] hover:bg-[#e66e00] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-150 active:scale-99 cursor-pointer text-center text-sm shadow-md flex items-center justify-center gap-2"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
export default ReceiptModal
