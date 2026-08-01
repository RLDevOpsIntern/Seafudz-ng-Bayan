import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'

export interface TableItem {
  id: string
  name: string
  seats: number
  section: string
  status: 'Available' | 'Occupied' | string
  shape: 'square' | 'round' | 'rectangle' | string
  activeOrder?: {
    id: string
    total: number
    itemsCount: number
    cartItems?: Array<{ quantity?: number }>
    status: string
    createdAt?: string
  }
}

const API_BASE_URL = 'http://localhost:5000/api'

// Initial fallback layout tables
const INITIAL_TABLES: TableItem[] = [
  { id: 'Table 1', name: 'Table 1', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 2', name: 'Table 2', seats: 2, section: 'Main Dining', status: 'Available', shape: 'round' },
  { id: 'Table 3', name: 'Table 3', seats: 6, section: 'Main Dining', status: 'Available', shape: 'rectangle' },
  { id: 'Table 4', name: 'Table 4', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 5', name: 'Table 5', seats: 8, section: 'VIP Family Alcove', status: 'Available', shape: 'rectangle' },
  { id: 'Table 6', name: 'Table 6', seats: 4, section: 'VIP Family Alcove', status: 'Available', shape: 'round' },
  { id: 'Table 7', name: 'Table 7', seats: 2, section: 'Alfresco Patio', status: 'Available', shape: 'round' },
  { id: 'Table 8', name: 'Table 8', seats: 4, section: 'Alfresco Patio', status: 'Available', shape: 'square' },
  { id: 'Table 9', name: 'Table 9', seats: 6, section: 'Alfresco Patio', status: 'Available', shape: 'rectangle' },
  { id: 'Table 10', name: 'Table 10', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 11', name: 'Table 11', seats: 2, section: 'Main Dining', status: 'Available', shape: 'round' },
  { id: 'Table 12', name: 'Table 12', seats: 8, section: 'VIP Bilao Party', status: 'Available', shape: 'rectangle' },
]

// Helper for robust table matching
const isTableMatch = (orderTable?: string, tableName?: string, category?: string): boolean => {
  if (!tableName) return false
  const normTable = tableName.toLowerCase().trim()
  const normOrder = (orderTable || '').toLowerCase().trim()
  const normCat = (category || '').toLowerCase().trim()

  return (
    normOrder === normTable ||
    normOrder.includes(normTable) ||
    normCat.includes(normTable)
  )
}

// Visual Diagram Component for Table and Surrounding Chairs
const TableGraphic: React.FC<{ seats: number; shape: string; status: string; name: string; orderStatus?: string }> = ({
  seats,
  shape,
  status,
  name,
  orderStatus,
}) => {
  const isOccupied = status === 'Occupied'
  const isDining = isOccupied && (orderStatus === 'Ready' || orderStatus === 'Served')

  const theme = isDining
    ? {
        table: 'bg-amber-500 text-white border-amber-600 shadow-amber-100',
        chair: 'bg-amber-100 border-amber-400',
      }
    : isOccupied
    ? {
        table: 'bg-rose-600 text-white border-rose-700 shadow-rose-100 animate-pulse',
        chair: 'bg-rose-100 border-rose-400',
      }
    : {
        table: 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-100',
        chair: 'bg-emerald-100 border-emerald-400',
      }

  let topChairs: number
  let bottomChairs: number
  let leftChairs = 0
  let rightChairs = 0

  if (seats <= 2) {
    topChairs = 1
    bottomChairs = 1
  } else if (seats === 4) {
    topChairs = 1
    bottomChairs = 1
    leftChairs = 1
    rightChairs = 1
  } else if (seats === 6) {
    topChairs = 2
    bottomChairs = 2
    leftChairs = 1
    rightChairs = 1
  } else {
    topChairs = 3
    bottomChairs = 3
    leftChairs = 1
    rightChairs = 1
  }

  return (
    <div className="my-2.5 flex flex-col items-center justify-center p-3 bg-[#faf9f6] rounded-2xl border border-neutral-200/60 select-none">
      <div className="relative flex items-center justify-center my-2.5 px-6">
        {/* Top Chairs */}
        {topChairs > 0 && (
          <div className="absolute -top-2 flex gap-3">
            {Array.from({ length: topChairs }).map((_, i) => (
              <div key={i} className={`w-5 h-2 rounded-t-sm border ${theme.chair}`} />
            ))}
          </div>
        )}

        {/* Left Chairs */}
        {leftChairs > 0 && (
          <div className="absolute -left-2 flex flex-col gap-3">
            {Array.from({ length: leftChairs }).map((_, i) => (
              <div key={i} className={`w-2 h-5 rounded-l-sm border ${theme.chair}`} />
            ))}
          </div>
        )}

        {/* Table Top Surface */}
        <div
          className={`flex flex-col items-center justify-center font-black text-xs border shadow-xs transition-all duration-200 ${
            shape === 'round'
              ? 'w-16 h-16 rounded-full'
              : shape === 'rectangle' || seats >= 6
              ? 'w-28 h-14 rounded-xl'
              : 'w-16 h-16 rounded-xl'
          } ${theme.table}`}
        >
          <span>{name}</span>
          <span className="text-[9px] font-medium opacity-85">{seats} Chairs</span>
        </div>

        {/* Right Chairs */}
        {rightChairs > 0 && (
          <div className="absolute -right-2 flex flex-col gap-3">
            {Array.from({ length: rightChairs }).map((_, i) => (
              <div key={i} className={`w-2 h-5 rounded-r-sm border ${theme.chair}`} />
            ))}
          </div>
        )}

        {/* Bottom Chairs */}
        {bottomChairs > 0 && (
          <div className="absolute -bottom-2 flex gap-3">
            {Array.from({ length: bottomChairs }).map((_, i) => (
              <div key={i} className={`w-5 h-2 rounded-b-sm border ${theme.chair}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const TableVisualizer: React.FC = () => {
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES)
  const [selectedSection, setSelectedSection] = useState<string>('All')
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null)

  // Fetch real-time table status directly from Cashier POS active orders
  const fetchTables = async () => {
    let localOrders: Array<{
      id: string
      table: string
      category?: string
      status?: string
      total?: number
      itemsCount?: number
      cartItems?: Array<{ quantity?: number }>
      createdAt?: string
    }> = []
    try {
      localOrders = JSON.parse(localStorage.getItem('seafudz_orders') || '[]')
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch(`${API_BASE_URL}/tables`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.data) && data.data.length > 0) {
          const updated = data.data.map((table: TableItem) => {
            const activeLocalOrder = localOrders.find(
              (o) =>
                isTableMatch(o.table, table.name, o.category) &&
                o.status !== 'Completed' &&
                o.status !== 'Served' &&
                o.status !== 'Cancelled'
            )

            const targetOrder = activeLocalOrder || (
              table.activeOrder &&
              table.activeOrder.status !== 'Completed' &&
              table.activeOrder.status !== 'Served' &&
              table.activeOrder.status !== 'Cancelled'
                ? table.activeOrder
                : null
            )

            if (targetOrder) {
              return {
                ...table,
                status: 'Occupied',
                activeOrder: {
                  id: targetOrder.id,
                  total: targetOrder.total || 0,
                  itemsCount: targetOrder.itemsCount || (targetOrder.cartItems ? targetOrder.cartItems.length : 0),
                  status: targetOrder.status || 'Pending',
                  createdAt: targetOrder.createdAt,
                },
              }
            }

            return {
              ...table,
              status: 'Available',
              activeOrder: undefined,
            }
          })

          setTables(updated)
          return
        }
      }
    } catch (err) {
      console.warn('Backend server unavailable, using local tables:', err)
    }

    // Fallback sync with local Cashier POS orders
    const updated = INITIAL_TABLES.map((table) => {
      const activeLocalOrder = localOrders.find(
        (o) =>
          isTableMatch(o.table, table.name, o.category) &&
          o.status !== 'Completed' &&
          o.status !== 'Served' &&
          o.status !== 'Cancelled'
      )

      if (activeLocalOrder) {
        return {
          ...table,
          status: 'Occupied',
          activeOrder: {
            id: activeLocalOrder.id,
            total: activeLocalOrder.total || 0,
            itemsCount: activeLocalOrder.cartItems ? activeLocalOrder.cartItems.length : 0,
            status: activeLocalOrder.status || 'Pending',
            createdAt: activeLocalOrder.createdAt,
          },
        }
      }

      return {
        ...table,
        status: 'Available',
        activeOrder: undefined,
      }
    })

    setTables(updated)
  }

  // Force-set an occupied table back to Available manually
  const handleMarkAvailable = async (table: TableItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    // Complete/clear active order for this table in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('seafudz_orders') || '[]')
      const updated = existing.map((o: { table: string; category?: string; status?: string }) => {
        if (
          isTableMatch(o.table, table.name, o.category) &&
          o.status !== 'Completed' &&
          o.status !== 'Served' &&
          o.status !== 'Cancelled'
        ) {
          return { ...o, status: 'Completed' }
        }
        return o
      })
      localStorage.setItem('seafudz_orders', JSON.stringify(updated))
      window.dispatchEvent(new Event('seafudz_order_created'))
    } catch {
      /* ignore */
    }

    // Update local table state
    setTables((prev) =>
      prev.map((t) =>
        t.id === table.id
          ? { ...t, status: 'Available', activeOrder: undefined }
          : t
      )
    )

    if (selectedTable?.id === table.id) {
      setSelectedTable((prev) =>
        prev ? { ...prev, status: 'Available', activeOrder: undefined } : null
      )
    }

    try {
      await fetch(`${API_BASE_URL}/tables/${table.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Available' }),
      })
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const initTimer = setTimeout(() => {
      void fetchTables()
    }, 0)
    const interval = setInterval(fetchTables, 1500)
    const handleStorageEvent = () => void fetchTables()
    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('seafudz_order_created', handleStorageEvent)

    return () => {
      clearTimeout(initTimer)
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('seafudz_order_created', handleStorageEvent)
    }
  }, [])

  // Sections filter
  const sections = ['All', 'Main Dining', 'VIP Family Alcove', 'Alfresco Patio']
  const filteredTables = selectedSection === 'All'
    ? tables
    : tables.filter((t) => t.section === selectedSection || t.section.includes(selectedSection))

  const availableCount = tables.filter((t) => t.status === 'Available').length
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length
  const diningCount = tables.filter((t) => t.status === 'Occupied' && (t.activeOrder?.status === 'Ready' || t.activeOrder?.status === 'Served')).length

  return (
    <div className="min-h-screen bg-[#faf9f6] p-3 sm:p-4 lg:p-6 transition-all duration-300 pb-16">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        <Navbar />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white px-5 py-4 rounded-2xl border border-neutral-200/80 shadow-2xs gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-neutral-900 leading-tight">
                Table Floor Plan Visualizer
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Live seating status dynamically driven by Cashier POS orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {availableCount} Available
            </span>
            <span className="bg-rose-50 text-rose-700 font-bold px-3 py-1.5 rounded-full border border-rose-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {occupiedCount - diningCount} Kitchen Cooking
            </span>
            <span className="bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {diningCount} Food Served (Dining)
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                selectedSection === sec
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-100'
              }`}
            >
              {sec === 'All' ? `All Sections (${tables.length})` : sec}
            </button>
          ))}
        </div>

        {/* Floor Plan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTables.map((table) => {
            const isOccupied = table.status === 'Occupied'
            const isDining = isOccupied && (table.activeOrder?.status === 'Ready' || table.activeOrder?.status === 'Served')

            return (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer ${
                  isDining
                    ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20'
                    : isOccupied
                    ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                    : 'border-emerald-300 hover:border-emerald-400'
                }`}
              >
                <div>
                  {/* Table Header */}
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-neutral-900">{table.name}</span>
                      <span className="text-[11px] text-neutral-400 font-semibold">({table.seats} Seats)</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isDining
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : isOccupied
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isDining
                        ? 'Occupied (Dining)'
                        : isOccupied
                        ? 'Occupied (Cooking)'
                        : 'Available'}
                    </span>
                  </div>

                  {/* Section & Shape Label */}
                  <div className="text-xs text-neutral-400 font-medium mb-2 flex items-center justify-between">
                    <span>{table.section}</span>
                    <span className="capitalize text-[11px] text-neutral-500 font-semibold">{table.shape} Layout</span>
                  </div>

                  {/* Visual Table & Chairs Diagram Graphic */}
                  <TableGraphic seats={table.seats} shape={table.shape} status={table.status} name={table.name} orderStatus={table.activeOrder?.status} />

                  {/* Active Cashier POS Order Info if Occupied */}
                  {isOccupied && table.activeOrder ? (
                    <div className={`border rounded-xl p-3 text-xs space-y-1 ${
                      isDining ? 'bg-amber-50 border-amber-200/80' : 'bg-rose-50 border-rose-200/80'
                    }`}>
                      <div className="flex justify-between items-center font-bold text-neutral-900">
                        <span>Order #{table.activeOrder.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          table.activeOrder.status === 'Ready'
                            ? 'bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-rose-200 text-rose-800'
                        }`}>
                          {table.activeOrder.status === 'Ready'
                            ? 'Food Served (Dining)'
                            : table.activeOrder.status === 'Preparing'
                            ? 'Kitchen Cooking'
                            : table.activeOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 font-medium">
                        <span>{table.activeOrder.itemsCount} Items</span>
                        <span className="font-extrabold text-neutral-900 text-xs">
                          ₱{table.activeOrder.total.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleMarkAvailable(table, e)}
                        className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[11px] transition-all cursor-pointer shadow-2xs"
                      >
                        Set Table as Available
                      </button>
                    </div>
                  ) : (
                    <div className="min-h-[44px] flex items-center justify-center text-neutral-400 text-[11px] bg-[#faf9f6] rounded-xl border border-dashed border-neutral-200 font-medium text-center px-2">
                      Available for Cashier POS Order
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 animate-scale-up">
            <div className="p-5 bg-neutral-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{selectedTable.name} Status</h3>
                <p className="text-xs opacity-80 mt-0.5">{selectedTable.section} ({selectedTable.seats} Seats)</p>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm leading-none transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-medium text-neutral-700">
              {/* Visual Diagram inside Modal */}
              <TableGraphic seats={selectedTable.seats} shape={selectedTable.shape} status={selectedTable.status} name={selectedTable.name} orderStatus={selectedTable.activeOrder?.status} />

              <div className="flex justify-between items-center bg-[#faf9f6] p-3 rounded-xl border border-neutral-200/80">
                <span className="text-neutral-500">Live Status</span>
                <span className="font-extrabold text-neutral-900 uppercase">
                  {selectedTable.status === 'Occupied' && selectedTable.activeOrder?.status === 'Ready'
                    ? 'Occupied (Food Served / Dining)'
                    : selectedTable.status === 'Occupied'
                    ? 'Occupied (Kitchen Preparing)'
                    : 'Available'}
                </span>
              </div>

              {selectedTable.activeOrder ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="font-extrabold text-amber-900 text-sm">
                    Active Order #{selectedTable.activeOrder.id}
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Order Stage:</span>
                    <span className="font-extrabold text-amber-800 uppercase">
                      {selectedTable.activeOrder.status === 'Ready' ? 'Food Served (Guests Dining)' : selectedTable.activeOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Count:</span>
                    <span className="font-bold text-neutral-800">{selectedTable.activeOrder.itemsCount} Items</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 pt-1 border-t border-amber-200/60">
                    <span>Total Amount:</span>
                    <span className="font-black text-amber-900 text-sm">₱{selectedTable.activeOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-center font-bold text-xs">
                  This table is currently free & available for guest seating in Cashier POS.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedTable.status === 'Occupied' && (
                  <button
                    onClick={(e) => handleMarkAvailable(selectedTable, e)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    Set Table as Available
                  </button>
                )}
                <button
                  onClick={() => setSelectedTable(null)}
                  className="flex-1 bg-neutral-900 hover:bg-black text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableVisualizer
