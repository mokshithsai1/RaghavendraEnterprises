import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect, } from "react";
import { useLocation, Link } from "wouter";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import {
  useGetAdminMe, useListProducts, useDeleteProduct,
  getGetAdminMeQueryKey, getListProductsQueryKey,
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminProductsPage() {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() }
  });
  const { data: products, isLoading } = useListProducts({}, {
    query: { queryKey: getListProductsQueryKey({}) }
  });
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!adminLoading && !admin) setLocation("/admin");
  }, [admin, adminLoading, setLocation]);

  const handleDelete = (id) => {
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        toast({ title: "Product deactivated" });
      },
      onError: () => toast({ title: "Failed to delete product", variant: "destructive" }),
    });
  };

  return (
    _jsx(AdminLayout, { children: 
      _jsxs('div', { className: "p-6 max-w-6xl" , children: [
        _jsxs('div', { className: "flex items-center justify-between mb-6"   , children: [
          _jsxs('div', { children: [
            _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground"   , children: "Products"})
            , _jsx('p', { className: "text-muted-foreground text-sm mt-1"  , children: "Manage your product catalog"   })
          ]})
          , _jsx(Link, { href: "/admin/products/new", children: 
            _jsxs(Button, { 'data-testid': "button-add-product", children: [
              _jsx(Plus, { className: "h-4 w-4 mr-2"  ,} ), "Add Product"

            ]})
          })
        ]})

        , _jsx('div', { className: "bg-card border border-border rounded-lg overflow-hidden"    , children: 
          _jsxs('table', { className: "w-full text-sm" , children: [
            _jsx('thead', { className: "bg-muted/50 border-b border-border"  , children: 
              _jsxs('tr', { children: [
                _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Product"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Category"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Price"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Stock"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Location"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Actions"})
              ]})
            })
            , _jsx('tbody', { className: "divide-y divide-border" , children: 
              isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  _jsx('tr', { children: _jsx('td', { colSpan: 6, className: "px-4 py-3" , children: _jsx(Skeleton, { className: "h-5",} )})}, i)
                ))
              ) : _optionalChain([products, 'optionalAccess', _2 => _2.length]) === 0 ? (
                _jsx('tr', { children: _jsxs('td', { colSpan: 6, className: "px-4 py-10 text-center text-muted-foreground"   , children: [
                  _jsx(Package, { className: "h-8 w-8 mx-auto mb-2"   ,} ), "No products yet"

                ]})})
              ) : (
                _optionalChain([products, 'optionalAccess', _3 => _3.map, 'call', _4 => _4(product => (
                  _jsxs('tr', { className: "hover:bg-muted/30", 'data-testid': `row-product-${product.id}`, children: [
                    _jsxs('td', { className: "px-4 py-3" , children: [
                      _jsx('div', { className: "font-medium text-foreground" , children: product.name})
                      , product.description && (
                        _jsx('div', { className: "text-xs text-muted-foreground line-clamp-1"  , children: product.description})
                      )
                    ]})
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      _jsx(Badge, { variant: "secondary", className: "text-xs", children: product.category_name})
                    })
                    , _jsxs('td', { className: "px-4 py-3 font-medium text-foreground"   , children: ["₹"
                      , product.price.toFixed(2), " " , _jsxs('span', { className: "text-xs text-muted-foreground font-normal"  , children: ["/", product.unit]})
                    ]})
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      _jsx('span', { className: `text-sm font-medium ${product.stock_quantity === 0 ? "text-red-600" : product.stock_quantity <= (_nullishCoalesce(product.min_stock_alert, () => ( 5))) ? "text-amber-600" : "text-foreground"}`, children: 
                        product.stock_quantity
                      })
                    })
                    , _jsx('td', { className: "px-4 py-3 text-muted-foreground text-xs"   , children: _nullishCoalesce(product.godown_location, () => ( "—"))})
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      _jsxs('div', { className: "flex gap-1" , children: [
                        _jsx(Link, { href: `/admin/products/${product.id}/edit`, children: 
                          _jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2" , 'data-testid': `button-edit-product-${product.id}`, children: 
                            _jsx(Edit2, { className: "h-3 w-3" ,} )
                          })
                        })
                        , _jsxs(AlertDialog, { children: [
                          _jsx(AlertDialogTrigger, { asChild: true, children: 
                            _jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-destructive hover:text-destructive"   , 'data-testid': `button-delete-product-${product.id}`, children: 
                              _jsx(Trash2, { className: "h-3 w-3" ,} )
                            })
                          })
                          , _jsxs(AlertDialogContent, { children: [
                            _jsxs(AlertDialogHeader, { children: [
                              _jsx(AlertDialogTitle, { children: "Deactivate Product?" })
                              , _jsxs(AlertDialogDescription, { children: ["\""
                                , product.name, "\" will be hidden from the customer catalog. This can be reversed by editing the product."
                              ]})
                            ]})
                            , _jsxs(AlertDialogFooter, { children: [
                              _jsx(AlertDialogCancel, { children: "Cancel"})
                              , _jsx(AlertDialogAction, { onClick: () => handleDelete(product.id), children: "Deactivate"})
                            ]})
                          ]})
                        ]})
                      ]})
                    })
                  ]}, product.id)
                ))])
              )
            })
          ]})
        })
      ]})
    })
  );
}
