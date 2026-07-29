import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'

interface OrderItem {
  name: string
  quantity: number
}

interface KitchenOrder {
  id: string
  queue: string
  type: 'blue' | 'orange' // blue = Dine In, orange = Take Out
  category: string
  status: 'waiting' | 'preparing' | 'completed'
  items: OrderItem[]
  notes: string
  startTime: number | null // timestamp when preparation started
  completedTimeElapsed?: string // stored prep time string after completion
}

// Initial mock kitchen orders based on dishes in the POS system
const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: 'b1',
    queue: 'A123',
    type: 'blue',
    category: 'Dine In - Table 1',
    status: 'waiting',
    items: [
      { name: 'Spicy Shrimp', quantity: 2 },
      { name: 'Fresh Juice', quantity: 3 }
    ],
    notes: 'Make it extra spicy, please.',
    startTime: null,
  },
  {
    id: 'b2',
    queue: 'A124',
    type: 'blue',
    category: 'Dine In - Table 2',
    status: 'waiting',
    items: [
      { name: 'Seafood Bilao', quantity: 1 },
      { name: 'Fresh Juice', quantity: 1 }
    ],
    notes: 'No ice in the juice.',
    startTime: null,
  },
  {
    id: 'b3',
    queue: 'A125',
    type: 'blue',
    category: 'Dine In - Table 5',
    status: 'waiting',
    items: [
      { name: 'Garlic Butter Shrimp', quantity: 1 },
      { name: 'Spicy Shrimp', quantity: 1 }
    ],
    notes: '',
    startTime: null,
  },
  {
    id: 'o1',
    queue: 'T456',
    type: 'orange',
    category: 'To be Delivered (Take-Out)',
    status: 'waiting',
    items: [
      { name: 'Seafood Cajun Mix', quantity: 1 },
      { name: 'Crab Bucket', quantity: 1 }
    ],
    notes: 'Include extra napkins and plastic utensils.',
    startTime: null,
  },
  {
    id: 'o2',
    queue: 'T457',
    type: 'orange',
    category: 'To be Delivered (Take-Out)',
    status: 'waiting',
    items: [
      { name: 'Fresh Juice', quantity: 4 }
    ],
    notes: 'Separated cups, wrap nicely.',
    startTime: null,
  }
]

