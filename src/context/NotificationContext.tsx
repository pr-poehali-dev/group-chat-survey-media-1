import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface AppNotification {
  id: string;
  type: "message" | "poll" | "mention" | "join" | "topic_message" | "topic_poll" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  chatName?: string;
  topicName?: string;
  gradient: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const initialNotifications: AppNotification[] = [
  { id: "n1", type: "mention", title: "Упомянули вас", body: "@Алексей, посмотри PR — нужна твоя правка", time: "5 мин назад", read: false, chatName: "Команда разработки", gradient: "from-purple-500 to-cyan-400" },
  { id: "n2", type: "poll", title: "Новый опрос", body: "Светлана П. создала опрос «Цветовая схема для проекта»", time: "23 мин назад", read: false, chatName: "Дизайн & UI", gradient: "from-pink-500 to-orange-400" },
  { id: "n3", type: "topic_message", title: "Новое сообщение в теме", body: "Дмитрий В.: «Фикс #87 задеплоен в прод»", time: "1 час назад", chatName: "Команда разработки", topicName: "Баги и фиксы", read: false, gradient: "from-red-500 to-orange-400" },
  { id: "n4", type: "join", title: "Новый участник", body: "Ольга Н. присоединилась к чату", time: "2 часа назад", read: true, chatName: "Маркетинг", gradient: "from-green-400 to-cyan-500" },
  { id: "n5", type: "message", title: "Новые сообщения", body: "18 новых сообщений в чате Геймеры", time: "3 часа назад", read: true, chatName: "Геймеры", gradient: "from-violet-500 to-purple-700" },
  { id: "n6", type: "system", title: "Обновление системы", body: "Платформа обновлена до версии 2.5.0", time: "Вчера", read: true, gradient: "from-gray-500 to-gray-600" },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const addNotification = useCallback((n: Omit<AppNotification, "id" | "time" | "read">) => {
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    setNotifications((prev) => [
      { ...n, id: `notif_${Date.now()}`, time: now, read: false },
      ...prev,
    ]);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markRead, markAllRead, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
