import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Notification {
  id: string;
  type: "message" | "poll" | "mention" | "join" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  chatName?: string;
  gradient: string;
}

const initialNotifications: Notification[] = [
  { id: "n1", type: "mention", title: "Упомянули вас", body: "@Алексей, посмотри PR — нужна твоя правка", time: "5 мин назад", read: false, chatName: "Команда разработки", gradient: "from-purple-500 to-cyan-400" },
  { id: "n2", type: "poll", title: "Новый опрос", body: "Светлана П. создала опрос «Цветовая схема для проекта»", time: "23 мин назад", read: false, chatName: "Дизайн & UI", gradient: "from-pink-500 to-orange-400" },
  { id: "n3", type: "join", title: "Новый участник", body: "Ольга Н. присоединилась к чату", time: "1 час назад", read: false, chatName: "Маркетинг", gradient: "from-green-400 to-cyan-500" },
  { id: "n4", type: "message", title: "Новые сообщения", body: "18 новых сообщений в чате Геймеры", time: "2 часа назад", read: true, chatName: "Геймеры", gradient: "from-violet-500 to-purple-700" },
  { id: "n5", type: "system", title: "Обновление системы", body: "Платформа обновлена до версии 2.5.0 — добавлены реакции на сообщения", time: "Вчера", read: true, gradient: "from-gray-500 to-gray-600" },
  { id: "n6", type: "poll", title: "Опрос завершён", body: "Опрос «Когда спринт-ревью?» завершился. Побеждает: Пятница 15:00", time: "Вчера", read: true, chatName: "Команда разработки", gradient: "from-purple-500 to-cyan-400" },
];

const typeIcon = {
  message: "MessageCircle",
  poll: "BarChart3",
  mention: "AtSign",
  join: "UserPlus",
  system: "Zap",
} as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const shown = notifications.filter((n) => filter === "all" || !n.read);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-white">Уведомления</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-purple-400 mt-0.5">{unreadCount} непрочитанных</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Icon name="CheckCheck" size={14} />
            Прочитать все
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-xl w-fit">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? "bg-gradient-to-r from-purple-500/30 to-cyan-500/20 text-white border border-purple-500/20" : "text-muted-foreground hover:text-white"
            }`}
          >
            {f === "all" ? "Все" : `Непрочитанные ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {shown.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <Icon name="BellOff" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Нет уведомлений</p>
          </div>
        )}
        {shown.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/5 group animate-fade-in ${
              !n.read ? "glass border-l-2 border-purple-500" : "bg-white/3"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${n.gradient} flex items-center justify-center shrink-0`}>
              <Icon name={typeIcon[n.type]} size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium ${!n.read ? "text-white" : "text-muted-foreground"}`}>
                  {n.title}
                </p>
                <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
              {n.chatName && (
                <span className="text-xs text-purple-400/70 mt-1 block">{n.chatName}</span>
              )}
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1.5 animate-pulse-slow" />}
            <button
              onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all shrink-0"
            >
              <Icon name="X" size={12} className="text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
