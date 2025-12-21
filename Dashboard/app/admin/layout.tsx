"use client";

import { RequireRole } from "@/components/admin/RequireRole";
import { AdminShellProvider } from "@/components/admin/AdminShell";
import { NotificationsProvider } from "@/components/admin/NotificationsProvider";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { useRealtimeNotifications } from "@/lib/hooks/useRealtimeNotifications";

function RealtimeNotificationsHandler() {
  // Activer les notifications en temps réel sur toutes les pages admin
  useRealtimeNotifications(true);
  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole>
      <AdminShellProvider>
        <NotificationsProvider>
          <RealtimeNotificationsHandler />
          <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-64">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F9FAFB]">{children}</main>
            </div>
          </div>
        </NotificationsProvider>
      </AdminShellProvider>
    </RequireRole>
  );
}

