"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminShellContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AdminShellContext = createContext<AdminShellContextType | undefined>(
  undefined
);

export function useAdminShell() {
  const context = useContext(AdminShellContext);
  if (!context) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return context;
}

interface AdminShellProviderProps {
  children: ReactNode;
}

export function AdminShellProvider({ children }: AdminShellProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AdminShellContext.Provider
      value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
    >
      {children}
    </AdminShellContext.Provider>
  );
}

