
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const links = [
    {
      name: "Men",
      path: "/products?gender=Men&type=Clothing",
    },
    {
      name: "Women",
      path: "/products?gender=Women&type=Clothing",
    },
    {
      name: "Kids",
      path: "/products?gender=Kids&type=Clothing",
    },
    {
      name: "General Store",
      path: "/products?type=General",
    },
    {
      name: "All Products",
      path: "/products",
    },
    {
      name: "Track Order",
      path: "/track-order",
    },
    {
      name: "About",
      path: "/about",
    },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="whitespace-nowrap text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
          >
            Sushil Style Hub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-5 md:flex xl:gap-7">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm font-medium transition ${
                    isActive
                      ? "text-black"
                      : "text-gray-700 hover:text-black"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Admin
            </Link>

            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
            >
              <span className="sr-only">
                Shopping Cart
              </span>

              <ShoppingBag size={22} />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={22} />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-gray-800 transition ${
                    menuOpen
                      ? "translate-y-2 rotate-45"
                      : ""
                  }`}
                />

                <span
                  className={`block h-0.5 w-6 bg-gray-800 transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`block h-0.5 w-6 bg-gray-800 transition ${
                    menuOpen
                      ? "-translate-y-2 -rotate-45"
                      : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="space-y-1 px-4 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-gray-100 text-black"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Admin */}
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Admin
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Cart</span>
                </div>

                {totalItems > 0 && (
                  <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
