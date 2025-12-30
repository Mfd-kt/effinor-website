"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Eye,
  ChevronDown,
  ChevronRight,
  LogOut,
  Home,
  Menu,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminShell } from "./AdminShell";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getCurrentUserClient } from "@/lib/auth/auth-client";
import { useEffect } from "react";
import { User } from "@/lib/types/user";
import { Logo } from "@/components/ui/Logo";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produits",
    href: "/admin/produits",
    icon: Package,
  },
  {
    title: "Catégories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Commandes",
    href: "/admin/commandes",
    icon: ShoppingCart,
  },
  {
    title: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    title: "SEO",
    href: "/admin/seo",
    icon: Search,
  },
  {
    title: "Utilisateurs",
    icon: Users,
    children: [
      {
        title: "Liste des utilisateurs",
        href: "/admin/utilisateurs",
        icon: Users,
      },
      {
        title: "Inviter un utilisateur",
        href: "/admin/utilisateurs/inviter",
        icon: Users,
      },
    ],
  },
  {
    title: "Réglages",
    icon: Settings,
    children: [
      {
        title: "Rôles & Permissions",
        href: "/admin/reglages/roles-permissions",
        icon: Settings,
      },
      {
        title: "Statuts Leads",
        href: "/admin/reglages/statuts-leads",
        icon: Settings,
      },
      {
        title: "Statuts Commandes",
        href: "/admin/reglages/statuts-commandes",
        icon: Settings,
      },
    ],
  },
  {
    title: "Visiteurs",
    href: "/admin/visiteurs",
    icon: Eye,
  },
];

function MenuItemComponent({
  item,
  isMobile = false,
}: {
  item: MenuItem;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(
    item.children?.some((child) => child.href === pathname) || false
  );
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors",
            isActive
              ? "bg-[#10B981] text-white"
              : "text-white/90 hover:bg-[#1E293B]"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {open && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map((child) => (
              <MenuItemComponent key={child.href} item={child} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "bg-[#10B981] text-white"
          : "text-white/90 hover:bg-[#1E293B]"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.title}</span>
    </Link>
  );
}

function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getCurrentUserClient().then(setUser);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        addToast({
          title: 'Déconnexion réussie',
          description: 'Vous avez été déconnecté avec succès',
          variant: 'default',
        });
        router.push('/login');
        router.refresh();
      } else {
        addToast({
          title: 'Erreur de déconnexion',
          description: result.error?.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
        setLoggingOut(false);
      }
    } catch (error) {
      addToast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      });
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      <div className="p-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-xl font-bold">Effinor Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItemComponent key={item.title} item={item} isMobile={isMobile} />
        ))}
      </nav>

      <div className="p-4 border-t border-[#1E293B] space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1E293B] rounded-lg">
            <div className="h-10 w-10 rounded-full bg-[#10B981] flex items-center justify-center text-sm font-semibold text-white">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-white/70 truncate capitalize">
                {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-[#1E293B]"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Retour au site public
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-[#1E293B]"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAdminShell();

  return (
    <>
      {/* Desktop Sidebar - Toujours visible */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0F172A] text-white h-screen z-40 fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function SidebarToggle() {
  const { toggleSidebar } = useAdminShell();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

