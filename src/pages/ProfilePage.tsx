import { useState } from "react";
import { currentUser, chats } from "@/data/mockData";
import Icon from "@/components/ui/icon";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Алексей Морозов");
  const [bio, setBio] = useState("Fullstack разработчик · Люблю кофе и чистый код ☕");
  const [username, setUsername] = useState("@aleksey_m");

  const stats = [
    { label: "Чатов", value: chats.length, icon: "MessageCircle", color: "text-purple-400" },
    { label: "Опросов", value: 8, icon: "BarChart3", color: "text-cyan-400" },
    { label: "Медиа", value: 24, icon: "Images", color: "text-pink-400" },
    { label: "Реакций", value: 142, icon: "Heart", color: "text-orange-400" },
  ];

  const myChats = chats.filter((c) => c.members.some((m) => m.id === currentUser.id));

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)"
        }} />
        <button className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
          <Icon name="Camera" size={16} className="text-white" />
        </button>
      </div>

      <div className="px-4 md:px-6">
        {/* Avatar & name */}
        <div className="flex items-end justify-between -mt-12 mb-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-background flex items-center justify-center text-3xl font-bold text-white">
              А
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background" />
          </div>
          <div className="flex gap-2 mb-1">
            {editMode ? (
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-medium neon-glow-purple"
              >
                <Icon name="Check" size={14} />
                Сохранить
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
              >
                <Icon name="Edit3" size={14} />
                Редактировать
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 mb-5">
          {editMode ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold bg-white/5 border border-purple-500/40 rounded-xl px-3 py-1.5 text-white focus:outline-none w-full"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-muted-foreground focus:outline-none w-full"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-muted-foreground focus:outline-none w-full resize-none"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white">{name}</h2>
              <p className="text-sm text-purple-400">{username}</p>
              <p className="text-sm text-muted-foreground">{bio}</p>
            </>
          )}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/20">
              Администратор
            </span>
            <span className="text-xs text-muted-foreground">Участник с января 2024</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <Icon name={stat.icon} size={18} className={`${stat.color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* My chats */}
        <div>
          <h3 className="font-medium text-white mb-3 text-sm">Мои чаты</h3>
          <div className="space-y-2">
            {myChats.map((chat) => {
              const myRole = chat.members.find((m) => m.id === currentUser.id)?.role;
              const roleMap = { admin: { label: "Администратор", color: "text-purple-400 bg-purple-500/10" }, moderator: { label: "Модератор", color: "text-cyan-400 bg-cyan-500/10" }, member: { label: "Участник", color: "text-muted-foreground bg-white/5" } };
              const rl = roleMap[myRole ?? "member"];
              return (
                <div key={chat.id} className="flex items-center gap-3 p-3 glass rounded-xl hover:border-purple-500/20 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chat.gradient} flex items-center justify-center text-xs font-bold text-white`}>
                    {chat.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{chat.name}</p>
                    <p className="text-xs text-muted-foreground">{chat.membersCount} участников</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rl.color}`}>{rl.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
