import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, CheckCircle, Edit2, Save, X } from "lucide-react";
import {
  useGetAdminMe, useGetInventorySummary, useUpdateStock,
  getGetAdminMeQueryKey, getGetInventorySummaryQueryKey
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminInventoryPage() {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() }
  });
  const { data: summary, isLoading } = useGetInventorySummary({
    query: { queryKey: getGetInventorySummaryQueryKey() }
  });
  const updateStock = useUpdateStock();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");

  useEffect(() => {
    if (!adminLoading && !admin) setLocation("/admin");
  }, [admin, adminLoading, setLocation]);

  const startEdit = (id, currentQty) => {
    setEditingId(id);
    setEditQty(String(currentQty));
  };

  const saveEdit = (id) => {
    const qty = Number(editQty);
    if (isNaN(qty) || qty < 0) {
      toast({ title: "Invalid quantity", variant: "destructive" });
      return;
    }
    updateStock.mutate({ id, data: { stock_quantity: qty } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetInventorySummaryQueryKey() });
        setEditingId(null);
        toast({ title: "Stock updated" });
      },
      onError: () => toast({ title: "Failed to update stock", variant: "destructive" }),
    });
  };

  const [filter, setFilter] = useState("all");

  const items = _optionalChain([summary, 'optionalAccess', _2 => _2.items, 'optionalAccess', _3 => _3.filter, 'call', _4 => _4(item => {
    if (filter === "low") return item.is_low_stock && item.stock_quantity > 0;
    if (filter === "out") return item.stock_quantity === 0;
    return true;
  })]);

  return (
    _jsx(AdminLayout, { children: 
      _jsxs('div', { className: "p-6 max-w-6xl" , children: [
        _jsxs('div', { className: "mb-6", children: [
          _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground"   , children: "Inventory"})
          , _jsx('p', { className: "text-muted-foreground text-sm mt-1"  , children: "Track and update stock levels across the godown"       })
        ]})

        /* Summary cards */
        , _jsx('div', { className: "grid grid-cols-3 gap-4 mb-6"   , children: 
          [
            { label: "Total Products", value: _optionalChain([summary, 'optionalAccess', _5 => _5.total_products]), color: "text-foreground" },
            { label: "Low Stock", value: _optionalChain([summary, 'optionalAccess', _6 => _6.low_stock_count]), color: "text-amber-600" },
            { label: "Out of Stock", value: _optionalChain([summary, 'optionalAccess', _7 => _7.out_of_stock_count]), color: "text-red-600" },
          ].map(({ label, value, color }) => (
            _jsxs('div', { className: "bg-card border border-border rounded-lg p-4"    , children: [
              _jsx('div', { className: "text-xs text-muted-foreground mb-1"  , children: label})
              , isLoading ? _jsx(Skeleton, { className: "h-7 w-10" ,} ) : (
                _jsx('div', { className: `text-2xl font-bold ${color}`, children: _nullishCoalesce(value, () => ( 0))})
              )
            ]}, label)
          ))
        })

        /* Filter tabs */
        , _jsx('div', { className: "flex gap-2 mb-4"  , children: 
          (["all", "low", "out"] ).map(f => (
            _jsx('button', {

              onClick: () => setFilter(f),
              className: `text-sm px-3 py-1.5 rounded border transition-colors ${
                filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`,
              'data-testid': `filter-inventory-${f}`,
 children: 
              f === "all" ? "All Items" : f === "low" ? "Low Stock" : "Out of Stock"
            }, f)
          ))
        })

        , _jsx('div', { className: "bg-card border border-border rounded-lg overflow-hidden"    , children: 
          _jsxs('table', { className: "w-full text-sm" , children: [
            _jsx('thead', { className: "bg-muted/50 border-b border-border"  , children: 
              _jsxs('tr', { children: [
                _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Product"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Category"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Location"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Min Alert" })
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Stock"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Status"})
                , _jsx('th', { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase"      , children: "Edit"})
              ]})
            })
            , _jsx('tbody', { className: "divide-y divide-border" , children: 
              isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  _jsx('tr', { children: _jsx('td', { colSpan: 7, className: "px-4 py-3" , children: _jsx(Skeleton, { className: "h-5",} )})}, i)
                ))
              ) : _optionalChain([items, 'optionalAccess', _8 => _8.length]) === 0 ? (
                _jsx('tr', { children: _jsx('td', { colSpan: 7, className: "px-4 py-10 text-center text-muted-foreground"   , children: "No items found"  })})
              ) : (
                _optionalChain([items, 'optionalAccess', _9 => _9.map, 'call', _10 => _10(item => (
                  _jsxs('tr', { className: "hover:bg-muted/30", 'data-testid': `row-inventory-${item.id}`, children: [
                    _jsx('td', { className: "px-4 py-3 font-medium text-foreground"   , children: item.name})
                    , _jsx('td', { className: "px-4 py-3 text-muted-foreground text-xs"   , children: item.category_name})
                    , _jsx('td', { className: "px-4 py-3 text-muted-foreground text-xs"   , children: _nullishCoalesce(item.godown_location, () => ( "—"))})
                    , _jsx('td', { className: "px-4 py-3 text-muted-foreground text-xs"   , children: item.min_stock_alert})
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      editingId === item.id ? (
                        _jsx(Input, {
                          type: "number",
                          value: editQty,
                          onChange: e => setEditQty(e.target.value),
                          className: "h-7 w-20 text-sm"  ,
                          'data-testid': `input-stock-${item.id}`,}
                        )
                      ) : (
                        _jsxs('span', { className: "font-medium text-foreground" , children: [item.stock_quantity, " " , item.unit]})
                      )
                    })
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      item.stock_quantity === 0 ? (
                        _jsxs('span', { className: "flex items-center gap-1 text-xs text-red-600"    , children: [
                          _jsx(AlertTriangle, { className: "h-3 w-3" ,} ), " Out of stock"
                        ]})
                      ) : item.is_low_stock ? (
                        _jsxs('span', { className: "flex items-center gap-1 text-xs text-amber-600"    , children: [
                          _jsx(AlertTriangle, { className: "h-3 w-3" ,} ), " Low stock"
                        ]})
                      ) : (
                        _jsxs('span', { className: "flex items-center gap-1 text-xs text-emerald-600"    , children: [
                          _jsx(CheckCircle, { className: "h-3 w-3" ,} ), " OK"
                        ]})
                      )
                    })
                    , _jsx('td', { className: "px-4 py-3" , children: 
                      editingId === item.id ? (
                        _jsxs('div', { className: "flex gap-1" , children: [
                          _jsx(Button, { size: "sm", className: "h-7 px-2" , onClick: () => saveEdit(item.id), 'data-testid': `button-save-stock-${item.id}`, children: 
                            _jsx(Save, { className: "h-3 w-3" ,} )
                          })
                          , _jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2" , onClick: () => setEditingId(null), children: 
                            _jsx(X, { className: "h-3 w-3" ,} )
                          })
                        ]})
                      ) : (
                        _jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2" , onClick: () => startEdit(item.id, item.stock_quantity), 'data-testid': `button-edit-stock-${item.id}`, children: 
                          _jsx(Edit2, { className: "h-3 w-3" ,} )
                        })
                      )
                    })
                  ]}, item.id)
                ))])
              )
            })
          ]})
        })
      ]})
    })
  );
}
