"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, User, X, ShoppingCart, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarToggle } from "./Sidebar";
import { getCurrentUserClient } from "@/lib/auth/auth-client";
import { User as UserType } from "@/lib/types/user";
import { Logo } from "@/components/ui/Logo";
import { useNotificationsContext } from "@/components/admin/NotificationsProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/produits": "Produits",
  "/admin/categories": "Catégories",
  "/admin/commandes": "Commandes",
  "/admin/leads": "Leads",
  "/admin/blog": "Blog",
  "/admin/utilisateurs": "Utilisateurs",
  "/admin/utilisateurs/inviter": "Inviter un utilisateur",
  "/admin/reglages/roles-permissions": "Rôles & Permissions",
  "/admin/reglages/statuts-leads": "Statuts Leads",
  "/admin/reglages/statuts-commandes": "Statuts Commandes",
  "/admin/visiteurs": "Visiteurs",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead } = useNotificationsContext();

  useEffect(() => {
    getCurrentUserClient().then((userData) => {
      setUser(userData);
    });
  }, []);

  const pageTitle = pageTitles[pathname] || "Admin";

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setNotificationsOpen(false);
    router.push(notification.link);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <SidebarToggle />
        <div className="hidden lg:flex items-center gap-2">
          <Logo size={28} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-64 pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-hidden flex flex-col p-0">
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <h3 className="font-semibold text-effinor-gray-dark">Notifications</h3>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-xs h-auto py-1"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
              <div className="overflow-y-auto max-h-80">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-8 w-8 mx-auto text-effinor-gray-text mb-2 opacity-50" />
                    <p className="text-sm text-effinor-gray-text">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-effinor-gray-light transition-colors cursor-pointer ${
                          !notification.read ? 'bg-effinor-emerald/5' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 ${
                            notification.type === 'order' ? 'text-effinor-emerald' : 'text-blue-500'
                          }`}>
                            {notification.type === 'order' ? (
                              <ShoppingCart className="h-5 w-5" />
                            ) : (
                              <Mail className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${
                                notification.read ? 'text-effinor-gray-dark' : 'text-effinor-gray-dark font-semibold'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-effinor-emerald flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-effinor-gray-text mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-effinor-gray-text mt-1">
                              {format(notification.createdAt, "dd MMM yyyy HH:mm", { locale: fr })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 10 && (
                <div className="p-2 border-t border-gray-200 text-center">
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Voir toutes les notifications ({notifications.length})
                    </Button>
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 w-10 rounded-full bg-[#10B981] flex items-center justify-center text-white text-sm font-semibold hover:bg-[#059669] transition-colors">
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-effinor-gray-dark">{user.fullName}</p>
                    <p className="text-xs text-effinor-gray-text">{user.email}</p>
                  </div>
                  <div className="border-t border-gray-200 my-1" />
                </>
              )}
              <DropdownMenuItem className="text-effinor-gray-dark">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-effinor-gray-dark">Paramètres</DropdownMenuItem>
              <div className="border-t border-gray-200 my-1" />
              <DropdownMenuItem className="text-effinor-gray-dark">Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

