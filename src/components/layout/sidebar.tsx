"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { systemNavItems } from "@/config/navigation";
import { SidebarItem } from "./sidebarItem";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
  const filteredNavItems = systemNavItems.filter((item) => {
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
            <SidebarItem key={item.title} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
