import {jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState } from "react";
import { Phone, Search, XCircle, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Navbar from "@/components/layout/Navbar";





















const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const cancellableStatuses = new Set(["pending", "confirmed", "ready"]);

const BASE = "https://raghavendraenterprises-5kyt.onrender.com";

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();

  const lookup = async () => {
    const trimmed = phone.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/orders/by-phone?phone=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();
      setOrders(data);
      if (data.length === 0) {
        toast({ title: "No orders found", description: "No orders match this phone number." });
      }
    } catch (e2) {
      toast({ title: "Error looking up orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(`${BASE}/api/orders/${orderId}/cancel`, { method: "PATCH" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(_nullishCoalesce(err.error, () => ( "Failed")));
      }
      const updated = await res.json();
      setOrders(prev => _nullishCoalesce(_optionalChain([prev, 'optionalAccess', _ => _.map, 'call', _2 => _2(o => o.id === orderId ? updated : o)]), () => ( null)));
      toast({ title: "Order cancelled", description: `Order #${orderId} has been cancelled.` });
    } catch (e) {
      toast({ title: "Cannot cancel order", description: e.message, variant: "destructive" });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )
      , _jsxs('div', { className: "max-w-2xl mx-auto px-4 sm:px-6 py-10"    , children: [
        _jsxs('div', { className: "mb-8", children: [
          _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground mb-1"    , children: "Track My Orders"  })
          , _jsx('p', { className: "text-muted-foreground text-sm" , children: "Enter the phone number you used when placing your order."         })
        ]})

        , _jsxs('div', { className: "flex gap-3 mb-8"  , children: [
          _jsxs('div', { className: "relative flex-1" , children: [
            _jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"      ,} )
            , _jsx(Input, {
              placeholder: "Your phone number"  ,
              value: phone,
              onChange: e => setPhone(e.target.value),
              onKeyDown: e => e.key === "Enter" && lookup(),
              className: "pl-9",
              'data-testid': "input-phone-lookup",}
            )
          ]})
          , _jsxs(Button, { onClick: lookup, disabled: loading || !phone.trim(), 'data-testid': "button-lookup", children: [
            _jsx(Search, { className: "h-4 w-4 mr-1.5"  ,} )
            , loading ? "Searching..." : "Search"
          ]})
        ]})

        , orders !== null && (
          orders.length === 0 ? (
            _jsxs('div', { className: "text-center py-16 bg-card border border-border rounded-lg"     , children: [
              _jsx(Package, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3"    ,} )
              , _jsx('div', { className: "font-medium text-foreground" , children: "No orders found"  })
              , _jsx('div', { className: "text-sm text-muted-foreground mt-1"  , children: "Try checking the phone number you used at checkout."        })
            ]})
          ) : (
            _jsxs('div', { className: "space-y-3", children: [
              _jsxs('div', { className: "text-sm text-muted-foreground mb-1"  , children: [orders.length, " order" , orders.length !== 1 ? "s" : "", " found" ]})
              , orders.map(order => (
                _jsxs('div', { className: "bg-card border border-border rounded-lg overflow-hidden"    , 'data-testid': `order-card-${order.id}`, children: [
                  _jsxs('div', { className: "p-4", children: [
                    _jsxs('div', { className: "flex items-start justify-between gap-4"   , children: [
                      _jsxs('div', { className: "flex-1", children: [
                        _jsxs('div', { className: "flex items-center gap-3 flex-wrap mb-2"    , children: [
                          _jsxs('span', { className: "font-semibold text-foreground" , children: ["Order #" , order.id]})
                          , _jsx('span', { className: `text-xs px-2 py-0.5 rounded-full border font-medium ${_nullishCoalesce(statusColors[order.status], () => ( "bg-gray-100 text-gray-700"))}`, children: 
                            order.status.charAt(0).toUpperCase() + order.status.slice(1)
                          })
                        ]})
                        , _jsxs('div', { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-sm"    , children: [
                          _jsx('div', { className: "text-muted-foreground", children: "Pickup date" })
                          , _jsx('div', { className: "text-foreground font-medium" , children: order.pickup_date})
                          , _jsx('div', { className: "text-muted-foreground", children: "Items"})
                          , _jsxs('div', { className: "text-foreground", children: [order.items.length, " item" , order.items.length !== 1 ? "s" : ""]})
                          , _jsx('div', { className: "text-muted-foreground", children: "Total"})
                          , _jsxs('div', { className: "text-foreground font-semibold" , children: ["₹", order.total_amount.toFixed(2)]})
                        ]})
                      ]})
                      , _jsxs('div', { className: "flex flex-col gap-2 flex-shrink-0"   , children: [
                        cancellableStatuses.has(order.status) && (
                          _jsxs(Button, {
                            size: "sm",
                            variant: "outline",
                            className: "text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground"   ,
                            onClick: () => cancelOrder(order.id),
                            disabled: cancellingId === order.id,
                            'data-testid': `button-cancel-${order.id}`,
 children: [
                            _jsx(XCircle, { className: "h-3.5 w-3.5 mr-1"  ,} )
                            , cancellingId === order.id ? "Cancelling..." : "Cancel"
                          ]})
                        )
                        , _jsx(Button, {
                          size: "sm",
                          variant: "ghost",
                          onClick: () => setExpandedId(expandedId === order.id ? null : order.id),
                          'data-testid': `button-expand-${order.id}`,
 children: 
                          expandedId === order.id ? (
                            _jsxs(_Fragment, { children: [_jsx(ChevronUp, { className: "h-3.5 w-3.5 mr-1"  ,} ), "Hide items" ]})
                          ) : (
                            _jsxs(_Fragment, { children: [_jsx(ChevronDown, { className: "h-3.5 w-3.5 mr-1"  ,} ), "View items" ]})
                          )
                        })
                      ]})
                    ]})

                    , expandedId === order.id && (
                      _jsxs('div', { className: "mt-4 pt-4 border-t border-border"   , children: [
                        _jsx('div', { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2"     , children: "Order Items" })
                        , _jsx('div', { className: "space-y-1.5", children: 
                          order.items.map(item => (
                            _jsxs('div', { className: "flex justify-between text-sm"  , children: [
                              _jsxs('span', { className: "text-foreground", children: [item.product_name, " " , _jsxs('span', { className: "text-muted-foreground", children: ["× " , item.quantity, " " , item.unit]})]})
                              , _jsxs('span', { className: "font-medium text-foreground" , children: ["₹", (item.unit_price * item.quantity).toFixed(2)]})
                            ]}, item.id)
                          ))
                        })
                        , order.notes && (
                          _jsxs('div', { className: "mt-3 pt-3 border-t border-border text-sm text-muted-foreground"     , children: [
                            _jsx('span', { className: "font-medium text-foreground" , children: "Notes: " }), order.notes
                          ]})
                        )
                        , _jsxs('div', { className: "mt-3 pt-3 border-t border-border flex justify-between font-semibold text-sm text-foreground"        , children: [
                          _jsx('span', { children: "Total"})
                          , _jsxs('span', { children: ["₹", order.total_amount.toFixed(2)]})
                        ]})
                      ]})
                    )
                  ]})

                  , order.status === "ready" && (
                    _jsx('div', { className: "px-4 py-2.5 bg-emerald-50 border-t border-emerald-100 text-xs text-emerald-700 font-medium"       , children: "✓ Your order is ready for pickup at the shop!"

                    })
                  )
                  , order.status === "cancelled" && (
                    _jsx('div', { className: "px-4 py-2.5 bg-red-50 border-t border-red-100 text-xs text-red-700"      , children: "This order has been cancelled."

                    })
                  )
                ]}, order.id)
              ))
            ]})
          )
        )
      ]})
    ]})
  );
}
