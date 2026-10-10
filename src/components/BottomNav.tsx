"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mic, Users, Bell } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/login') return null;

  const navItems = [
    { name: "Today", href: "/dashboard", icon: Home },
    { name: "Log", href: "/log", icon: Mic },
    { name: "Profile", href: "/profile", icon: Users },
    { name: "Supervisor", href: "/supervisor", icon: Bell },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name === "Log" ? (
                <div className={`p-3 rounded-full ${isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
