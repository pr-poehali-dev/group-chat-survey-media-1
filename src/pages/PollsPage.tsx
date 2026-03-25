import { useState } from "react";
import { polls as initialPolls, chats, type Poll } from "@/data/mockData";
import Icon from "@/components/ui/icon";

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [showCreate, setShowCreate] = useState(false);
  const [filterChat, setFilterChat] = useState("all");
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);

  const filtered = polls.filter((p) => filterChat === "all" || p.chatId === filterChat);

  const vote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVoted?.includes(optionId)) return poll;
        const newVoted = poll.multipleChoice
          ? [...(poll.userVoted ?? []), optionId]
          : [optionId];
        return {
          ...poll,
          userVoted: newVoted,
          totalVotes: poll.userVoted?.length ? poll.totalVotes : poll.totalVotes + 1,
          options: poll.options.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
        };
      })
    );
  };

  const addOption = () => {
    if (newOptions.length < 6) setNewOptions([...newOptions, ""]);
  };

  const createPoll = () => {
    if (!newQuestion.trim() || newOptions.filter((o) => o.trim()).length < 2) return;
    const poll: Poll = {
      id: `p_${Date.now()}`,
      chatId: "c1",
      question: newQuestion,
      options: newOptions.filter((o) => o.trim()).map((text, i) => ({
        id: `o_new_${i}`,
        text,
        votes: 0,
        voters: [],
      })),
      createdBy: "Алексей М.",
      createdAt: new Date().toISOString().split("T")[0],
      anonymous: isAnonymous,
      multipleChoice: isMultiple,
      totalVotes: 0,
    };
    setPolls((prev) => [poll, ...prev]);
    setShowCreate(false);
    setNewQuestion("");
    setNewOptions(["", ""]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-white">Опросы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{polls.length} активных опросов</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-medium hover:opacity-90 transition-opacity neon-glow-purple"
        >
          <Icon name="Plus" size={16} />
          Создать опрос
        </button>
      </div>

      {/* Filter by chat */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterChat("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
            filterChat === "all"
              ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
              : "bg-white/5 text-muted-foreground hover:text-white"
          }`}
        >
          Все чаты
        </button>
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setFilterChat(chat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
              filterChat === chat.id
                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
                : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            {chat.name}
          </button>
        ))}
      </div>

      {/* Polls */}
      <div className="space-y-4">
        {filtered.map((poll) => {
          const chatName = chats.find((c) => c.chatId === poll.chatId)?.name ?? chats.find((c) => c.id === poll.chatId)?.name;
          const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);
          const hasVoted = (poll.userVoted?.length ?? 0) > 0;

          return (
            <div key={poll.id} className="glass rounded-2xl p-5 space-y-4 hover:border-purple-500/20 transition-all animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">{chatName}</span>
                    {poll.anonymous && (
                      <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon name="EyeOff" size={10} /> Анонимный
                      </span>
                    )}
                    {poll.multipleChoice && (
                      <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon name="CheckSquare" size={10} /> Мультивыбор
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-white leading-snug">{poll.question}</h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold gradient-text">{poll.totalVotes}</p>
                  <p className="text-xs text-muted-foreground">голосов</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {poll.options.map((option) => {
                  const percent = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const isVoted = poll.userVoted?.includes(option.id);
                  const isLeading = option.votes === maxVotes && option.votes > 0;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !hasVoted && vote(poll.id, option.id)}
                      disabled={hasVoted && !poll.multipleChoice}
                      className={`w-full text-left group ${hasVoted && !poll.multipleChoice ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            isVoted
                              ? "border-purple-400 bg-purple-500"
                              : "border-white/20 group-hover:border-purple-400"
                          }`}>
                            {isVoted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className={`text-sm ${isVoted ? "text-white font-medium" : "text-muted-foreground"}`}>
                            {option.text}
                          </span>
                          {isLeading && <Icon name="TrendingUp" size={12} className="text-cyan-400" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isVoted
                              ? "bg-gradient-to-r from-purple-500 to-cyan-400"
                              : isLeading
                              ? "bg-gradient-to-r from-cyan-500/60 to-purple-500/60"
                              : "bg-white/20"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-white/8">
                <span>Создал: {poll.createdBy}</span>
                <span>{poll.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create poll modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in border border-white/12">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h3 className="font-display font-bold text-white">Новый опрос</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Вопрос</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Введите вопрос для голосования..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">Варианты ответов</label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[i] = e.target.value;
                        setNewOptions(updated);
                      }}
                      placeholder={`Вариант ${i + 1}`}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
                    />
                    {newOptions.length > 2 && (
                      <button
                        onClick={() => setNewOptions(newOptions.filter((_, j) => j !== i))}
                        className="w-9 h-9 shrink-0 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      >
                        <Icon name="X" size={14} className="text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
                {newOptions.length < 6 && (
                  <button
                    onClick={addOption}
                    className="w-full py-2 rounded-xl border border-dashed border-white/15 text-xs text-muted-foreground hover:border-purple-500/40 hover:text-white transition-all"
                  >
                    + Добавить вариант
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-9 h-5 rounded-full transition-colors ${isAnonymous ? "bg-purple-500" : "bg-white/10"} relative`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isAnonymous ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">Анонимный</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setIsMultiple(!isMultiple)}
                    className={`w-9 h-5 rounded-full transition-colors ${isMultiple ? "bg-cyan-500" : "bg-white/10"} relative`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isMultiple ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">Мультивыбор</span>
                </label>
              </div>
              <button
                onClick={createPoll}
                disabled={!newQuestion.trim() || newOptions.filter((o) => o.trim()).length < 2}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 neon-glow-purple"
              >
                Создать опрос
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
