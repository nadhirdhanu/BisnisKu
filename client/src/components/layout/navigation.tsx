import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/", label: "Dashboard", exact: true },
  { href: "/transactions", label: "Transaksi" },
  { href: "/inventory", label: "Inventori" },
  { href: "/reports", label: "Laporan" },
];

const Navigation = () => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.exact 
          ? location === item.href 
          : location.startsWith(item.href) && item.href !== "/";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors whitespace-nowrap",
              isMobile 
                ? "block py-2 px-3 rounded-md" 
                : "px-1 pb-4 border-b-2",
              isActive
                ? isMobile
                  ? "bg-primary text-white"
                  : "text-primary border-primary"
                : isMobile
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
};

export default Navigation;
