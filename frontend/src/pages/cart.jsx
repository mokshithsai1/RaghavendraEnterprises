import {jsxs as _jsxs, jsx as _jsx} from "react/jsx-runtime";import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )
      , _jsxs('div', { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"     , children: [
        _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground mb-6"    , children: "Your Cart" })

        , items.length === 0 ? (
          _jsxs('div', { className: "text-center py-20 bg-card border border-border rounded-lg"     , children: [
            _jsx(ShoppingCart, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4"    ,} )
            , _jsx('div', { className: "font-medium text-foreground mb-2"  , children: "Your cart is empty"   })
            , _jsx('div', { className: "text-sm text-muted-foreground mb-6"  , children: "Browse products and add items to get started."       })
            , _jsx(Link, { href: "/products", children: 
              _jsx(Button, { children: "Browse Products" })
            })
          ]})
        ) : (
          _jsxs('div', { className: "space-y-4", children: [
            _jsx('div', { className: "bg-card border border-border rounded-lg divide-y divide-border"     , children: 
              items.map(item => (
                _jsxs('div', { className: "p-4 flex items-center gap-4"   , 'data-testid': `cart-item-${item.product_id}`, children: [
                  _jsxs('div', { className: "flex-1 min-w-0" , children: [
                    _jsx('div', { className: "font-medium text-foreground text-sm"  , children: item.product_name})
                    , _jsxs('div', { className: "text-xs text-muted-foreground" , children: ["₹", item.unit_price.toFixed(2), " per "  , item.unit]})
                  ]})
                  , _jsxs('div', { className: "flex items-center gap-2"  , children: [
                    _jsx('button', {
                      className: "h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"         ,
                      onClick: () => updateQuantity(item.product_id, item.quantity - 1),
                      'data-testid': `button-decrease-${item.product_id}`,
 children: 
                      _jsx(Minus, { className: "h-3 w-3" ,} )
                    })
                    , _jsx('span', { className: "w-8 text-center text-sm font-medium"   , children: item.quantity})
                    , _jsx('button', {
                      className: "h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"         ,
                      onClick: () => updateQuantity(item.product_id, item.quantity + 1),
                      'data-testid': `button-increase-${item.product_id}`,
 children: 
                      _jsx(Plus, { className: "h-3 w-3" ,} )
                    })
                  ]})
                  , _jsxs('div', { className: "text-sm font-semibold text-foreground w-20 text-right"    , children: ["₹"
                    , (item.unit_price * item.quantity).toFixed(2)
                  ]})
                  , _jsx('button', {
                    onClick: () => removeItem(item.product_id),
                    className: "text-muted-foreground hover:text-destructive transition-colors"  ,
                    'data-testid': `button-remove-${item.product_id}`,
 children: 
                    _jsx(Trash2, { className: "h-4 w-4" ,} )
                  })
                ]}, item.product_id)
              ))
            })

            , _jsxs('div', { className: "bg-card border border-border rounded-lg p-4"    , children: [
              _jsxs('div', { className: "flex items-center justify-between mb-4"   , children: [
                _jsx('span', { className: "font-medium text-foreground" , children: "Total"})
                , _jsxs('span', { className: "text-xl font-bold text-foreground"  , children: ["₹", total.toFixed(2)]})
              ]})
              , _jsx('div', { className: "text-xs text-muted-foreground mb-4"  , children: "Prices shown are estimates. Final bill will be confirmed at pickup."

              })
              , _jsx(Link, { href: "/checkout", children: 
                _jsxs(Button, { className: "w-full", 'data-testid': "button-checkout", children: ["Proceed to Checkout"

                  , _jsx(ArrowRight, { className: "h-4 w-4 ml-2"  ,} )
                ]})
              })
            ]})
          ]})
        )
      ]})
    ]})
  );
}
