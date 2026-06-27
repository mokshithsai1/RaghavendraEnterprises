import {jsxs as _jsxs, jsx as _jsx} from "react/jsx-runtime";import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_phone: z.string().min(7, "Valid phone number required"),
  customer_email: z.string().email().optional().or(z.literal("")),
  pickup_date: z.string().refine(val => {
    const d = new Date(val);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return d >= tomorrow;
  }, "Pickup date must be tomorrow or later"),
  notes: z.string().optional(),
});



function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      pickup_date: getTomorrow(),
      notes: "",
    },
  });

  const onSubmit = (data) => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email || undefined,
        pickup_date: data.pickup_date,
        notes: data.notes || undefined,
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order-confirmation?order_id=${order.id}`);
      },
      onError: () => {
        toast({ title: "Failed to place order", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  if (items.length === 0) {
    return (
      _jsxs('div', { className: "min-h-screen bg-background" , children: [
        _jsx(Navbar, {} )
        , _jsxs('div', { className: "max-w-xl mx-auto px-4 py-20 text-center"    , children: [
          _jsx('div', { className: "font-medium text-foreground mb-2"  , children: "Your cart is empty"   })
          , _jsx(Button, { onClick: () => setLocation("/products"), className: "mt-4", children: "Browse Products" })
        ]})
      ]})
    );
  }

  return (
    _jsxs('div', { className: "min-h-screen bg-background" , children: [
      _jsx(Navbar, {} )
      , _jsxs('div', { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"     , children: [
        _jsx('h1', { className: "font-serif text-2xl font-bold text-foreground mb-6"    , children: "Checkout"})
        , _jsxs('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-8"   , children: [
          _jsx('div', { className: "md:col-span-2", children: 
            _jsxs('div', { className: "bg-card border border-border rounded-lg p-6"    , children: [
              _jsx('h2', { className: "font-semibold text-foreground mb-4"  , children: "Your Details" })
              , _jsx(Form, { ...form, children: 
                _jsxs('form', { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
                  _jsx(FormField, {
                    control: form.control,
                    name: "customer_name",
                    render: ({ field }) => (
                      _jsxs(FormItem, { children: [
                        _jsx(FormLabel, { children: "Full Name" })
                        , _jsx(FormControl, { children: 
                          _jsx(Input, { placeholder: "Your name" , ...field, 'data-testid': "input-customer-name",} )
                        })
                        , _jsx(FormMessage, {} )
                      ]})
                    ),}
                  )
                  , _jsx(FormField, {
                    control: form.control,
                    name: "customer_phone",
                    render: ({ field }) => (
                      _jsxs(FormItem, { children: [
                        _jsx(FormLabel, { children: "Phone Number" })
                        , _jsx(FormControl, { children: 
                          _jsx(Input, { placeholder: "Your phone number"  , ...field, 'data-testid': "input-customer-phone",} )
                        })
                        , _jsx(FormMessage, {} )
                      ]})
                    ),}
                  )
                  , _jsx(FormField, {
                    control: form.control,
                    name: "customer_email",
                    render: ({ field }) => (
                      _jsxs(FormItem, { children: [
                        _jsx(FormLabel, { children: "Email (optional)" })
                        , _jsx(FormControl, { children: 
                          _jsx(Input, { placeholder: "your@email.com", ...field, 'data-testid': "input-customer-email",} )
                        })
                        , _jsx(FormMessage, {} )
                      ]})
                    ),}
                  )
                  , _jsx(FormField, {
                    control: form.control,
                    name: "pickup_date",
                    render: ({ field }) => (
                      _jsxs(FormItem, { children: [
                        _jsx(FormLabel, { children: "Pickup Date" })
                        , _jsx(FormControl, { children: 
                          _jsx(Input, { type: "date", min: getTomorrow(), ...field, 'data-testid': "input-pickup-date",} )
                        })
                        , _jsx(FormMessage, {} )
                      ]})
                    ),}
                  )
                  , _jsx(FormField, {
                    control: form.control,
                    name: "notes",
                    render: ({ field }) => (
                      _jsxs(FormItem, { children: [
                        _jsx(FormLabel, { children: "Notes (optional)" })
                        , _jsx(FormControl, { children: 
                          _jsx(Textarea, {
                            placeholder: "Special instructions, specific brands, etc."    ,
                            rows: 3,
                            ...field,
                            'data-testid': "input-notes",}
                          )
                        })
                        , _jsx(FormMessage, {} )
                      ]})
                    ),}
                  )
                  , _jsx(Button, { type: "submit", className: "w-full", disabled: createOrder.isPending, 'data-testid': "button-place-order", children: 
                    createOrder.isPending ? "Placing order..." : "Place Pre-order"
                  })
                ]})
              })
            ]})
          })

          , _jsx('div', { children: 
            _jsxs('div', { className: "bg-card border border-border rounded-lg p-4 sticky top-20"      , children: [
              _jsx('h2', { className: "font-semibold text-foreground mb-3"  , children: "Order Summary" })
              , _jsx('div', { className: "divide-y divide-border" , children: 
                items.map(item => (
                  _jsxs('div', { className: "py-2 flex justify-between text-sm"   , children: [
                    _jsxs('div', { className: "text-foreground flex-1 pr-2"  , children: [
                      item.product_name
                      , _jsxs('span', { className: "text-muted-foreground", children: [" × "  , item.quantity]})
                    ]})
                    , _jsxs('div', { className: "font-medium whitespace-nowrap" , children: ["₹", (item.unit_price * item.quantity).toFixed(2)]})
                  ]}, item.product_id)
                ))
              })
              , _jsxs('div', { className: "border-t border-border pt-3 mt-1 flex justify-between font-bold text-foreground"       , children: [
                _jsx('span', { children: "Total"})
                , _jsxs('span', { children: ["₹", total.toFixed(2)]})
              ]})
            ]})
          })
        ]})
      ]})
    ]})
  );
}
