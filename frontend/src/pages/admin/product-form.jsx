import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import {
  useGetAdminMe, useListCategories, useCreateProduct, useUpdateProduct, useGetProduct,
  getGetAdminMeQueryKey, getListCategoriesQueryKey, getListProductsQueryKey, getGetProductQueryKey
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  category_id: z.string().min(1, "Category required"),
  description: z.string().optional(),
  price: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, "Valid price required"),
  unit: z.string().min(1, "Unit required"),
  stock_quantity: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0, "Valid quantity required"),
  min_stock_alert: z.string().optional(),
  godown_location: z.string().optional(),
});


export default function ProductFormPage() {
  const params = useParams();
  const isEdit = !!params.id;
  const productId = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() }
  });
  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });
  const { data: existingProduct, isLoading: productLoading } = useGetProduct(productId, {
    query: { enabled: isEdit, queryKey: getGetProductQueryKey(productId) }
  });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (!adminLoading && !admin) setLocation("/admin");
  }, [admin, adminLoading, setLocation]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", category_id: "", description: "", price: "", unit: "piece",
      stock_quantity: "0", min_stock_alert: "5", godown_location: "",
    },
  });

  useEffect(() => {
    if (existingProduct) {
      form.reset({
        name: existingProduct.name,
        category_id: String(existingProduct.category_id),
        description: _nullishCoalesce(existingProduct.description, () => ( "")),
        price: String(existingProduct.price),
        unit: existingProduct.unit,
        stock_quantity: String(existingProduct.stock_quantity),
        min_stock_alert: String(existingProduct.min_stock_alert),
        godown_location: _nullishCoalesce(existingProduct.godown_location, () => ( "")),
      });
    }
  }, [existingProduct, form]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      category_id: Number(data.category_id),
      description: data.description || undefined,
      price: Number(data.price),
      unit: data.unit,
      stock_quantity: Number(data.stock_quantity),
      min_stock_alert: data.min_stock_alert ? Number(data.min_stock_alert) : 5,
      godown_location: data.godown_location || undefined,
      is_active: true,
    };

    if (isEdit) {
      updateProduct.mutate({ id: productId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
          toast({ title: "Product updated" });
          setLocation("/admin/products");
        },
        onError: () => toast({ title: "Failed to update product", variant: "destructive" }),
      });
    } else {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
          toast({ title: "Product created" });
          setLocation("/admin/products");
        },
        onError: () => toast({ title: "Failed to create product", variant: "destructive" }),
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    _jsx(AdminLayout, { children: 
      _jsxs('div', { className: "p-6 max-w-2xl" , children: [
        _jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", onClick: () => setLocation("/admin/products"), children: [
          _jsx(ArrowLeft, { className: "h-4 w-4 mr-1"  ,} ), "Back to Products"

        ]})
        , _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground mb-6"    , children: 
          isEdit ? "Edit Product" : "Add New Product"
        })

        , isEdit && productLoading ? (
          _jsxs('div', { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-10",} ), _jsx(Skeleton, { className: "h-10",} ), _jsx(Skeleton, { className: "h-10",} )]})
        ) : (
          _jsx('div', { className: "bg-card border border-border rounded-lg p-6"    , children: 
            _jsx(Form, { ...form, children: 
              _jsxs('form', { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
                _jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Product Name" })
                    , _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g. 3 HP DOL Starter"    , ...field, 'data-testid': "input-product-name",} )})
                    , _jsx(FormMessage, {} )
                  ]})
                ),} )

                , _jsx(FormField, { control: form.control, name: "category_id", render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Category"})
                    , _jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
                      _jsx(FormControl, { children: 
                        _jsx(SelectTrigger, { 'data-testid': "select-category", children: 
                          _jsx(SelectValue, { placeholder: "Select category" ,} )
                        })
                      })
                      , _jsx(SelectContent, { children: 
                        _optionalChain([categories, 'optionalAccess', _ => _.map, 'call', _2 => _2(cat => (
                          _jsx(SelectItem, { value: String(cat.id), children: cat.name}, cat.id)
                        ))])
                      })
                    ]})
                    , _jsx(FormMessage, {} )
                  ]})
                ),} )

                , _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Description (optional)" })
                    , _jsx(FormControl, { children: _jsx(Textarea, { rows: 3, placeholder: "Product details, specifications..."  , ...field, 'data-testid': "input-description",} )})
                    , _jsx(FormMessage, {} )
                  ]})
                ),} )

                , _jsxs('div', { className: "grid grid-cols-2 gap-4"  , children: [
                  _jsx(FormField, { control: form.control, name: "price", render: ({ field }) => (
                    _jsxs(FormItem, { children: [
                      _jsx(FormLabel, { children: "Price (₹)" })
                      , _jsx(FormControl, { children: _jsx(Input, { type: "number", step: "0.01", placeholder: "0.00", ...field, 'data-testid': "input-price",} )})
                      , _jsx(FormMessage, {} )
                    ]})
                  ),} )
                  , _jsx(FormField, { control: form.control, name: "unit", render: ({ field }) => (
                    _jsxs(FormItem, { children: [
                      _jsx(FormLabel, { children: "Unit"})
                      , _jsx(FormControl, { children: _jsx(Input, { placeholder: "piece, meter, set..."  , ...field, 'data-testid': "input-unit",} )})
                      , _jsx(FormMessage, {} )
                    ]})
                  ),} )
                ]})

                , _jsxs('div', { className: "grid grid-cols-2 gap-4"  , children: [
                  _jsx(FormField, { control: form.control, name: "stock_quantity", render: ({ field }) => (
                    _jsxs(FormItem, { children: [
                      _jsx(FormLabel, { children: "Stock Quantity" })
                      , _jsx(FormControl, { children: _jsx(Input, { type: "number", min: "0", ...field, 'data-testid': "input-stock-quantity",} )})
                      , _jsx(FormMessage, {} )
                    ]})
                  ),} )
                  , _jsx(FormField, { control: form.control, name: "min_stock_alert", render: ({ field }) => (
                    _jsxs(FormItem, { children: [
                      _jsx(FormLabel, { children: "Low Stock Alert At"   })
                      , _jsx(FormControl, { children: _jsx(Input, { type: "number", min: "0", ...field, 'data-testid': "input-min-stock-alert",} )})
                      , _jsx(FormMessage, {} )
                    ]})
                  ),} )
                ]})

                , _jsx(FormField, { control: form.control, name: "godown_location", render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Godown Location (optional)"  })
                    , _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g. A-1, Shelf 3..."   , ...field, 'data-testid': "input-godown-location",} )})
                    , _jsx(FormMessage, {} )
                  ]})
                ),} )

                , _jsxs('div', { className: "flex gap-3 pt-2"  , children: [
                  _jsx(Button, { type: "submit", disabled: isPending, 'data-testid': "button-save-product", children: 
                    isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Product"
                  })
                  , _jsx(Button, { type: "button", variant: "outline", onClick: () => setLocation("/admin/products"), children: "Cancel"

                  })
                ]})
              ]})
            })
          })
        )
      ]})
    })
  );
}
