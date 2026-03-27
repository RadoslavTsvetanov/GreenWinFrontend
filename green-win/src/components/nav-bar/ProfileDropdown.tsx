import { useState, useEffect, useRef } from "react";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`nav-bar-button flex items-center gap-2 transition-colors
    ${open ? "bg-primary-900 text-base-100" : "hover:bg-primary-900 hover:text-base-100"}`}
      >
        <img
          src={open || hover ? "/PersonBase100.svg" : "/Person.svg"}
          alt="Profile"
          className="h-6 w-6 transition"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-base-200 bg-base-100 shadow-lg">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-base-200">
            Profile
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-base-200">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
