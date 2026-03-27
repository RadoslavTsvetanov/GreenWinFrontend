import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavLink({ href, children }: any) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`nav-bar-button transition
        ${isActive ? "bg-primary-900 text-base-100" : ""}`}
    >
      {children}
    </Link>
  );
}
