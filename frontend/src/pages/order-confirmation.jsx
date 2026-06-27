import {jsxs as _jsxs, jsx as _jsx} from "react/jsx-runtime";import { useSearch, Link } from "wouter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const orderId = Number(params.get("order_id"));

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) }
  });

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )
      , _jsx('div', { className: "max-w-2xl mx-auto px-4 sm:px-6 py-12"    , children: 
        isLoading ? (
          _jsx(Skeleton, { className: "h-64",} )
        ) : !order ? (
          _jsx('div', { className: "text-center py-20" , children: 
            _jsx('div', { className: "font-medium text-foreground" , children: "Order not found"  })
          })
        ) : (
          _jsxs('div', { children: [
            _jsxs('div', { className: "text-center mb-8" , children: [
              _jsx('div', { className: "h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"        , children: 
                _jsx(CheckCircle, { className: "h-8 w-8 text-primary"  ,} )
              })
              , _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground mb-2"    , children: "Order Placed!" })
              , _jsxs('p', { className: "text-muted-foreground", children: ["Your pre-order #"
                  , order.id, " has been received. We'll prepare everything for your pickup."
              ]})
            ]})

            , _jsxs('div', { className: "bg-card border border-border rounded-lg p-6 mb-6"     , children: [
              _jsxs('div', { className: "grid grid-cols-2 gap-4 mb-4 text-sm"    , children: [
                _jsxs('div', { children: [
                  _jsx('div', { className: "text-muted-foreground", children: "Customer"})
                  , _jsx('div', { className: "font-medium text-foreground" , children: order.customer_name})
                ]})
                , _jsxs('div', { children: [
                  _jsx('div', { className: "text-muted-foreground", children: "Phone"})
                  , _jsx('div', { className: "font-medium text-foreground" , children: order.customer_phone})
                ]})
                , _jsxs('div', { children: [
                  _jsx('div', { className: "text-muted-foreground", children: "Pickup Date" })
                  , _jsx('div', { className: "font-medium text-foreground" , children: order.pickup_date})
                ]})
                , _jsxs('div', { children: [
                  _jsx('div', { className: "text-muted-foreground", children: "Status"})
                  , _jsx(Badge, { variant: "outline", children: order.status})
                ]})
              ]})

              , _jsxs('div', { className: "border-t border-border pt-4"  , children: [
                _jsx('div', { className: "font-medium text-foreground text-sm mb-3"   , children: "Items Ordered" })
                , _jsx('div', { className: "space-y-2", children: 
                  order.items.map(item => (
                    _jsxs('div', { className: "flex justify-between text-sm"  , 'data-testid': `order-item-${item.id}`, children: [
                      _jsxs('div', { className: "text-foreground", children: [
                        item.product_name, " × "  , item.quantity, " " , item.unit
                      ]})
                      , _jsxs('div', { className: "font-medium", children: ["₹", (item.unit_price * item.quantity).toFixed(2)]})
                    ]}, item.id)
                  ))
                })
                , _jsxs('div', { className: "border-t border-border pt-3 mt-3 flex justify-between font-bold text-foreground"       , children: [
                  _jsx('span', { children: "Total"})
                  , _jsxs('span', { children: ["₹", order.total_amount.toFixed(2)]})
                ]})
              ]})
            ]})

            , _jsxs('div', { className: "bg-muted/50 border border-border rounded-lg p-4 mb-6 flex gap-3"       , children: [
              _jsx(Package, { className: "h-5 w-5 text-primary flex-shrink-0 mt-0.5"    ,} )
              , _jsxs('div', { className: "text-sm text-muted-foreground" , children: ["Show this order number ("
                    , _jsxs('strong', { className: "text-foreground", children: ["#", order.id]}), ") at the shop on"    , " "
                , _jsx('strong', { className: "text-foreground", children: order.pickup_date}), ". Your items will be ready."
              ]})
            ]})

            , _jsxs('div', { className: "flex gap-3" , children: [
              _jsx(Link, { href: "/products", className: "flex-1", children: 
                _jsx(Button, { variant: "outline", className: "w-full", children: "Continue Shopping"

                })
              })
              , _jsx(Link, { href: "/", className: "flex-1", children: 
                _jsxs(Button, { className: "w-full", children: ["Back to Home"

                  , _jsx(ArrowRight, { className: "h-4 w-4 ml-2"  ,} )
                ]})
              })
            ]})
          ]})
        )
      })
    ]})
  );
}
