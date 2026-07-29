import React, { useState, useEffect } from 'react'

interface RiderOrder {
  id: string
  ref: string
  customer: string
  phone: string
  address: string
  items: string[]
  total: number
  status: 'preparing' | 'ready' | 'out' | 'delivered'
}

const INITIAL_RIDER_ORDERS: RiderOrder[] = [
  {
    id: 'ro-1',
    ref: 'ORD-A178',
    customer: 'Maria Santos',
    phone: '0917-123-4567',
    address: '123 Ocean St., Brgy. San Roque, Manila',
    items: ['Seafood Bilao x2', 'Cajun Mix x1'],
    total: 6800,
    status: 'ready'
  },
  {
    id: 'ro-2',
    ref: 'ORD-B290',
    customer: 'Jose Rizal',
    phone: '0922-888-9900',
    address: '45 Bagumbayan St., Calamba, Laguna',
    items: ['Crab Bucket x1', 'Garlic Butter Shrimp x2'],
    total: 4500,
    status: 'ready'
  },
  {
    id: 'ro-3',
    ref: 'ORD-C551',
    customer: 'Leonora Rivera',
    phone: '0915-777-6655',
    address: '88 Diamond Rd, Ortigas Center, Pasig',
    items: ['Spicy Shrimp x2', 'Fresh Juice x4'],
    total: 3400,
    status: 'preparing'
  }
]

export const RideRoleDemo: React.FC = () => {
  const [orders, setOrders] = useState<RiderOrder[]>(INITIAL_RIDER_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState<RiderOrder | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Simulate new order arrival every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newRef = `ORD-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 900) + 100}`
      const newOrder: RiderOrder = {
        id: `ro-${Date.now()}`,
        ref: newRef,
        customer: ['Juan dela Cruz', 'Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini'][Math.floor(Math.random() * 4)],
        phone: `09${Math.floor(Math.random() * 900000000 + 100000000)}`,
        address: `${Math.floor(Math.random() * 100) + 1} Pinaglabanan St., San Juan, Manila`,
        items: ['Seafood Bilao x1', 'Fresh Juice x2'],
        total: 2500,
        status: 'ready'
      }

      setOrders(prev => [newOrder, ...prev])
      setNotification(`🛵 New Delivery Order Assigned! ${newRef}`)
    }, 25000)

    return () => clearInterval(interval)
  }, [])

  const handleStartDelivery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: 'out' } : o)
    )
    // Update selected order in view if open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: 'out' } : null)
    }
    setNotification('🚀 Delivery Started! Status updated to "Out for Delivery"')
  }

  const handleMarkAsDelivered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: 'delivered' } : o)
    )
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: 'delivered' } : null)
    }
    setNotification('✅ Order successfully delivered!')
  }

  return (
    <div className="min-h-screen bg-[#f0ece8] text-[#2c1810] font-sans pb-12">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-[#a08070] text-white px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/20">
            <img 
              src="https://picsum.photos/60/60?random=99" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Seafood Palace</h1>
            <p className="text-xs text-white/80 font-medium">Rider Portal</p>
          </div>
        </div>
        <div className="text-2xl cursor-pointer hover:opacity-85">👤</div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>🚀</span> My Delivery Orders
        </h2>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0d6cf] cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-[#ff7b00] text-lg">{order.ref}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    order.status === 'preparing'
                      ? 'bg-amber-100 text-amber-800'
                      : order.status === 'ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'out'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {order.status === 'preparing' && 'Preparing'}
                    {order.status === 'ready' && 'Ready for Delivery'}
                    {order.status === 'out' && 'Out for Delivery'}
                    {order.status === 'delivered' && 'Delivered'}
                  </span>
                </div>

                <div className="mb-4 text-sm leading-relaxed">
                  <strong className="text-[#2c1810] text-base">{order.customer}</strong>
                  <div className="text-neutral-500">{order.phone}</div>
                  <div className="text-neutral-500 font-medium text-xs mt-1 truncate">{order.address}</div>
                </div>

                <div className="border-t border-dashed border-[#e0d6cf] pt-4 mb-4 text-sm">
                  <strong className="text-xs uppercase text-neutral-400 tracking-wider">Items</strong>
                  <ul className="mt-1 space-y-0.5 text-neutral-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-neutral-400 font-semibold">Total Price:</span>
                  <span className="font-extrabold text-lg text-[#2c1810]">₱{order.total.toLocaleString()}</span>
                </div>

                {order.status === 'ready' && (
                  <button
                    onClick={(e) => handleStartDelivery(order.id, e)}
                    className="w-full bg-[#ff7b00] hover:bg-[#e66f00] text-white py-3 px-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm"
                  >
                    🚀 Out for Delivery
                  </button>
                )}

                {order.status === 'out' && (
                  <button
                    onClick={(e) => handleMarkAsDelivered(order.id, e)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm"
                  >
                    ✅ Mark as Delivered
                  </button>
                )}

                {order.status === 'delivered' && (
                  <div className="text-center py-2.5 bg-neutral-100 rounded-xl text-neutral-500 font-bold text-sm border border-neutral-200">
                    🎉 Completed
                  </div>
                )}

                {order.status === 'preparing' && (
                  <div className="text-center py-2.5 bg-amber-50 rounded-xl text-amber-600 font-bold text-sm border border-amber-100">
                    ⏳ Kitchen Preparing...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#a08070] text-white p-6 relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-extrabold text-xl tracking-wider text-[#ffd099]">{selectedOrder.ref}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  {selectedOrder.status}
                </span>
              </div>
              <h3 className="text-lg font-bold">{selectedOrder.customer}</h3>
              <p className="text-sm text-white/85">{selectedOrder.phone}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-1.5">Delivery Address</h4>
                <p className="text-sm bg-neutral-50 p-4 rounded-xl border border-neutral-200 leading-relaxed text-[#2c1810]">
                  {selectedOrder.address}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-2">Order Items</h4>
                <div className="bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 divide-y divide-neutral-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 text-sm flex justify-between font-medium text-neutral-700">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e0d6cf] pt-4">
                <span className="text-neutral-500 font-semibold text-sm">Total Amount</span>
                <span className="text-2xl font-black text-[#ff7b00]">₱{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-neutral-50 px-6 py-5 border-t border-neutral-100 flex gap-3">
              {selectedOrder.status === 'ready' && (
                <button
                  onClick={(e) => handleStartDelivery(selectedOrder.id, e)}
                  className="w-full bg-[#ff7b00] hover:bg-[#e66f00] text-white py-3.5 rounded-xl font-bold shadow-lg transition-all"
                >
                  🚀 Start Delivery
                </button>
              )}
              {selectedOrder.status === 'out' && (
                <button
                  onClick={(e) => handleMarkAsDelivered(selectedOrder.id, e)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all"
                >
                  ✅ Complete Delivery
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-neutral-200 hover:bg-neutral-300 text-[#2c1810] py-3.5 rounded-xl font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-[#28a745] text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-5 duration-300 max-w-sm border border-white/10 flex items-center gap-3">
          <span className="text-xl">🛵</span>
          <p className="font-semibold text-sm leading-snug">{notification}</p>
        </div>
      )}
    </div>
  )
}