export const KitchenMode: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [now, setNow] = useState<number>(Date.now())

  // Keep a live ticker going so we can calculate elapsed seconds in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)

  // Helper to format elapsed time
  const getPrepTimeDisplay = (order: KitchenOrder): string => {
    if (order.status === 'waiting') {
      return 'Waiting'
    }
    if (order.status === 'completed') {
      return order.completedTimeElapsed || '0:00sec'
    }
    if (order.status === 'preparing' && order.startTime) {
      const elapsedSeconds = Math.floor((now - order.startTime) / 1000)
      const mins = Math.floor(elapsedSeconds / 60)
      const secs = elapsedSeconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}sec`
    }
    return '--'
  }

  // Update order status handler
  const updateOrderStatus = (id: string, newStatus: 'preparing' | 'completed') => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== id) return order

        if (newStatus === 'preparing') {
          return {
            ...order,
            status: 'preparing',
            startTime: Date.now(),
          }
        }

        if (newStatus === 'completed') {
          // Calculate final prep time
          let finalTime = '0:00sec'
          if (order.startTime) {
            const elapsedSeconds = Math.floor((Date.now() - order.startTime) / 1000)
            const mins = Math.floor(elapsedSeconds / 60)
            const secs = elapsedSeconds % 60
            finalTime = `${mins}:${secs.toString().padStart(2, '0')}sec`
          }
          return {
            ...order,
            status: 'completed',
            completedTimeElapsed: finalTime,
          }
        }

        return order
      })
    )
  }

  const handleStatusFromModal = (newStatus: 'preparing' | 'completed') => {
    if (selectedOrderId) {
      updateOrderStatus(selectedOrderId, newStatus)
      setSelectedOrderId(null)
    }
  }

  // Filter orders by type
  const dineInOrders = orders.filter((o) => o.type === 'blue' && o.status !== 'completed')
  const takeOutOrders = orders.filter((o) => o.type === 'orange' && o.status !== 'completed')
  const completedOrders = orders.filter((o) => o.status === 'completed')

  return (
    <div className="min-h-screen bg-[#f8f6f4] p-4 lg:p-6 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        {/* Reuse the shared Navbar. Under Kitchen Mode, we omit search props to trigger the kitchen indicator */}
        <Navbar />

        {/* Dashboard Grid split into Active Orders and Completed Log */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
          
          {/* Main Kitchen Board (3/4 width on desktop) */}
          <main className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Columns Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dine-In Column */}
              <section className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
                    Dine-in Orders
                  </h2>
                  <span className="bg-blue-50 text-blue-600 font-bold text-xs px-2.5 py-1 rounded-full">
                    {dineInOrders.length} Active
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  {dineInOrders.length === 0 ? (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-neutral-400 select-none">
                      <span className="text-3xl mb-2">🍽️</span>
                      <p className="text-sm font-semibold">No active dine-in orders</p>
                    </div>
                  ) : (
                    dineInOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className="bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl p-4 border border-neutral-100 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-bold text-neutral-800 text-[15px]">Order #{order.queue}</span>
                            <div className="text-xs text-neutral-400 font-semibold mt-0.5">{order.category}</div>
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'preparing' 
                              ? 'bg-amber-100 text-amber-700 animate-pulse' 
                              : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-1.5 py-2.5 border-t border-b border-neutral-200/60 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                              <span>{item.name}</span>
                              <span className="bg-neutral-200/80 text-neutral-800 px-2 py-0.5 rounded-md text-xs font-bold">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg font-medium mb-3 italic">
                            💡 {order.notes}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-400 font-semibold">Timer:</span>
                          <span className={`font-bold text-sm ${
                            order.status === 'preparing' ? 'text-red-500' : 'text-neutral-500'
                          }`}>
                            {getPrepTimeDisplay(order)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Take-Out Column */}
              <section className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                    Take-Out / Delivery
                  </h2>
                  <span className="bg-amber-50 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-full">
                    {takeOutOrders.length} Active
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  {takeOutOrders.length === 0 ? (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-neutral-400 select-none">
                      <span className="text-3xl mb-2">🥡</span>
                      <p className="text-sm font-semibold">No active take-out orders</p>
                    </div>
                  ) : (
                    takeOutOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className="bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl p-4 border border-neutral-100 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-bold text-neutral-800 text-[15px]">Order #{order.queue}</span>
                            <div className="text-xs text-neutral-400 font-semibold mt-0.5">{order.category}</div>
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'preparing' 
                              ? 'bg-amber-100 text-amber-700 animate-pulse' 
                              : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-1.5 py-2.5 border-t border-b border-neutral-200/60 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-semibold text-neutral-700">
                              <span>{item.name}</span>
                              <span className="bg-neutral-200/80 text-neutral-800 px-2 py-0.5 rounded-md text-xs font-bold">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg font-medium mb-3 italic">
                            💡 {order.notes}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-400 font-semibold">Timer:</span>
                          <span className={`font-bold text-sm ${
                            order.status === 'preparing' ? 'text-red-500' : 'text-neutral-500'
                          }`}>
                            {getPrepTimeDisplay(order)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

            </div>
          </main>

          {/* Completed Orders Sidebar (1/4 width on desktop) */}
          <aside className="xl:col-span-1 bg-[#907366] text-white rounded-3xl p-6 shadow-md border border-[#7f6356] flex flex-col min-h-[500px]">
            <div className="pb-4 border-b border-white/20 mb-6 flex-shrink-0">
              <h2 className="text-lg font-bold tracking-wide flex items-center gap-2">
                <span>✅</span>
                Completed Log
              </h2>
              <p className="text-xs text-amber-100/60 font-semibold mt-1">Ready for pickup / serving</p>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {completedOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-amber-100/40 select-none">
                  <span className="text-2xl mb-2">⏳</span>
                  <p className="text-sm font-medium">No completed orders yet</p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/10 rounded-2xl p-4 border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-amber-50">Order #{order.queue}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Ready
                      </span>
                    </div>
                    <p className="text-xs text-amber-100/70 font-semibold mb-2">{order.category}</p>

                    <div className="space-y-1 pb-2 border-b border-white/10 mb-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-amber-100/90 font-medium">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-amber-100/60 font-semibold">
                      <span>Total Prep Time:</span>
                      <span className="text-emerald-300 font-bold">{order.completedTimeElapsed}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* Full Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`p-6 text-white flex justify-between items-center ${
              selectedOrder.type === 'blue' ? 'bg-blue-600' : 'bg-orange-500'
            }`}>
              <div>
                <h3 className="text-xl font-bold">Order #{selectedOrder.queue}</h3>
                <p className="text-xs font-semibold opacity-90 mt-0.5">{selectedOrder.category}</p>
              </div>
              <button 
                onClick={() => setSelectedOrderId(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-lg leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Order Items</h4>
                <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4 divide-y divide-neutral-200/60">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 font-semibold text-neutral-800 text-sm">
                      <span>{item.name}</span>
                      <span className="bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-md text-xs font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">Special Requests / Notes</h4>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-900 font-medium italic">
                  {selectedOrder.notes || 'No special requests/notes for this order.'}
                </div>
              </div>

              {/* Prep Timer */}
              <div className="flex justify-between items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                <span className="text-sm font-semibold text-neutral-500">Preparation Time</span>
                <span className={`text-base font-bold ${
                  selectedOrder.status === 'preparing' ? 'text-red-500' : 'text-neutral-500'
                }`}>
                  {getPrepTimeDisplay(selectedOrder)}
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => handleStatusFromModal('preparing')}
                  disabled={selectedOrder.status === 'preparing'}
                  className="w-full bg-[#ff7a00] hover:bg-[#e66e00] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all duration-150 cursor-pointer shadow-xs text-sm"
                >
                  Start Preparing
                </button>
                <button
                  onClick={() => handleStatusFromModal('completed')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-150 cursor-pointer shadow-xs text-sm"
                >
                  Complete Order
                </button>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold py-3 rounded-xl transition-all duration-150 cursor-pointer text-sm"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default KitchenMode
