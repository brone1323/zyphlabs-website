'use client'
import { useState } from 'react'

type Category = 'all' | 'skincare' | 'fitness' | 'candles' | 'pets'

const PRODUCTS = [
  { id: 1, name: 'Lumina Glow Serum',      category: 'skincare', price: 48, badge: 'Bestseller', icon: '✦' },
  { id: 2, name: 'ProBurn Pre-Workout',    category: 'fitness',  price: 35, badge: 'New',        icon: '⚡' },
  { id: 3, name: 'Ember & Wick Candle',    category: 'candles',  price: 28, badge: '',           icon: '◈' },
  { id: 4, name: 'PawFresh Shampoo',       category: 'pets',     price: 22, badge: '',           icon: '❋' },
  { id: 5, name: 'Lumina Day Cream',       category: 'skincare', price: 52, badge: 'Sale',       icon: '✦' },
  { id: 6, name: 'ForgeFit Bands Set',     category: 'fitness',  price: 29, badge: '',           icon: '⚡' },
  { id: 7, name: 'Black Walnut Candle',    category: 'candles',  price: 34, badge: 'Limited',   icon: '◈' },
  { id: 8, name: 'PawFresh Conditioner',   category: 'pets',     price: 19, badge: '',           icon: '❋' },
]

const CAT_COLORS: Record<string, string> = {
  skincare: '#f9a8d4',
  fitness:  '#86efac',
  candles:  '#fcd34d',
  pets:     '#93c5fd',
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',      label: 'All Products' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'fitness',  label: 'Fitness' },
  { id: 'candles',  label: 'Candles' },
  { id: 'pets',     label: 'Pets' },
]

export default function EcommerceDemo() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [cart, setCart] = useState<number[]>([])
  const [justAdded, setJustAdded] = useState<Record<number, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id])
    setJustAdded(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setJustAdded(prev => ({ ...prev, [id]: false })), 1200)
  }

  const cartTotal = cart.reduce(
    (sum, id) => sum + (PRODUCTS.find(p => p.id === id)?.price ?? 0),
    0
  )

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00cec9] border border-[#00cec9]/30 rounded-full px-4 py-1.5 mb-5">
            Live Store Demo
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            A store that actually sells
          </h2>
          <p className="text-[#8888aa] mt-3 max-w-2xl mx-auto leading-relaxed">
            Browse, filter, and add to cart — this is exactly how your customers will shop.
            Every Zyph Labs store is optimized to convert browsers into buyers.
          </p>
        </div>

        <div className="rounded-2xl border border-[#00cec9]/20 bg-[#0a0a0f] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#00cec9]/10 bg-[#0f0f1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-4 bg-[#1a1a2e] rounded-md px-3 py-1 text-xs text-[#8888aa] font-mono">
              lumina-glow.myshopify.com/collections/all
            </div>
            {/* Cart icon */}
            <button
              onClick={() => setCartOpen(v => !v)}
              className="relative flex items-center gap-1.5 text-sm text-[#8888aa] hover:text-[#00cec9] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00cec9] text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Category tabs */}
          <div className="px-5 py-3 flex gap-2 overflow-x-auto border-b border-[#00cec9]/10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#00cec9] text-black'
                    : 'border border-[#2a2a3e] text-[#8888aa] hover:border-[#00cec9]/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filtered.map(product => {
              const isAdded = justAdded[product.id]
              const catColor = CAT_COLORS[product.category] || '#00cec9'
              return (
                <div
                  key={product.id}
                  className="rounded-xl overflow-hidden border border-[#1a1a2e] hover:border-[#00cec9]/30 transition-all duration-300 bg-[#0f0f1a]"
                >
                  {/* Product image placeholder */}
                  <div
                    className="h-28 flex items-center justify-center relative"
                    style={{ background: `radial-gradient(ellipse at center, ${catColor}20, transparent 70%)` }}
                  >
                    <span className="text-4xl opacity-50" style={{ color: catColor }}>{product.icon}</span>
                    {product.badge && (
                      <span
                        className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${catColor}25`, color: catColor }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-[#8888aa] capitalize mb-1">{product.category}</p>
                    <h3
                      className="text-sm font-semibold text-white leading-tight mb-2.5"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#00cec9]">${product.price}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                          isAdded
                            ? 'bg-[#00cec9] text-black scale-95'
                            : 'bg-[#00cec9]/10 text-[#00cec9] hover:bg-[#00cec9]/20 border border-[#00cec9]/20'
                        }`}
                      >
                        {isAdded ? '✓ Added' : '+ Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cart drawer */}
          {cartOpen && (
            <div className="border-t border-[#00cec9]/10 bg-[#0f0f1a] p-5">
              <h3
                className="text-sm font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>
              {cart.length === 0 ? (
                <p className="text-sm text-[#8888aa]">Your cart is empty — add some products above!</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {Array.from(new Set(cart)).map(id => {
                      const p = PRODUCTS.find(x => x.id === id)!
                      const qty = cart.filter(x => x === id).length
                      return (
                        <div key={id} className="flex items-center justify-between text-sm">
                          <span className="text-[#f0f0ff]">{p.name} × {qty}</span>
                          <span className="text-[#00cec9] font-bold">${(p.price * qty).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold border-t border-[#00cec9]/10 pt-3 mb-4">
                    <span className="text-white">Subtotal</span>
                    <span className="text-[#00cec9] text-base">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full btn-primary text-sm py-3">
                    Proceed to Checkout →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
