"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, User, Bookmark, LogOut } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/features/auth/actions";

const topLinks = [
  { href: "/home/places", label: "Map", icon: MapPin },
  { href: "/home/mypage", label: "Mypage", icon: User },
  { href: "/home/bookmarks", label: "BookMark", icon: Bookmark },
];

export function NavigationSidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-card z-30 flex h-full w-20 flex-col items-center justify-between border-r border-slate-200 py-4"
      aria-label="Navigation"
    >
      <div className="flex flex-col gap-4">
        {topLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Button
              key={link.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="h-14 w-14 rounded-xl p-0"
            >
              <Link href={link.href} aria-label={link.label}>
                <link.icon className="size-6" />
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="h-14 w-14 rounded-xl p-0 text-slate-600 hover:text-slate-950"
            aria-label="Logout"
          >
            <LogOut className="size-6" />
          </Button>
        </form>
      </div>
    </nav>
  );
}
