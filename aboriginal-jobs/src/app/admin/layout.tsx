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

  // Auth pages
  const isAuthPage = pathname === "/admin/login";

  useEffect(() => {
    if (isAuthPage) return;

    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.email) setAdminEmail(d.email);
      })
      .catch(() => {});
  }, [isAuthPage]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
  };

  // Login page → no sidebar, no topbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  const pageTitle = pathname.startsWith("/admin/coupons")
    ? "Coupon Management"
    : pathname.startsWith("/admin/packages")
      ? "Package Management"
      : pathname.startsWith("/admin/employers")
        ? "Employer Management"
        : pathname.startsWith("/admin/payments")
          ? "Payment Management"
          : "Admin Panel";

  return (
    <div className="min-h-screen bg-[#FAF5EE] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#C8782A]/10 fixed top-0 left-0 h-screen z-30">
        <AdminSidebar adminEmail={adminEmail} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col"
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminTopbar
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
          onProfileUpdate={(newEmail) => setAdminEmail(newEmail)}
        />

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
