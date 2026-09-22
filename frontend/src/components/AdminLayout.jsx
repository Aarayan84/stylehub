import { useState } from "react";
import {
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
            aria-label="Open admin menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
              <ShieldCheck
                size={16}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-sm font-bold leading-none text-gray-900">
                Sushil Style Hub
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Admin
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
            aria-label="Logout"
          >
            <LogOut size={19} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-screen md:ml-64">
        {/* Desktop Header */}
        <header className="hidden border-b border-gray-200 bg-white md:block">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                  <ShieldCheck
                    size={16}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Admin Panel
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Manage your StyleHub store
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Owner */}
              <div className="hidden text-right lg:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "Owner"}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              {/* Owner badge */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <ShieldCheck
                  size={17}
                  className="text-gray-700"
                />
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;