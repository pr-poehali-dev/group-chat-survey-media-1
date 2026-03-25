import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

function Toggle({ value, onChange, color = "bg-purple-500" }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? color : "bg-white/10"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

interface SettingRowProps {
  icon: string;
  iconColor: string;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

function SettingRow({ icon, iconColor, label, description, right, onClick }: SettingRowProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 ${onClick ? "cursor-pointer hover:bg-white/5" : ""} transition-colors rounded-xl group`}
      onClick={onClick}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon name={icon} size={17} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {right ?? (onClick && <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-white transition-colors" />)}
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [pollResults, setPollResults] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [darkAnimations, setDarkAnimations] = useState(true);

  const sections = [
    {
      title: "Уведомления",
      items: [
        { icon: "Bell", iconColor: "bg-purple-500/80", label: "Push-уведомления", description: "Получать уведомления", right: <Toggle value={notifications} onChange={setNotifications} /> },
        { icon: "Volume2", iconColor: "bg-cyan-500/80", label: "Звуки", description: "Звуки сообщений", right: <Toggle value={sounds} onChange={setSounds} color="bg-cyan-500" /> },
        { icon: "AtSign", iconColor: "bg-pink-500/80", label: "Упоминания", description: "Уведомлять при @упоминании", right: <Toggle value={mentions} onChange={setMentions} color="bg-pink-500" /> },
        { icon: "BarChart3", iconColor: "bg-orange-500/80", label: "Результаты опросов", description: "Уведомлять о завершении", right: <Toggle value={pollResults} onChange={setPollResults} color="bg-orange-500" /> },
      ],
    },
    {
      title: "Приватность",
      items: [
        { icon: "Eye", iconColor: "bg-green-500/80", label: "Статус прочтения", description: "Показывать, что прочитали", right: <Toggle value={readReceipts} onChange={setReadReceipts} color="bg-green-500" /> },
        { icon: "Wifi", iconColor: "bg-blue-500/80", label: "Статус онлайн", description: "Видимость для других", right: <Toggle value={onlineStatus} onChange={setOnlineStatus} color="bg-blue-500" /> },
      ],
    },
    {
      title: "Внешний вид",
      items: [
        { icon: "Play", iconColor: "bg-violet-500/80", label: "Автовоспроизведение", description: "GIF и видео в чате", right: <Toggle value={autoplay} onChange={setAutoplay} color="bg-violet-500" /> },
        { icon: "Layout", iconColor: "bg-indigo-500/80", label: "Компактный режим", description: "Уменьшить отступы", right: <Toggle value={compactMode} onChange={setCompactMode} color="bg-indigo-500" /> },
        { icon: "Sparkles", iconColor: "bg-yellow-500/80", label: "Анимации", description: "Плавные переходы и эффекты", right: <Toggle value={darkAnimations} onChange={setDarkAnimations} color="bg-yellow-500" /> },
      ],
    },
    {
      title: "Аккаунт",
      items: [
        { icon: "Key", iconColor: "bg-red-500/80", label: "Изменить пароль", onClick: () => {} },
        { icon: "Shield", iconColor: "bg-teal-500/80", label: "Двухфакторная аутентификация", onClick: () => {} },
        { icon: "Download", iconColor: "bg-gray-500/80", label: "Скачать мои данные", onClick: () => {} },
        { icon: "LogOut", iconColor: "bg-red-600/80", label: "Выйти", onClick: () => {} },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-xl text-white">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Управление аккаунтом и приложением</p>
      </div>

      {/* App info card */}
      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center neon-glow-purple">
          <Icon name="Zap" size={24} className="text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white gradient-text text-lg">ChatFlow</h2>
          <p className="text-xs text-muted-foreground">Версия 2.5.0 · Всё работает отлично 🚀</p>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</h3>
            <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
              {section.items.map((item) => (
                <SettingRow key={item.label} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">ChatFlow © 2024 · Сделано с ❤️</p>
    </div>
  );
}
