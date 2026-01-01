'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Package, Tags, ShoppingBag, Images, Users2, Boxes, LogOut, Sun, Moon, Sparkles, ChevronLeft, ChevronRight, Video, ChevronDown, Gift, GripVertical, Bell, Mail, Settings as SettingsIcon, HelpCircle } from 'lucide-react'
import AdminChatWidget from '@/components/admin/admin-chat-widget'
import AdminHelpModal from '@/components/admin/AdminHelpModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [isResizing, setIsResizing] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['products'])
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.isRead).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const lsAuth = localStorage.getItem('admin-auth')
    if (lsAuth !== '1') {
      router.push('/sara-admin')
      return
    }
  }, [router])

  // Initialize theme immediately to prevent flash
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme')
    if (savedTheme) {
      const shouldDark = savedTheme === 'dark'
      setIsDark(shouldDark)
      if (shouldDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
      localStorage.setItem('admin-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    
    // Disable all transitions temporarily
    document.documentElement.classList.add('theme-changing')
    
    setIsDark(next)
    // Apply theme instantly
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('admin-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('admin-theme', 'light')
    }
    
    // Re-enable transitions after theme change
    setTimeout(() => {
      document.documentElement.classList.remove('theme-changing')
    }, 50)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      localStorage.removeItem('admin-auth')
      router.push('/sara-admin')
    } finally {
      setLoggingOut(false)
    }
  }

  // Check if a path is a product submenu item
  const isProductSubmenu = (path: string) => {
    return path.includes('/collections') || 
           path.includes('/categories') || 
           (path.includes('/products') && path !== '/sara-admin/dashboard/products') ||
           path.includes('/inventory')
  }

  // Check if a path is an order submenu item
  const isOrderSubmenu = (path: string) => {
    return path.includes('/custom-designs') || 
           (path.includes('/orders') && path !== '/sara-admin/dashboard/orders')
  }
  
  // Check if a submenu link is active (handles query params)
  const isSubmenuActive = (href: string, path: string) => {
    const hrefPath = href.split('?')[0]
    return path === hrefPath || path.startsWith(hrefPath + '/')
  }

  // Auto-expand menus if on a submenu
  useEffect(() => {
    const newExpanded = [...expandedMenus]
    let changed = false

    if (isProductSubmenu(pathname) && !newExpanded.includes('products')) {
      newExpanded.push('products')
      changed = true
    }
    
    if (isOrderSubmenu(pathname) && !newExpanded.includes('orders')) {
      newExpanded.push('orders')
      changed = true
    }

    if (changed) {
      setExpandedMenus(newExpanded)
    }
  }, [pathname, expandedMenus])

  const nav = [
    { name: 'Dashboard', href: '/sara-admin/dashboard', icon: Home },
    { 
      name: 'Products', 
      href: '/sara-admin/dashboard/products', 
      icon: Package,
      submenu: [
        { name: 'Collections', href: '/sara-admin/dashboard/collections', icon: Boxes },
        { name: 'Categories', href: '/sara-admin/dashboard/categories', icon: Tags },
        { name: 'Inventory & Prices', href: '/sara-admin/dashboard/inventory', icon: Boxes },
      ]
    },
    { 
      name: 'Orders', 
      href: '/sara-admin/dashboard/orders', 
      icon: ShoppingBag,
      submenu: [
        { name: 'Order History', href: '/sara-admin/dashboard/orders', icon: ShoppingBag },
        { name: 'Custom Designs', href: '/sara-admin/dashboard/custom-designs', icon: Sparkles },
      ]
    },
    { name: 'Gallery Upload', href: '/sara-admin/dashboard/gallery-upload', icon: Images },
    { name: 'Customers', href: '/sara-admin/dashboard/customers', icon: Users2 },
    { name: 'Customer Videos', href: '/sara-admin/dashboard/customer-videos', icon: Video },
    { name: 'Email & Marketing', href: '/sara-admin/dashboard/marketing', icon: Mail },
    { name: 'Settings', href: '/sara-admin/dashboard/settings', icon: SettingsIcon },
  ]

  const toggleMenu = (menuName: string) => {
    if (expandedMenus.includes(menuName)) {
      setExpandedMenus(expandedMenus.filter(m => m !== menuName))
    } else {
      setExpandedMenus([...expandedMenus, menuName])
    }
  }

  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.min(Math.max(e.clientX, 200), 400)
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      <div className="flex">
        {/* Sidebar - Fixed height, always visible */}
        <aside 
          ref={sidebarRef}
          className={`hidden md:flex h-screen fixed top-0 left-0 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex-col shadow-lg`}
          style={{ 
            width: sidebarCollapsed ? '80px' : `${sidebarWidth}px`,
            transition: 'width 0.2s ease'
          }}
        >
          {/* Header */}
          <div className={`h-14 px-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}>
            {!sidebarCollapsed && (
              <>
                <img src="/logo.webp" alt="Sara Jewelers" className="h-12 w-auto object-contain" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Admin</p>
                  <h1 className="text-base font-bold">
                    <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">Sara Jewelers</span>
                  </h1>
                </div>
              </>
            )}
            {sidebarCollapsed && <img src="/logo.webp" alt="Sara Jewelers" className="h-8 w-auto object-contain" />}
          </div>
          
          {/* Scrollable Nav */}
          <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon
                const hasSubmenu = item.submenu && item.submenu.length > 0
                const isExpanded = expandedMenus.includes(item.name.toLowerCase())
                const isActive = pathname === item.href || (hasSubmenu && item.submenu?.some(sub => pathname === sub.href))
                const isParentActive = pathname === item.href

                // For Products, check if any submenu item is active
                const anySubmenuActive = hasSubmenu && item.submenu?.some(sub => pathname === sub.href)

                return (
                  <li key={item.href} className="mb-1">
                    <div className="space-y-1">
                      {/* Main Menu Item */}
                      {hasSubmenu ? (
                        <div className="flex items-center gap-1">
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              if (!sidebarCollapsed) {
                                e.stopPropagation()
                              }
                            }}
                            className={`flex-1 group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5'} rounded-md px-2.5 py-2 border ${isActive ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#f4d03f]/10 border-[#d4af37]/40' : 'border-transparent hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5'}`}
                            title={sidebarCollapsed ? item.name : undefined}
                          >
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 text-[#d4af37] flex-shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            {!sidebarCollapsed && (
                              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 truncate text-left">{item.name}</span>
                            )}
                          </Link>
                          {!sidebarCollapsed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleMenu(item.name.toLowerCase())
                              }}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.15s ease' }} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <Link 
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                          className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5'} rounded-md px-2.5 py-2 border ${isActive ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#f4d03f]/10 border-[#d4af37]/40' : 'border-transparent hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5'}`}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 text-[#d4af37] flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          {!sidebarCollapsed && (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</span>
                          )}
                        </Link>
                      )}

                      {/* Submenu Items */}
                      {hasSubmenu && !sidebarCollapsed && isExpanded && (
                        <ul className="ml-3 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                          {item.submenu?.map((subItem) => {
                            const SubIcon = subItem.icon
                            const subActive = isSubmenuActive(subItem.href, pathname)
                            return (
                              <li key={subItem.href} className="mb-0.5">
                                <Link
                                  href={subItem.href}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 ${
                                    subActive 
                                      ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#f4d03f]/10 text-[#d4af37] font-medium border border-[#d4af37]/30' 
                                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30'
                                  }`}
                                >
                                  <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="text-sm truncate">{subItem.name}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          {/* Resize Handle */}
          {!sidebarCollapsed && (
            <div 
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#d4af37]/30 group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.15s ease' }}>
                <GripVertical className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">

            
            {/* Collapse Toggle */}
            <div className="px-2 py-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#d4af37] px-2.5 py-1.5 rounded-md hover:bg-[#d4af37]/5"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
              </button>
            </div>
            
            {/* Logout - Always visible */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleLogout} 
                disabled={loggingOut} 
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2.5 py-2 rounded-md shadow-md disabled:opacity-50`}
                title={sidebarCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">{loggingOut ? 'Logging out...' : 'Logout'}</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main - Offset for fixed sidebar */}
        <div 
          className="flex-1 min-w-0"
          style={{ 
            marginLeft: sidebarCollapsed ? '80px' : `${sidebarWidth}px`,
            transition: 'margin-left 0.2s ease'
          }}
        >
          <header className="bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14">
                <div className="flex items-center gap-2 md:hidden">
                  <img src="/logo.webp" alt="Sara Jewelers" className="h-8 w-auto object-contain" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin</span>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Welcome, Admin</span>
                </div>
                
                <div className="flex items-center gap-3 relative">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-admin-help'))}
                    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-[#d4af37]/5 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer hidden md:block"
                    title="Help & Shortcuts (Ctrl+I)"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-[#d4af37]/5 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border border-white dark:border-[#1e1e1e]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-h-[480px] bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                        <button 
                          onClick={() => {
                            fetch('/api/admin/notifications', { method: 'PATCH', body: JSON.stringify({ id: 'all' }) }).then(() => fetchNotifications())
                          }}
                          className="text-xs text-[#d4af37] hover:text-[#b8941f] font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="overflow-y-auto flex-1 flex flex-col">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id}
                              onClick={() => {
                                if (!notif.isRead) markAsRead(notif._id)
                                if (notif.link) {
                                  router.push(notif.link)
                                  setShowNotifications(false)
                                }
                              }}
                              className={`p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors relative group ${!notif.isRead ? 'bg-[#d4af37]/5' : ''}`}
                            >
                              {!notif.isRead && (
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                              )}
                              <div className="pl-3">
                                <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center">
                            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 opacity-20" />
                            <p className="text-sm text-gray-500 dark:text-gray-500">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/50 dark:bg-gray-800/30">
                        <Link 
                          href="/sara-admin/dashboard/orders" 
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-bold text-gray-500 hover:text-[#d4af37] uppercase tracking-wider cursor-pointer"
                        >
                          View all activities
                        </Link>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={toggleTheme} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 text-sm cursor-pointer"
                  >
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>{isDark ? 'Light' : 'Dark'}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="w-full px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <AdminChatWidget />
      <AdminHelpModal />
    </div>
  )
}
