"use client";

import Hamburger from "hamburger-react";
import Link from "next/link";
import { useState } from "react";
import { navigationLinks } from "./navigation-links";
import { usePathname } from "next/navigation";

const MobileNavigation: React.FC = () => {
  const pathname = usePathname();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  return (
    <>
      <div className="md:hidden">
        <Hamburger toggled={isHamburgerOpen} toggle={setIsHamburgerOpen} />
      </div>
      {isHamburgerOpen && (
        <nav className="flex flex-col md:hidden back border-green-100 border-2 border-solid p-2">
          {navigationLinks.map(({ href, text }) => (
            <Link
              key={href}
              href={href}
              className={href === pathname ? "underline" : undefined}
            >
              {text}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default MobileNavigation;
