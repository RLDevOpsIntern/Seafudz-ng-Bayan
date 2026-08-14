import React, { useState, useMemo, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { CategoryTabs } from '../components/CategoryTabs'
import { MenuGrid } from '../components/MenuGrid'
import { OrderSummary } from '../components/OrderSummary'
import { SuccessModal } from '../components/SuccessModal'
import { ReceiptModal } from './ReceiptModal'
import type { MenuItem } from '../components/MenuCard'
import type { CartItem } from '../components/OrderItemRow'
import { API_BASE_URL } from '../utils/api'

export const POS: React.FC = () => {
  // State variables
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>(['All Menu'])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Menu')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [tableLocation, setTableLocation] = useState('Table 1')
  const [orderType, setOrderType] = useState('Take Out')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    table: string
    type: string
    total: number
    cartItems: CartItem[]
    cashReceived?: string
    change?: number | null
    paymentMethod?: string
  } | null>(null)

  // Fetch Menu Items & Categories from Express Backend
  const fetchBackendData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [menuRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/menu`),
        fetch(`${API_BASE_URL}/categories`),
      ])

      if (!menuRes.ok) throw new Error('Failed to fetch menu items from backend')

      const menuData = await menuRes.json()
      setMenuItems(menuData.data || [])

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json()
        const catList = ['All Menu', ...catData.data.map((c: { name: string }) => c.name)]
        setCategories(catList)
      }
    } catch (err: unknown) {
      console.error('Backend Menu Fetch Error:', err)
      setError('Could not connect to Backend Server (http://localhost:5000). Please start the Express server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchBackendData()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [cartItems])

  const totalCartPrice = useMemo(() => {
    const rawSubtotal = cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0)
    return Math.round(rawSubtotal * 1.12)
  }, [cartItems])

  // Filter items based on search query and category selection
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All Menu' || item.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [menuItems, searchQuery, selectedCategory])

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((ci) => ci.item.id === item.id)
      if (existing) {
        return prevItems.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [...prevItems, { item, quantity: 1 }]
    })
  }

  const handleIncrement = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
    )
  }

  const handleDecrement = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        )
        .filter((ci) => ci.quantity > 0)
    )
  }

  const handleRemove = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((ci) => ci.item.id !== itemId))
  }

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return

    const rawSubtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
    const totalWithVat = rawSubtotal * 1.12

    setLastOrderDetails({
      table: tableLocation,
      type: orderType,
      total: totalWithVat,
      cartItems: [...cartItems],
    })
    setIsMobileCartOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleCloseSuccessModal = () => {
    setCartItems([])
    setIsSuccessModalOpen(false)
    setLastOrderDetails(null)
  }

  const handleConfirmPayment = async (cashReceived: string, change: number | null, paymentMethod: string) => {
    const rawSubtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
    const vat = rawSubtotal * 0.12
    const total = Math.round(rawSubtotal + vat)

    const newOrderObj = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      table: tableLocation,
      type: orderType,
      status: 'Pending',
      paymentStatus: 'Paid',
      paymentMethod,
      subtotal: rawSubtotal,
      vat: Math.round(vat),
      total,
      createdAt: new Date().toISOString(),
      cartItems: [...cartItems],
    }

    // Save to localStorage for instant client & cross-tab sync
    try {
      const existing = JSON.parse(localStorage.getItem('seafudz_orders') || '[]')
      const updated = [newOrderObj, ...existing]
      localStorage.setItem('seafudz_orders', JSON.stringify(updated))
      window.dispatchEvent(new Event('seafudz_order_created'))
    } catch (e) {
      console.warn('localStorage save error:', e)
    }

    // Also post to Express Backend API
    try {
      await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableLocation,
          table: tableLocation,
          type: orderType,
          cartItems,
          paymentMethod,
        }),
      })
    } catch (err) {
      console.error('Failed to post order to backend API:', err)
    }

    setLastOrderDetails((prev) =>
      prev
        ? {
            ...prev,
            cashReceived,
            change,
            paymentMethod,
          }
        : null
    )
    setIsSuccessModalOpen(false)
    setIsReceiptModalOpen(true)
  }

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false)
    setCartItems([])
    setTableLocation('Table 1')
    setOrderType('Take Out')
    setLastOrderDetails(null)
  }

  return (
    <div className="min-h-screen bg-[#f8f6f4] p-3 sm:p-4 lg:p-4 transition-all duration-300 pb-24 lg:pb-6">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Full-Width Header/Navbar */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Layout Grid: Left Menu Content (3 cols) & Rightmost Order Summary (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          {/* Main Left Content Area */}
          <main className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
            {/* Category Tabs */}
            <CategoryTabs
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {/* Menu Items Grid / Loading / Error */}
            <section className="flex-grow">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-neutral-200/80">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-semibold text-neutral-600">Loading live 100-item menu from Express backend...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-red-50/50 rounded-2xl border border-red-200 text-center">
                  <p className="text-sm font-bold text-red-600 mb-2">⚠️ Backend Connection Warning</p>
                  <p className="text-xs text-neutral-600 max-w-md mb-4 leading-relaxed">{error}</p>
                  <button
                    onClick={fetchBackendData}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
              )}
            </section>
          </main>

          {/* Rightmost Sidebar Summary Area */}
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-6 h-full">
            <OrderSummary
              cartItems={cartItems}
              tableLocation={tableLocation}
              setTableLocation={setTableLocation}
              orderType={orderType}
              setOrderType={setOrderType}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-3 left-3 right-3 lg:hidden z-40">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-between transition-all active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-sm font-medium">View Order</span>
            </div>
            <span className="text-sm font-bold">
              ₱{totalCartPrice.toLocaleString()}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Bottom Slide-Up Drawer Overlay */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden flex flex-col justify-end p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-h-[85vh] h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
            <OrderSummary
              cartItems={cartItems}
              tableLocation={tableLocation}
              setTableLocation={setTableLocation}
              orderType={orderType}
              setOrderType={setOrderType}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
              onConfirmOrder={handleConfirmOrder}
              onClose={() => setIsMobileCartOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Confirmation success popup */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        onConfirm={handleConfirmPayment}
        orderDetails={lastOrderDetails}
      />

      {/* Receipt popup */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        orderDetails={lastOrderDetails}
      />
    </div>
  )
}
export default POS
