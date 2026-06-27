import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Package, ShoppingBag, AlertTriangle, Calendar, Grid3X3, Clock } from "lucide-react";
import {
  useGetAdminMe, useGetDashboardStats, getGetDashboardStatsQueryKey, getGetAdminMeQueryKey
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";

import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() }
  });
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });

  useEffect(() => {
    if (!adminLoading && !admin) setLocation("/admin");
  }, [admin, adminLoading, setLocation]);

  const statCards = [
    { label: "Total Products", value: _optionalChain([stats, 'optionalAccess', _2 => _2.total_products]), icon: Package, color: "text-primary" },
    { label: "Total Orders", value: _optionalChain([stats, 'optionalAccess', _3 => _3.total_orders]), icon: ShoppingBag, color: "text-blue-600" },
    { label: "Pending Orders", value: _optionalChain([stats, 'optionalAccess', _4 => _4.pending_orders]), icon: Clock, color: "text-amber-600" },
    { label: "Low Stock Items", value: _optionalChain([stats, 'optionalAccess', _5 => _5.low_stock_items]), icon: AlertTriangle, color: "text-red-500" },
    { label: "Today's Pickups", value: _optionalChain([stats, 'optionalAccess', _6 => _6.todays_orders]), icon: Calendar, color: "text-emerald-600" },
    { label: "Categories", value: _optionalChain([stats, 'optionalAccess', _7 => _7.total_categories]), icon: Grid3X3, color: "text-purple-600" },
  ];

  return (
    _jsx(AdminLayout, { children: 
      _jsxs('div', { className: "p-6 max-w-6xl" , children: [
        _jsxs('div', { className: "mb-6", children: [
          _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground"   , children: "Dashboard"})
          , _jsx('p', { className: "text-muted-foreground text-sm mt-1"  , children: "Overview of your store operations"    })
        ]})

        , _jsx('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"    , children: 
          statCards.map(({ label, value, icon: Icon, color }) => (
            _jsxs('div', { className: "bg-card border border-border rounded-lg p-4"    , 'data-testid': `stat-${label.toLowerCase().replace(/\s+/g, "-")}`, children: [
              _jsxs('div', { className: "flex items-center justify-between mb-2"   , children: [
                _jsx('span', { className: "text-xs text-muted-foreground font-medium"  , children: label})
                , _jsx(Icon, { className: `h-4 w-4 ${color}`,} )
              ]})
              , statsLoading ? (
                _jsx(Skeleton, { className: "h-7 w-16" ,} )
              ) : (
                _jsx('div', { className: "text-2xl font-bold text-foreground"  , children: _nullishCoalesce(value, () => ( 0))})
              )
            ]}, label)
          ))
        })

        , _jsxs('div', { children: [
          _jsxs('div', { className: "flex items-center justify-between mb-4"   , children: [
            _jsx('h2', { className: "font-semibold text-foreground" , children: "Recent Orders" })
            , _jsx(Link, { href: "/admin/orders", children: 
              _jsx('span', { className: "text-sm text-primary hover:underline"  , children: "View all" })
            })
          ]})
          , _jsx('div', { className: "bg-card border border-border rounded-lg overflow-hidden"    , children: 
            _jsxs('table', { className: "w-full text-sm" , children: [
              _jsx('thead', { className: "bg-muted/50 border-b border-border"  , children: 
                _jsxs('tr', { children: [
                  _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Order"})
                  , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Customer"})
                  , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Pickup"})
                  , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Total"})
                  , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Status"})
                ]})
              })
              , _jsx('tbody', { className: "divide-y divide-border" , children: 
                statsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    _jsx('tr', { children: _jsx('td', { colSpan: 5, className: "px-4 py-3" , children: _jsx(Skeleton, { className: "h-5",} )})}, i)
                  ))
                ) : _optionalChain([stats, 'optionalAccess', _8 => _8.recent_orders, 'optionalAccess', _9 => _9.length]) === 0 ? (
                  _jsx('tr', { children: _jsx('td', { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground"   , children: "No orders yet"  })})
                ) : (
                  _optionalChain([stats, 'optionalAccess', _10 => _10.recent_orders, 'optionalAccess', _11 => _11.map, 'call', _12 => _12(order => (
                    _jsxs('tr', { className: "hover:bg-muted/30 transition-colors" , 'data-testid': `row-order-${order.id}`, children: [
                      _jsxs('td', { className: "px-4 py-3 font-medium text-foreground"   , children: ["#", order.id]})
                      , _jsx('td', { className: "px-4 py-3 text-foreground"  , children: order.customer_name})
                      , _jsx('td', { className: "px-4 py-3 text-muted-foreground"  , children: order.pickup_date})
                      , _jsxs('td', { className: "px-4 py-3 font-medium text-foreground"   , children: ["₹", order.total_amount.toFixed(2)]})
                      , _jsx('td', { className: "px-4 py-3" , children: 
                        _jsx('span', { className: `text-xs px-2 py-0.5 rounded-full font-medium ${_nullishCoalesce(statusColors[order.status], () => ( "bg-gray-100 text-gray-700"))}`, children: 
                          order.status
                        })
                      })
                    ]}, order.id)
                  ))])
                )
              })
            ]})
          })
        ]})
      ]})
    })
  );
}
