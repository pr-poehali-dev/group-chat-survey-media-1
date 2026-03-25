import { Outlet, NavLink, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navItems = [
  { to: "/chats", icon: "MessageCircle", label: "Чаты" },
  { to: "/polls", icon: "BarChart3", label: "Опросы" },
  { to: "/gallery", icon: "Images", label: "Галерея" },
  { to: "/notifications", icon: "Bell", label: "Уведомления" },
  { to: "/profile", icon: "User", label: "Профиль" },
  { to: "/settings", icon: "Settings", label: "Настройки" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden mesh-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/8 shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center neon-glow-purple">
              <Icon name="Zap" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm gradient-text">ChatFlow</h1>
              <p className="text-xs text-muted-foreground">Групповые чаты</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/30 neon-glow-purple"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={item.icon}
                    size={18}
                    className={isActive ? "text-purple-400" : "text-muted-foreground group-hover:text-white transition-colors"}
                  />
                  {item.label}
                  {item.to === "/notifications" && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs flex items-center justify-center animate-pulse-slow">
                      3
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            <div className="relative online-dot">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                А
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Алексей М.</p>
              <p className="text-xs text-muted-foreground">Администратор</p>
            </div>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/8 flex">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all ${
                isActive ? "text-purple-400" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                  <Icon name={item.icon} size={20} />
                  {item.to === "/notifications" && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500" />
                  )}
                </div>
                <span className={isActive ? "font-medium" : ""}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
