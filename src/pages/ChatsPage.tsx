import { useState } from "react";
import { chats, polls as allPolls, currentUser, type Chat, type Member, type Message, type Poll } from "@/data/mockData";
import Icon from "@/components/ui/icon";

type ModalType = "members" | "addMember" | "attachPoll" | null;

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [messages, setMessages] = useState<Message[]>(chats[0]?.messages ?? []);
  const [inputText, setInputText] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatPolls, setChatPolls] = useState<Poll[]>(allPolls);

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setShowSidebar(false);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: inputText,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const sendPoll = (poll: Poll) => {
    if (!selectedChat) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: "",
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type: "poll",
      pollId: poll.id,
    };
    setMessages((prev) => [...prev, newMsg]);
    setModal(null);
  };

  const voteInChat = (pollId: string, optionId: string) => {
    setChatPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVoted?.includes(optionId)) return poll;
        const newVoted = poll.multipleChoice
          ? [...(poll.userVoted ?? []), optionId]
          : [optionId];
        return {
          ...poll,
          userVoted: newVoted,
          totalVotes: (poll.userVoted?.length ?? 0) === 0 ? poll.totalVotes + 1 : poll.totalVotes,
          options: poll.options.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
        };
      })
    );
  };

  const roleLabel = (role: Member["role"]) => {
    if (role === "admin") return { label: "Администратор", color: "text-purple-400 bg-purple-500/10" };
    if (role === "moderator") return { label: "Модератор", color: "text-cyan-400 bg-cyan-500/10" };
    return { label: "Участник", color: "text-muted-foreground bg-white/5" };
  };

  const statusColor = (status: Member["status"]) => {
    if (status === "online") return "bg-green-400";
    if (status === "away") return "bg-yellow-400";
    return "bg-gray-500";
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Chat list */}
      <div className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 glass border-r border-white/8 shrink-0 absolute md:relative z-10 inset-0 md:inset-auto`}>
        <div className="p-4 border-b border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-white">Чаты</h2>
            <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center hover:scale-105 transition-transform">
              <Icon name="Plus" size={16} className="text-white" />
            </button>
          </div>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5 ${
                selectedChat?.id === chat.id ? "bg-purple-500/10 border border-purple-500/20" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chat.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{chat.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.lastTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className="ml-2 min-w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs flex items-center justify-center px-1 shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      {selectedChat ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 glass border-b border-white/8 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden mr-1" onClick={() => setShowSidebar(true)}>
                <Icon name="ChevronLeft" size={20} className="text-muted-foreground" />
              </button>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedChat.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                {selectedChat.avatar}
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">{selectedChat.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedChat.membersCount} участников</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal("members")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs text-muted-foreground hover:text-white"
              >
                <Icon name="Users" size={14} />
                <span className="hidden sm:block">Участники</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.userId === currentUser.id;

              if (msg.type === "poll" && msg.pollId) {
                const poll = chatPolls.find((p) => p.id === msg.pollId);
                if (!poll) return null;
                const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);
                const hasVoted = (poll.userVoted?.length ?? 0) > 0;
                return (
                  <div key={msg.id} className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                      {msg.avatar}
                    </div>
                    <div className="max-w-sm flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground px-1">{msg.userName}</span>
                      <div className="glass rounded-2xl rounded-tl-sm p-4 space-y-3 border border-purple-500/20 message-bubble-in">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                            <Icon name="BarChart3" size={12} className="text-white" />
                          </div>
                          <span className="text-xs text-purple-400 font-medium">Опрос</span>
                          {poll.anonymous && <span className="text-xs text-muted-foreground">· Анонимный</span>}
                        </div>
                        <p className="text-sm font-medium text-white leading-snug">{poll.question}</p>
                        <div className="space-y-2">
                          {poll.options.map((option) => {
                            const percent = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                            const isVoted = poll.userVoted?.includes(option.id);
                            const isLeading = option.votes === maxVotes && option.votes > 0;
                            return (
                              <button
                                key={option.id}
                                onClick={() => !hasVoted && voteInChat(poll.id, option.id)}
                                disabled={hasVoted && !poll.multipleChoice}
                                className="w-full text-left"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${isVoted ? "border-purple-400 bg-purple-500" : "border-white/20"}`}>
                                      {isVoted && <div className="w-1 h-1 rounded-full bg-white" />}
                                    </div>
                                    <span className={`text-xs ${isVoted ? "text-white font-medium" : "text-muted-foreground"}`}>{option.text}</span>
                                    {isLeading && hasVoted && <Icon name="TrendingUp" size={10} className="text-cyan-400" />}
                                  </div>
                                  {hasVoted && <span className="text-xs text-muted-foreground">{percent}%</span>}
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${isVoted ? "bg-gradient-to-r from-purple-500 to-cyan-400" : "bg-white/15"}`}
                                    style={{ width: hasVoted ? `${percent}%` : "0%" }}
                                  />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">{poll.totalVotes} голосов · {msg.time}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex gap-3 animate-fade-in ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                      {msg.avatar}
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    {!isOwn && <span className="text-xs text-muted-foreground px-1">{msg.userName}</span>}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm message-bubble-in ${
                      isOwn
                        ? "bg-gradient-to-r from-purple-500/80 to-cyan-500/80 text-white rounded-tr-sm"
                        : "glass text-white rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-2 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex gap-1">
                          {msg.reactions.map((r, i) => (
                            <span key={i} className="text-xs bg-white/10 rounded-full px-2 py-0.5 cursor-pointer hover:bg-white/20 transition-colors">
                              {r.emoji} {r.count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 glass border-t border-white/8 shrink-0">
            <div className="flex gap-2 items-end">
              <button
                onClick={() => setModal("attachPoll")}
                className="w-10 h-10 shrink-0 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:border hover:border-purple-500/30 flex items-center justify-center transition-all group"
                title="Прикрепить опрос"
              >
                <Icon name="BarChart3" size={18} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <button className="w-10 h-10 shrink-0 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <Icon name="Smile" size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40 disabled:scale-100 neon-glow-purple"
              >
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
              <Icon name="MessageCircle" size={28} className="text-purple-400" />
            </div>
            <p className="text-muted-foreground text-sm">Выберите чат</p>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {modal === "members" && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in border border-white/12">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <div>
                <h3 className="font-display font-bold text-white">Участники</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedChat.members.length} участников</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal("addMember")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs text-purple-300 hover:text-white transition-colors"
                >
                  <Icon name="UserPlus" size={13} />
                  Добавить
                </button>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {selectedChat.members.map((member) => {
                const rl = roleLabel(member.role);
                return (
                  <div key={member.id} className={`flex items-center gap-3 p-3 rounded-xl ${member.banned ? "opacity-50" : ""} hover:bg-white/5 group transition-all`}>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                        {member.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${statusColor(member.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{member.name}</span>
                        {member.banned && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Забанен</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${rl.color}`}>
                        {rl.label}
                      </span>
                    </div>
                    {member.id !== currentUser.id && (
                      <div className="hidden group-hover:flex items-center gap-1">
                        {!member.banned && member.role === "member" && (
                          <button className="w-7 h-7 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 flex items-center justify-center transition-colors" title="Сделать модератором">
                            <Icon name="Shield" size={13} className="text-cyan-400" />
                          </button>
                        )}
                        <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          member.banned ? "bg-green-500/10 hover:bg-green-500/20" : "bg-red-500/10 hover:bg-red-500/20"
                        }`} title={member.banned ? "Разбанить" : "Забанить"}>
                          <Icon name={member.banned ? "UserCheck" : "Ban"} size={13} className={member.banned ? "text-green-400" : "text-red-400"} />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors" title="Исключить">
                          <Icon name="UserX" size={13} className="text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add member Modal */}
      {modal === "addMember" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-sm p-6 animate-scale-in border border-white/12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white">Добавить участника</h3>
              <button onClick={() => setModal("members")} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Имя или @username</label>
                <input
                  type="text"
                  placeholder="Поиск пользователя..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Роль</label>
                <select className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50">
                  <option value="member" className="bg-background">Участник</option>
                  <option value="moderator" className="bg-background">Модератор</option>
                </select>
              </div>
              <button
                onClick={() => setModal("members")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-medium hover:opacity-90 transition-opacity neon-glow-purple"
              >
                Добавить в чат
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach Poll Modal */}
      {modal === "attachPoll" && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in border border-white/12">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <div>
                <h3 className="font-display font-bold text-white">Прикрепить опрос</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Выберите опрос для отправки в чат</p>
              </div>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatPolls.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm">Нет доступных опросов</div>
              )}
              {chatPolls.map((poll) => (
                <button
                  key={poll.id}
                  onClick={() => sendPoll(poll)}
                  className="w-full text-left p-4 glass rounded-xl hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shrink-0">
                      <Icon name="BarChart3" size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors leading-snug">{poll.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{poll.options.length} варианта · {poll.totalVotes} голосов</span>
                        {poll.anonymous && (
                          <span className="text-xs text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Icon name="EyeOff" size={9} /> Анонимный
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {poll.options.slice(0, 3).map((o) => (
                          <span key={o.id} className="text-xs bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full truncate max-w-24">
                            {o.text}
                          </span>
                        ))}
                        {poll.options.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{poll.options.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <Icon name="Send" size={15} className="text-muted-foreground group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}