import { useState } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Search, ShoppingCart, Filter, Package, ArrowRight } from "lucide-react";
import {
  useListProducts, useListCategories, getListProductsQueryKey
} from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const [, setLocation] = useLocation();
  const [categoryId, setCategoryId] = useState(
    params.get("category_id") ? Number(params.get("category_id")) : undefined
  );
  const [search, setSearch] = useState("");
  const [inStock, setInStock] = useState(undefined);
  const { addItem } = useCart();
  const { toast } = useToast();

  const queryParams = {
    ...(categoryId !== undefined ? { category_id: categoryId } : {}),
    ...(search ? { search } : {}),
    ...(inStock !== undefined ? { in_stock: inStock } : {}),
  };

  const { data: products, isLoading } = useListProducts(queryParams, {
    query: { queryKey: getListProductsQueryKey(queryParams) }
  });
  const { data: categories } = useListCategories();

  const addProductToCart = (product) => ({
    product_id: product.id,
    product_name: product.name,
    quantity: 1,
    unit_price: product.price,
    unit: product.unit,
  });

  const handleAddToCart = (product) => {
    addItem(addProductToCart(product));
    toast({ title: "Added to cart", description: product.name });
  };

  const handlePlaceOrder = (product) => {
    addItem(addProductToCart(product));
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Filters</span>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Category</div>
                <div className="flex flex-col gap-1">
                  <button
                    className={`text-left text-sm px-2 py-1.5 rounded transition-colors ${!categoryId ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                    onClick={() => setCategoryId(undefined)}
                    data-testid="filter-category-all"
                  >
                    All Categories
                  </button>
                  {categories?.map(cat => (
                    <button
                      key={cat.id}
                      className={`text-left text-sm px-2 py-1.5 rounded transition-colors ${categoryId === cat.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                      onClick={() => setCategoryId(cat.id)}
                      data-testid={`filter-category-${cat.id}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Availability</div>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "All", value: undefined },
                    { label: "In Stock", value: true },
                    { label: "Out of Stock", value: false },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      className={`text-left text-sm px-2 py-1.5 rounded transition-colors ${inStock === opt.value ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                      onClick={() => setInStock(opt.value)}
                      data-testid={`filter-stock-${opt.label.toLowerCase().replace(" ", "-")}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {products?.length ?? 0} items
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-52 rounded-lg" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <div className="text-foreground font-medium">No products found</div>
                <div className="text-muted-foreground text-sm mt-1">Try adjusting your filters</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map(product => (
                  <Card key={product.id} className="flex flex-col hover:shadow-md transition-shadow" data-testid={`card-product-${product.id}`}>
                    <CardContent className="p-4 flex flex-col flex-1 gap-3">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">{product.category_name}</Badge>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors leading-snug cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        {product.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <div className="font-bold text-lg text-foreground">
                            ₹{product.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">per {product.unit}</div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={product.stock_quantity > 0 ? "outline" : "destructive"}
                            className="text-xs"
                          >
                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                          </Badge>
                        </div>
                      </div>
                      {product.godown_location && (
                        <div className="text-xs text-muted-foreground">Location: {product.godown_location}</div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={product.stock_quantity === 0}
                          onClick={() => handleAddToCart(product)}
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={product.stock_quantity === 0}
                          onClick={() => handlePlaceOrder(product)}
                          data-testid={`button-place-order-${product.id}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                          Place Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
