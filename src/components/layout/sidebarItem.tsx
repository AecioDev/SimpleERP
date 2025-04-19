"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ElementType;
  children?: NavItem[];
}

interface SidebarItemProps {
  item: NavItem;
  collapsed?: boolean;
}

export function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href?: string) =>
    href && (pathname === href || pathname.startsWith(`${href}/`));

  const toggle = () => setOpen((prev) => !prev);
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (item.children?.length) {
    return (
      <div>
        {/* Botão principal que expande submenu */}
        <Button
          variant={open ? "secondary" : "ghost"}
          onClick={toggle}
          className={cn(
            "w-full justify-start",
            collapsed ? "px-0 justify-center" : ""
          )}
        >
          {item.icon && (
            <item.icon
              className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")}
            />
          )}
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform",
                  open ? "rotate-180" : "rotate-0"
                )}
              />
            </>
          )}
        </Button>

        {/* Submenus expandidos */}
        {open && !collapsed && (
          <ul className="ml-4 mt-1 space-y-1">
            {item.children?.map((child) => {
              return child.children?.length ? (
                <li
                  key={child.title}
                  onMouseEnter={() => setPopoverOpen(true)}
                  onMouseLeave={() => setPopoverOpen(false)}
                >
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between pr-2"
                      >
                        <span>{child.title}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-48 p-2"
                    >
                      {child.children?.map((sub) => (
                        <Link key={sub.title} href={sub.href!}>
                          <Button
                            variant={isActive(sub.href) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                          >
                            {sub.title}
                          </Button>
                        </Link>
                      ))}
                    </PopoverContent>
                  </Popover>
                </li>
              ) : (
                <li key={child.title}>
                  <Link href={child.href!}>
                    <Button
                      variant={isActive(child.href) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {child.title}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // Item sem submenu
  return (
    <Link href={item.href!}>
      <Button
        variant={isActive(item.href) ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          collapsed ? "px-0 justify-center" : ""
        )}
      >
        {item.icon && (
          <item.icon
            className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")}
          />
        )}
        {!collapsed && <span>{item.title}</span>}
      </Button>
    </Link>
  );
}
