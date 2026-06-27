import {jsxs as _jsxs, jsx as _jsx} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { Link } from "wouter";
import { ArrowRight, Zap, Package, Clock, CheckCircle } from "lucide-react";
import { useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";

const categoryIcons = {
  "motor-starters": "⚡",
  "fuses": "🔌",
  "cables": "🔋",
  "contactors": "🔧",
  "switches": "💡",
  "capacitors": "🔩",
  "pumps": "💧",
  "electrical-accessories": "🛠",
};

export default function HomePage() {
  const { data: categories, isLoading } = useListCategories();

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )

      /* Hero */
      , _jsx('section', { className: "bg-sidebar text-sidebar-foreground" , children: 
        _jsx('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"      , children: 
          _jsxs('div', { className: "max-w-2xl", children: [
            _jsxs('div', { className: "inline-flex items-center gap-2 bg-sidebar-accent/60 text-sidebar-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-6"          , children: [
              _jsx(Zap, { className: "h-3 w-3" ,} ), "Pre-order by 6 PM for same-day preparation"

            ]})
            , _jsxs('h1', { className: "font-serif text-4xl md:text-5xl font-bold leading-tight mb-4"     , children: ["Raghavendra Enterprises"
               , _jsx('br', {} )
              , _jsx('span', { className: "text-3xl md:text-4xl font-normal opacity-80"   , children: "Irrigation & Electrical Spares"   })
            ]})
            , _jsx('p', { className: "text-sidebar-foreground/70 text-lg mb-8 leading-relaxed"   , children: "Browse our complete inventory of motor starters, pumps, cables, fuses, and electrical accessories. Place your order today, pick it up tomorrow — everything prepared in advance."


            })
            , _jsxs('div', { className: "flex flex-wrap gap-3"  , children: [
              _jsx(Link, { href: "/products", children: 
                _jsxs(Button, { size: "lg", className: "bg-primary text-primary-foreground hover:opacity-90"  , 'data-testid': "button-browse-products", children: ["Browse Products"

                  , _jsx(ArrowRight, { className: "h-4 w-4 ml-2"  ,} )
                ]})
              })
              , _jsx(Link, { href: "/cart", children: 
                _jsx(Button, { size: "lg", variant: "outline", className: "border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"  , children: "View Cart"

                })
              })
            ]})
          ]})
        })
      })

      /* How it works */
      , _jsx('section', { className: "border-b border-border bg-muted/30"  , children: 
        _jsx('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"     , children: 
          _jsx('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , children: 
            [
              { icon: Package, title: "Browse the catalog", desc: "Filter by category, search by name, check stock availability." },
              { icon: Clock, title: "Pre-order by evening", desc: "Place your order the day before. We'll prepare everything overnight." },
              { icon: CheckCircle, title: "Pick up at the shop", desc: "Walk in, collect your items — no waiting, no searching." },
            ].map(({ icon: Icon, title, desc }) => (
              _jsxs('div', { className: "flex items-start gap-4"  , children: [
                _jsx('div', { className: "h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0"       , children: 
                  _jsx(Icon, { className: "h-5 w-5 text-primary"  ,} )
                })
                , _jsxs('div', { children: [
                  _jsx('div', { className: "font-medium text-foreground" , children: title})
                  , _jsx('div', { className: "text-sm text-muted-foreground mt-1"  , children: desc})
                ]})
              ]}, title)
            ))
          })
        })
      })

      /* Categories */
      , _jsxs('section', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"     , children: [
        _jsxs('div', { className: "flex items-center justify-between mb-8"   , children: [
          _jsxs('div', { children: [
            _jsx('h2', { className: "font-serif text-2xl font-bold text-foreground"   , children: "Shop by Category"  })
            , _jsx('p', { className: "text-muted-foreground text-sm mt-1"  , children: "All major irrigation and electrical parts"     })
          ]})
          , _jsx(Link, { href: "/products", children: 
            _jsxs(Button, { variant: "outline", size: "sm", children: ["View all "
                , _jsx(ArrowRight, { className: "h-3 w-3 ml-1"  ,} )
            ]})
          })
        ]})

        , isLoading ? (
          _jsx('div', { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"    , children: 
            Array.from({ length: 8 }).map((_, i) => (
              _jsx(Skeleton, { className: "h-28 rounded-lg" ,}, i )
            ))
          })
        ) : (
          _jsx('div', { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"    , children: 
            _optionalChain([categories, 'optionalAccess', _2 => _2.map, 'call', _3 => _3(cat => (
              _jsx(Link, { href: `/products?category_id=${cat.id}`, 'data-testid': `card-category-${cat.id}`, children: 
                _jsx(Card, { className: "hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full"     , children: 
                  _jsxs(CardContent, { className: "p-5 flex flex-col gap-2"   , children: [
                    _jsx('div', { className: "text-3xl", children: _nullishCoalesce(categoryIcons[cat.slug], () => ( "📦"))})
                    , _jsx('div', { className: "font-medium text-sm text-foreground group-hover:text-primary transition-colors leading-snug"     , children: 
                      cat.name
                    })
                    , _jsxs('div', { className: "text-xs text-muted-foreground" , children: [
                      cat.product_count, " items"
                    ]})
                  ]})
                })
              }, cat.id)
            ))])
          })
        )
      ]})

      /* Footer */
      , _jsx('footer', { className: "border-t border-border bg-card"  , children: 
        _jsx('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground text-center"        , children: "Raghavendra Enterprises — Irrigation & Electrical Spares — Contact the shop for bulk orders and custom requirements."

        })
      })
    ]})
  );
}
