import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Package, ShoppingBag, Warehouse, LogOut, ChevronRight
} from "lucide-react";
import { useAdminLogout, useGetAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminLayout({ children }) {
  const [location, setLocation] = useLocation();
  const { data: admin } = useGetAdminMe();
  const logout = useAdminLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin"),
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="font-serif font-bold text-lg">Raghavendra Enterprises</div>
          <div className="text-xs text-sidebar-foreground/60 mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || location.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
                data-testid={`link-admin-${label.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 mb-2">Signed in as</div>
          <div className="text-sm font-medium mb-3">{admin?.username ?? "Admin"}</div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-3 w-3 mr-1.5" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
