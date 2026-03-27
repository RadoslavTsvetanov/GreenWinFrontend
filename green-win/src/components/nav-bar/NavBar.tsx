"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/nav-bar/NavLink";
import { ProfileDropdown } from "./ProfileDropdown";

export default function NavBar({ href, children }: any) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);
  return (
    <nav className=" sticky top-0 z-20 border-b border-base-200 bg-base-100">
      <div className="flex w-full items-center justify-between px-24 py-3 ">
        <Link href={"/"} className="flex flex-row gap-2">
          <img src="/greenwin-logo.svg" alt="Logo" />
          <p className="heading8 text-secondary-900">Green Win</p>
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          <NavLink
            href="/tasks"
            className={`nav-bar-button transition ${
              isActive
                ? "bg-primary-900 text-base-100"
                : "hover:bg-primary-900 hover:text-base-100"
            }`}
          >
            Jobs
          </NavLink>
          <NavLink href="/stats">Stats</NavLink>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
