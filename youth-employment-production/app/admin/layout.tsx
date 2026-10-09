"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const isAuthPage = pathname === "/admin/login";

  useEffect(() => {
    if (isAuthPage) return;

    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.email) {
          setAdminEmail(d.email);
        }
      })
      .catch(() => {});
  }, [isAuthPage]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-slate-50 overflow-hidden">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-slate-200 bg-white">
          <AdminSidebar adminEmail={adminEmail} onLogout={handleLogout} />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <aside
              className="absolute left-0 top-0 h-full w-64 bg-white border-r border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar
                adminEmail={adminEmail}
                onLogout={handleLogout}
                onClose={() => setSidebarOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Main Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Sticky Topbar */}
          <div className="sticky top-0 z-30 bg-white">
            <AdminTopbar
              adminEmail={adminEmail}
              onLogout={handleLogout}
              onToggleSidebar={() => setSidebarOpen(true)}
            />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
