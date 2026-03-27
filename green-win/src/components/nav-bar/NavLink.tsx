import { usePathname } from "next/navigation";
import Link from "next/link";

export enum Colors {
  dark = "nav-bar-button",
  light = "nav-bar-button-light",
}

export type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  color: Colors;
};

export function NavLink({ href, children, color }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        ${color}
        transition
        ${
          color === Colors.dark
            ? isActive
              ? "bg-primary-900 text-base-100"
              : "hover:bg-primary-900 hover:text-base-100"
            : ""
        }
      `}
    >
      {children}
    </Link>
  );
}
