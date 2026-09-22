import { NavLink } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  ShieldCheck,
  Users,
} from "lucide-react";

function AdminSidebar({ isOpen, onClose }) {
  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Owner Management",
      path: "/admin/owners",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <ShieldCheck
                size={18}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-sm font-bold text-gray-900">
                Sushil Style Hub
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Management
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-white/10"
                            : "bg-gray-100 group-hover:bg-white"
                        }`}
                      >
                        <Icon size={17} />
                      </span>

                      <span>{link.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Store Section */}
          <div className="mt-8 border-t border-gray-100 pt-5">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Store
            </p>

            <NavLink
              to="/"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white">
                <Store size={17} />
              </span>

              <span>Back to Store</span>
            </NavLink>
          </div>
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-gray-100 p-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <ShieldCheck
                  size={14}
                  className="text-gray-600"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-800">
                  Owner Access
                </p>

                <p className="text-[10px] text-gray-400">
                  Store management
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
