'use client'

import { useEffect, useState } from 'react'
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Calendar, RefreshCw } from 'lucide-react'
import LogoLoader from '@/components/ui/logo-loader'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  orderStats: {
    total: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
  ordersGrowth: number
  totalCustomers: number
  totalProducts: number
  activeProducts: number
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState('30') // days

  const fetchAnalytics = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${dateRange}`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange]) // Re-fetch when date range changes

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  const stats = [
    { 
      name: 'Total Revenue', 
      value: `$${analytics.totalRevenue.toLocaleString()}`, 
      change: `${analytics.revenueGrowth > 0 ? '+' : ''}${analytics.revenueGrowth}%`, 
      trend: analytics.revenueGrowth >= 0 ? 'up' : 'down', 
      icon: DollarSign, 
      color: 'from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700' 
    },
    { 
      name: 'Total Orders', 
      value: analytics.orderStats.total.toString(), 
      change: `${analytics.ordersGrowth > 0 ? '+' : ''}${analytics.ordersGrowth}%`, 
      trend: analytics.ordersGrowth >= 0 ? 'up' : 'down', 
      icon: ShoppingBag, 
      color: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700' 
    },
    { 
      name: 'Active Products', 
      value: analytics.activeProducts.toString(), 
      change: `${analytics.totalProducts} total`, 
      trend: 'neutral', 
      icon: Package, 
      color: 'from-[#d4af37] to-[#f4d03f] dark:from-[#b8941f] dark:to-[#d4af37]' 
    },
    { 
      name: 'Total Customers', 
      value: analytics.totalCustomers.toString(), 
      change: 'All time',
      trend: 'neutral', 
      icon: Users, 
      color: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700' 
    },
  ]

  // Prepare order status data for pie chart
  const orderStatusData = [
    { name: 'Pending', value: analytics.orderStats.pending, color: '#f59e0b' },
    { name: 'Processing', value: analytics.orderStats.processing, color: '#3b82f6' },
    { name: 'Shipped', value: analytics.orderStats.shipped, color: '#8b5cf6' },
    { name: 'Delivered', value: analytics.orderStats.delivered, color: '#10b981' },
    { name: 'Cancelled', value: analytics.orderStats.cancelled, color: '#ef4444' },
  ].filter(item => item.value > 0)

  return (
    <div className="space-y-6">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time insights from your store</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            {[
              { label: '7D', value: '7' },
              { label: '30D', value: '30' },
              { label: '90D', value: '90' },
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  dateRange === range.value
                    ? 'bg-[#d4af37] text-white dark:bg-[#b8941f]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2 bg-white dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up'
          const isNegative = stat.trend === 'down'
          return (
            <div key={index} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-5 relative overflow-hidden group hover:shadow-xl transition-all duration-200 hover:border-[#d4af37]/40 dark:hover:border-[#d4af37]/40">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 dark:from-[#2a2a2a]/50 to-white/50 dark:to-transparent rounded-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                      isPositive 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-red-500/15 text-red-600 dark:text-red-400'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${isNegative ? 'rotate-180' : ''}`} />
                      {stat.change}
                    </div>
                  )}
                  {stat.trend === 'neutral' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</span>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1e1e', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#fff' 
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1e1e', 
                  border: '1px solid #374151', 
                  borderRadius: '8px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Order #</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">#{order.orderNumber}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.customer}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">${order.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
