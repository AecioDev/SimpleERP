"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    requiredRole: ["ADMIN"],
  },
  {
    title: "Vendas",
    href: "/dashboard/sales",
    icon: ShoppingCart,
    requiredRole: ["ADMIN", "Vendas", "Gerente"],
  },
  {
    title: "Estoque",
    href: "/dashboard/inventory",
    icon: Package,
    requiredRole: ["ADMIN", "Estoque", "Gerente"],
  },
  {
    title: "Financeiro",
    href: "/dashboard/finance",
    icon: Wallet,
    requiredRole: ["ADMIN", "Financeiro", "Gerente"],
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    requiredRole: ["ADMIN"],
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Handle responsive collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(user?.role || "");
  });

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center w-full"
          )}
        >
          <Logo className={cn("h-8 w-8", collapsed ? "mx-auto" : "")} />
          {!collapsed && (
            <span className="text-lg font-semibold">ERP System</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "right-0 mr-4")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <Button
                  variant={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                      ? "secondary"
                      : "ghost"
                  }
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-0 justify-center" : ""
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")}
                  />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
