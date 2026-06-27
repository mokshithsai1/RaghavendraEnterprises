import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package } from "lucide-react";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});


export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data) => {
    login.mutate({ data }, {
      onSuccess: () => setLocation("/admin/dashboard"),
      onError: () => toast({ title: "Invalid credentials", variant: "destructive" }),
    });
  };

  return (
    _jsx('div', { className: "min-h-screen bg-sidebar flex items-center justify-center p-4"     , children: 
      _jsxs('div', { className: "w-full max-w-sm" , children: [
        _jsxs('div', { className: "text-center mb-8" , children: [
          _jsx('div', { className: "h-14 w-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4"        , children: 
            _jsx(Package, { className: "h-7 w-7 text-primary-foreground"  ,} )
          })
          , _jsx('h1', { className: "font-serif text-2xl font-bold text-sidebar-foreground"   , children: "Raghavendra Enterprises" })
          , _jsx('p', { className: "text-sidebar-foreground/60 text-sm mt-1"  , children: "Admin — Sign in to manage inventory and orders"        })
        ]})

        , _jsx('div', { className: "bg-card border border-border rounded-lg p-6"    , children: 
          _jsx(Form, { ...form, children: 
            _jsxs('form', { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
              _jsx(FormField, {
                control: form.control,
                name: "username",
                render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Username"})
                    , _jsx(FormControl, { children: 
                      _jsx(Input, { placeholder: "admin", ...field, 'data-testid': "input-username",} )
                    })
                    , _jsx(FormMessage, {} )
                  ]})
                ),}
              )
              , _jsx(FormField, {
                control: form.control,
                name: "password",
                render: ({ field }) => (
                  _jsxs(FormItem, { children: [
                    _jsx(FormLabel, { children: "Password"})
                    , _jsx(FormControl, { children: 
                      _jsx(Input, { type: "password", placeholder: "••••••••", ...field, 'data-testid': "input-password",} )
                    })
                    , _jsx(FormMessage, {} )
                  ]})
                ),}
              )
              , _jsx(Button, { type: "submit", className: "w-full", disabled: login.isPending, 'data-testid': "button-login", children: 
                login.isPending ? "Signing in..." : "Sign In"
              })
            ]})
          })
        })
      ]})
    })
  );
}
