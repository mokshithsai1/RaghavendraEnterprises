import {jsxs as _jsxs, jsx as _jsx} from "react/jsx-runtime";import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, MapPin, Package } from "lucide-react";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) }
  });
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: product.price,
      unit: product.unit,
    });
    toast({ title: "Added to cart", description: `${quantity} × ${product.name}` });
  };

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )
      , _jsxs('div', { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"     , children: [
        _jsx(Link, { href: "/products", children: 
          _jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
            _jsx(ArrowLeft, { className: "h-4 w-4 mr-1"  ,} ), "Back to Products"

          ]})
        })

        , isLoading ? (
          _jsxs('div', { className: "space-y-4", children: [
            _jsx(Skeleton, { className: "h-8 w-2/3" ,} )
            , _jsx(Skeleton, { className: "h-4 w-1/2" ,} )
            , _jsx(Skeleton, { className: "h-32",} )
          ]})
        ) : !product ? (
          _jsxs('div', { className: "text-center py-20" , children: [
            _jsx(Package, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3"    ,} )
            , _jsx('div', { className: "font-medium", children: "Product not found"  })
          ]})
        ) : (
          _jsxs('div', { className: "bg-card border border-border rounded-lg p-6 md:p-8"     , children: [
            _jsx(Badge, { variant: "secondary", className: "mb-3", children: product.category_name})
            , _jsx('h1', { className: "font-serif text-2xl md:text-3xl font-bold text-foreground mb-2"     , children: product.name})

            , _jsxs('div', { className: "flex flex-wrap items-center gap-3 mb-6"    , children: [
              _jsx(Badge, { variant: product.stock_quantity > 0 ? "outline" : "destructive", children: 
                product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"
              })
              , product.godown_location && (
                _jsxs('div', { className: "flex items-center gap-1 text-sm text-muted-foreground"    , children: [
                  _jsx(MapPin, { className: "h-3 w-3" ,} ), "Godown location: "
                    , product.godown_location
                ]})
              )
            ]})

            , product.description && (
              _jsx('p', { className: "text-muted-foreground text-sm leading-relaxed mb-6 border-l-2 border-primary/30 pl-4"      , children: 
                product.description
              })
            )

            , _jsxs('div', { className: "flex items-baseline gap-2 mb-6"   , children: [
              _jsxs('span', { className: "text-3xl font-bold text-foreground"  , children: ["₹", product.price.toFixed(2)]})
              , _jsxs('span', { className: "text-muted-foreground text-sm" , children: ["per " , product.unit]})
            ]})

            , product.stock_quantity > 0 && (
              _jsxs('div', { className: "flex items-end gap-4"  , children: [
                _jsxs('div', { className: "w-28", children: [
                  _jsx(Label, { htmlFor: "qty", className: "text-sm", children: "Quantity"})
                  , _jsx(Input, {
                    id: "qty",
                    type: "number",
                    min: 1,
                    max: product.stock_quantity,
                    value: quantity,
                    onChange: e => setQuantity(Math.max(1, Math.min(product.stock_quantity, Number(e.target.value)))),
                    className: "mt-1",
                    'data-testid': "input-quantity",}
                  )
                ]})
                , _jsxs(Button, { onClick: handleAddToCart, className: "flex-1 md:flex-none" , 'data-testid': "button-add-to-cart", children: [
                  _jsx(ShoppingCart, { className: "h-4 w-4 mr-2"  ,} ), "Add to Cart — ₹"
                      , (product.price * quantity).toFixed(2)
                ]})
              ]})
            )

            , _jsx('div', { className: "mt-6 pt-6 border-t border-border"   , children: 
              _jsx('div', { className: "text-xs text-muted-foreground" , children: "Orders placed before 6 PM will be prepared for next-day pickup."

              })
            })
          ]})
        )
      ]})
    ]})
  );
}
