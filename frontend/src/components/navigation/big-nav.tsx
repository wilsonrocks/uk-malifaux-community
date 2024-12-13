"use client";
import Link from "next/link";
import { navigationLinks } from "./navigation-links";
import { usePathname } from "next/navigation";

const BigNavigation: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex gap-4">
      {navigationLinks.map(({ href, text }) => (
        <Link
          href={href}
          key={href}
          className={href === pathname ? "underline" : undefined}
        >
          {text}
        </Link>
      ))}
    </nav>
  );
};

export default BigNavigation;
