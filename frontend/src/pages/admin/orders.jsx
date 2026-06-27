import {jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetAdminMe, useListOrders, useUpdateOrderStatus,
  getGetAdminMeQueryKey, getListOrdersQueryKey
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_OPTIONS = ["pending", "confirmed", "ready", "completed", "cancelled"];

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() }
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const params = statusFilter !== "all" ? { status: statusFilter } : {};
  const { data: orders, isLoading } = useListOrders(params, {
    query: { queryKey: getListOrdersQueryKey(params) }
  });

  const updateStatus = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!adminLoading && !admin) setLocation("/admin");
  }, [admin, adminLoading, setLocation]);

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus.mutate({ id: orderId, data: { status: newStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey({}) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey(params) });
        toast({ title: "Order status updated" });
      },
      onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
    });
  };

  return (
    _jsx(AdminLayout, { children: 
      _jsxs('div', { className: "p-6 max-w-6xl" , children: [
        _jsxs('div', { className: "flex items-center justify-between mb-6"   , children: [
          _jsxs('div', { children: [
            _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground"   , children: "Orders"})
            , _jsx('p', { className: "text-muted-foreground text-sm mt-1"  , children: "Manage customer pre-orders"  })
          ]})
          , _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, 'data-testid': "select-status-filter", children: [
            _jsx(SelectTrigger, { className: "w-36", children: 
              _jsx(SelectValue, {} )
            })
            , _jsxs(SelectContent, { children: [
              _jsx(SelectItem, { value: "all", children: "All Orders" })
              , STATUS_OPTIONS.map(s => (
                _jsx(SelectItem, { value: s, className: "capitalize", children: s}, s)
              ))
            ]})
          ]})
        ]})

        , _jsx('div', { className: "bg-card border border-border rounded-lg overflow-hidden"    , children: 
          _jsxs('table', { className: "w-full text-sm" , children: [
            _jsx('thead', { className: "bg-muted/50 border-b border-border"  , children: 
              _jsxs('tr', { children: [
                _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "#"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Customer"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Pickup Date" })
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Items"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Total"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Status"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Action"})
              ]})
            })
            , _jsx('tbody', { className: "divide-y divide-border" , children: 
              isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  _jsx('tr', { children: _jsx('td', { colSpan: 7, className: "px-4 py-3" , children: _jsx(Skeleton, { className: "h-5",} )})}, i)
                ))
              ) : _optionalChain([orders, 'optionalAccess', _2 => _2.length]) === 0 ? (
                _jsx('tr', { children: _jsx('td', { colSpan: 7, className: "px-4 py-10 text-center text-muted-foreground"   , children: "No orders found"  })})
              ) : (
                _optionalChain([orders, 'optionalAccess', _3 => _3.map, 'call', _4 => _4(order => (
                  _jsxs(_Fragment, { children: [
                    _jsxs('tr', {

                      className: "hover:bg-muted/30 transition-colors cursor-pointer"  ,
                      onClick: () => setExpandedOrder(expandedOrder === order.id ? null : order.id),
                      'data-testid': `row-order-${order.id}`,
 children: [
                      _jsxs('td', { className: "px-4 py-3 font-medium text-foreground"   , children: ["#", order.id]})
                      , _jsxs('td', { className: "px-4 py-3" , children: [
                        _jsx('div', { className: "font-medium text-foreground" , children: order.customer_name})
                        , _jsx('div', { className: "text-xs text-muted-foreground" , children: order.customer_phone})
                      ]})
                      , _jsx('td', { className: "px-4 py-3 text-muted-foreground"  , children: order.pickup_date})
                      , _jsxs('td', { className: "px-4 py-3 text-muted-foreground"  , children: [order.items.length, " items" ]})
                      , _jsxs('td', { className: "px-4 py-3 font-medium text-foreground"   , children: ["₹", order.total_amount.toFixed(2)]})
                      , _jsx('td', { className: "px-4 py-3" , children: 
                        _jsx('span', { className: `text-xs px-2 py-0.5 rounded-full font-medium ${_nullishCoalesce(statusColors[order.status], () => ( ""))}`, children: 
                          order.status
                        })
                      })
                      , _jsx('td', { className: "px-4 py-3" , children: 
                        _jsxs(Select, {
                          value: order.status,
                          onValueChange: v => { handleStatusChange(order.id, v); },
                          'data-testid': `select-order-status-${order.id}`,
 children: [
                          _jsx(SelectTrigger, { className: "w-32 h-7 text-xs"  , onClick: e => e.stopPropagation(), children: 
                            _jsx(SelectValue, {} )
                          })
                          , _jsx(SelectContent, { children: 
                            STATUS_OPTIONS.map(s => (
                              _jsx(SelectItem, { value: s, className: "capitalize text-xs" , children: s}, s)
                            ))
                          })
                        ]})
                      })
                    ]}, order.id)
                    , expandedOrder === order.id && (
                      _jsx('tr', { children: 
                        _jsx('td', { colSpan: 7, className: "px-4 pb-4 bg-muted/20"  , children: 
                          _jsxs('div', { className: "border border-border rounded p-3 bg-card text-xs space-y-1"      , children: [
                            order.notes && (
                              _jsxs('div', { className: "text-muted-foreground mb-2" , children: [_jsx('strong', { children: "Notes:"}), " " , order.notes]})
                            )
                            , order.items.map(item => (
                              _jsxs('div', { className: "flex justify-between text-foreground"  , children: [
                                _jsxs('span', { children: [item.product_name, " × "  , item.quantity, " " , item.unit]})
                                , _jsxs('span', { className: "font-medium", children: ["₹", (item.unit_price * item.quantity).toFixed(2)]})
                              ]}, item.id)
                            ))
                          ]})
                        })
                      }, `${order.id}-expanded`)
                    )
                  ]})
                ))])
              )
            })
          ]})
        })
      ]})
    })
  );
}
