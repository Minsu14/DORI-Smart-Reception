"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bell,
  LogOut,
  Home,
} from "lucide-react";
import { DoriLogo } from "@/components/dori-logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/visitors", label: "Visitors", icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("dori_token");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 h-screen glass-strong flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <DoriLogo size={40} />
        <div>
          <p className="font-bold text-sm">DORI Admin</p>
          <p className="text-xs text-muted">Reception Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-primary/20 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface-light"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-foreground hover:bg-surface-light transition-colors"
        >
          <Home className="w-5 h-5" />
          Reception View
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
