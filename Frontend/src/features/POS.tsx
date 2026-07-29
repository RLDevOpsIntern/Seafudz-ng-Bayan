import React, { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { CategoryTabs } from '../components/CategoryTabs'
import { MenuGrid } from '../components/MenuGrid'
import { OrderSummary } from '../components/OrderSummary'
import { SuccessModal } from '../components/SuccessModal'
import { ReceiptModal } from './ReceiptModal'
import type { MenuItem } from '../components/MenuCard'
import type { CartItem } from '../components/OrderItemRow'

// Import assets
import seafoodBilaoImg from '../assets/seafood_bilao.png'
import seafoodCajunImg from '../assets/seafood_cajun.png'
import spicyShrimpImg from '../assets/spicy_shrimp.png'
import crabBucketImg from '../assets/crab_bucket.png'
import garlicButterShrimpImg from '../assets/garlic_butter_shrimp.png'
import freshJuiceImg from '../assets/fresh_juice.png'

// Initial list of dishes matching the screenshot
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Seafood Bilao',
    description: 'Shrimp, crab, clams',
    price: 2000,
    category: 'Seafood',
    image: seafoodBilaoImg,
  },
  {
    id: 'm2',
    name: 'Seafood Cajun Mix',
    description: 'Cajun Seafood Boil',
    price: 1800,
    category: 'Seafood',
    image: seafoodCajunImg,
  },
  {
    id: 'm3',
    name: 'Spicy Shrimp',
    description: 'Garlic Butter Shrimp Mix',
    price: 1200,
    category: 'Shrimp',
    image: spicyShrimpImg,
  },
  {
    id: 'm4',
    name: 'Crab Bucket',
    description: 'Yang Chow Fried Rice w/ Steamed',
    price: 2500,
    category: 'Crab',
    image: crabBucketImg,
  },
  {
    id: 'm5',
    name: 'Garlic Butter Shrimp',
    description: 'Garlic Boy with Steamed',
    price: 1000,
    category: 'Shrimp',
    image: garlicButterShrimpImg,
  },
  {
    id: 'm6',
    name: 'Fresh Juice',
    description: 'Purple Fruit Juicy / Mixed Fruit Drinks',
    price: 250,
    category: 'Drinks',
    image: freshJuiceImg,
  },
]

export const POS: React.FC = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Menu')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [tableLocation, setTableLocation] = useState('Table 1')
  const [orderType, setOrderType] = useState('Take Out')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    table: string
    type: string
    total: number
    cartItems: CartItem[]
    cashReceived?: string
    change?: number | null
    paymentMethod?: string
  } | null>(null)

  // Filter items based on search query and category selection
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All Menu' || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

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
    setIsSuccessModalOpen(true)
  }

  const handleCloseSuccessModal = () => {
    setCartItems([])
    setIsSuccessModalOpen(false)
    setLastOrderDetails(null)
  }

  const handleConfirmPayment = (cashReceived: string, change: number | null, paymentMethod: string) => {
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
    setLastOrderDetails(null)
  }

  return (
    <div className="min-h-screen bg-[#f8f6f4] p-4 lg:p-6 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Main Content Area (3 Columns wide on large devices) */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          {/* Header/Navbar */}
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Category Tabs */}
          <CategoryTabs
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Menu Items Grid */}
          <section className="flex-grow">
            <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
          </section>
        </main>

        {/* Sidebar Summary Area (1 Column wide) */}
        <div className="lg:col-span-1 h-full min-h-[500px]">
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
