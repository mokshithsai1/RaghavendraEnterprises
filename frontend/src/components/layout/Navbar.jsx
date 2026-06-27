import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";import { Link, useLocation } from "wouter";
import { ShoppingCart, Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { itemCount } = useCart();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/my-orders", label: "My Orders" },
  ];

  return (
    _jsx('nav', { className: "sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur"      , children: 
      _jsxs('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"    , children: [
        _jsxs('div', { className: "flex items-center justify-between h-16"   , children: [
          _jsxs(Link, { href: "/", className: "flex items-center gap-2"  , children: [
            _jsx(Package, { className: "h-7 w-7 text-primary"  ,} )
            , _jsxs('div', { className: "leading-tight", children: [
              _jsx('div', { className: "font-serif font-bold text-lg text-foreground"   , children: "Raghavendra Enterprises" })
              , _jsx('div', { className: "text-xs text-muted-foreground hidden sm:block"   , children: "Irrigation & Electrical Spares"   })
            ]})
          ]})

          , _jsx('div', { className: "hidden md:flex items-center gap-6"   , children: 
            navLinks.map(link => (
              _jsx(Link, {

                href: link.href,
                className: `text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`,
 children: 
                link.label
              }, link.href)
            ))
          })

          , _jsxs('div', { className: "flex items-center gap-3"  , children: [
            _jsx(Link, { href: "/cart", 'data-testid': "link-cart", children: 
              _jsxs(Button, { variant: "outline", size: "sm", className: "relative", children: [
                _jsx(ShoppingCart, { className: "h-4 w-4" ,} )
                , itemCount > 0 && (
                  _jsx(Badge, { className: "absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"         , children: 
                    itemCount
                  })
                )
                , _jsx('span', { className: "hidden sm:inline ml-2"  , children: "Cart"})
              ]})
            })
            , _jsx('button', {
              className: "md:hidden p-2" ,
              onClick: () => setMenuOpen(!menuOpen),
              'data-testid': "button-menu-toggle",
 children: 
              menuOpen ? _jsx(X, { className: "h-5 w-5" ,} ) : _jsx(Menu, { className: "h-5 w-5" ,} )
            })
          ]})
        ]})

        , menuOpen && (
          _jsx('div', { className: "md:hidden py-3 border-t border-border flex flex-col gap-3"      , children: 
            navLinks.map(link => (
              _jsx(Link, {

                href: link.href,
                className: "text-sm font-medium text-muted-foreground hover:text-primary py-1"    ,
                onClick: () => setMenuOpen(false),
 children: 
                link.label
              }, link.href)
            ))
          })
        )
      ]})
    })
  );
}
